'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireSuperAdmin, requireAdmin, logAuditEvent, canManageEmployee } from '@/lib/auth/helpers'
import { generatePdfStoragePath } from '@/lib/security/utils'
import {
  letterTemplateSchema,
  applicationLetterSchema,
  type LetterTemplateInput,
  type ApplicationLetterInput,
} from '@/lib/validation/schemas'
import type {
  ApiResponse,
  LetterTemplate,
  ApplicationLetter,
  LetterVersion,
  LetterContentJson,
} from '@/types/database'

// ---------------------------------------------------------------------------
// getLetterTemplates
// ---------------------------------------------------------------------------
export async function getLetterTemplates(): Promise<ApiResponse<LetterTemplate[]>> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('letter_templates')
      .select(`*, job_offer:job_offers(id, title, slug)`)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: 'Failed to fetch letter templates.' }
    }

    return { success: true, data: (data ?? []) as LetterTemplate[] }
  } catch (error) {
    console.error('getLetterTemplates error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// getLetterTemplate
// ---------------------------------------------------------------------------
export async function getLetterTemplate(id: string): Promise<ApiResponse<LetterTemplate>> {
  try {
    await requireAdmin()

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('letter_templates')
      .select(`*, job_offer:job_offers(id, title, slug)`)
      .eq('id', id)
      .single()

    if (error || !data) {
      return { success: false, error: 'Letter template not found.' }
    }

    return { success: true, data: data as LetterTemplate }
  } catch (error) {
    console.error('getLetterTemplate error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// createLetterTemplate
// ---------------------------------------------------------------------------
export async function createLetterTemplate(
  data: LetterTemplateInput
): Promise<ApiResponse<LetterTemplate>> {
  try {
    const actor = await requireSuperAdmin()

    const parsed = letterTemplateSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Validation failed.'
      return { success: false, error: firstError }
    }

    const validData = parsed.data
    const adminClient = createAdminClient()

    // Check for duplicate name
    const { data: existing } = await adminClient
      .from('letter_templates')
      .select('id')
      .eq('name', validData.name)
      .maybeSingle()

    if (existing) {
      return { success: false, error: 'A template with this name already exists.' }
    }

    const { data: template, error } = await adminClient
      .from('letter_templates')
      .insert({
        name: validData.name,
        job_offer_id: validData.job_offer_id ?? null,
        content_json: validData.content_json,
        content_html: null,
        version: 1,
        is_active: true,
        created_by: actor.id,
        updated_by: actor.id,
      })
      .select()
      .single()

    if (error || !template) {
      console.error('createLetterTemplate error:', error)
      return { success: false, error: 'Failed to create letter template.' }
    }

    await logAuditEvent('letter_template.created', 'letter_template', template.id, {
      name: template.name,
    })

    revalidatePath('/dashboard/letters/templates')

    return { success: true, data: template as LetterTemplate }
  } catch (error) {
    console.error('createLetterTemplate error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// updateLetterTemplate
// ---------------------------------------------------------------------------
export async function updateLetterTemplate(
  id: string,
  data: LetterTemplateInput
): Promise<ApiResponse<LetterTemplate>> {
  try {
    const actor = await requireSuperAdmin()

    const parsed = letterTemplateSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Validation failed.'
      return { success: false, error: firstError }
    }

    const validData = parsed.data
    const adminClient = createAdminClient()

    // Fetch current version
    const { data: current } = await adminClient
      .from('letter_templates')
      .select('version')
      .eq('id', id)
      .single()

    if (!current) {
      return { success: false, error: 'Letter template not found.' }
    }

    const { data: template, error } = await adminClient
      .from('letter_templates')
      .update({
        name: validData.name,
        job_offer_id: validData.job_offer_id ?? null,
        content_json: validData.content_json,
        version: current.version + 1, // Increment version on every update
        updated_by: actor.id,
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !template) {
      console.error('updateLetterTemplate error:', error)
      return { success: false, error: 'Failed to update letter template.' }
    }

    await logAuditEvent('letter_template.updated', 'letter_template', id, {
      name: template.name,
      new_version: template.version,
    })

    revalidatePath('/dashboard/letters/templates')
    revalidatePath(`/dashboard/letters/templates/${id}`)

    return { success: true, data: template as LetterTemplate }
  } catch (error) {
    console.error('updateLetterTemplate error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// getApplicationLetter — get or create
// ---------------------------------------------------------------------------
export async function getApplicationLetter(
  employeeId: string
): Promise<ApiResponse<ApplicationLetter>> {
  try {
    const profile = await requireAdmin()

    // Sub-admins can only view letters for their assigned employees
    if (profile.role === 'sub_admin') {
      const allowed = await canManageEmployee(employeeId)
      if (!allowed) {
        return { success: false, error: 'You are not authorized to view this letter.' }
      }
    }

    const adminClient = createAdminClient()

    // Try to fetch existing
    const { data: existing } = await adminClient
      .from('application_letters')
      .select(`
        *,
        employee:employees(*),
        job_offer:job_offers(*),
        template:letter_templates(*)
      `)
      .eq('employee_id', employeeId)
      .maybeSingle()

    if (existing) {
      return { success: true, data: existing as ApplicationLetter }
    }

    // Get employee's job_offer_id to auto-link
    const { data: employee } = await adminClient
      .from('employees')
      .select('job_offer_id, created_by')
      .eq('id', employeeId)
      .single()

    if (!employee) {
      return { success: false, error: 'Employee not found.' }
    }

    // Create a new letter record
    const { data: created, error: createError } = await adminClient
      .from('application_letters')
      .insert({
        employee_id: employeeId,
        job_offer_id: employee.job_offer_id ?? null,
        template_id: null,
        status: 'not_created',
        current_version: 0,
        letter_date: null,
        rendered_content: null,
        created_by: profile.id,
        updated_by: profile.id,
      })
      .select(`
        *,
        employee:employees(*),
        job_offer:job_offers(*),
        template:letter_templates(*)
      `)
      .single()

    if (createError || !created) {
      console.error('getApplicationLetter create error:', createError)
      return { success: false, error: 'Failed to initialize application letter.' }
    }

    return { success: true, data: created as ApplicationLetter }
  } catch (error) {
    console.error('getApplicationLetter error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// updateApplicationLetter
// ---------------------------------------------------------------------------
export async function updateApplicationLetter(
  id: string,
  data: ApplicationLetterInput
): Promise<ApiResponse<ApplicationLetter>> {
  try {
    const profile = await requireAdmin()

    const parsed = applicationLetterSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Validation failed.'
      return { success: false, error: firstError }
    }

    const validData = parsed.data
    const adminClient = createAdminClient()

    // Fetch letter to check employee access
    const { data: letter } = await adminClient
      .from('application_letters')
      .select('employee_id, status')
      .eq('id', id)
      .single()

    if (!letter) {
      return { success: false, error: 'Application letter not found.' }
    }

    // Issued letters cannot be edited
    if (letter.status === 'issued') {
      return { success: false, error: 'An issued letter cannot be edited.' }
    }

    // Sub-admin access check
    if (profile.role === 'sub_admin') {
      const allowed = await canManageEmployee(letter.employee_id)
      if (!allowed) {
        return { success: false, error: 'You are not authorized to edit this letter.' }
      }
    }

    const updatePayload: Record<string, unknown> = {
      updated_by: profile.id,
    }
    if (validData.template_id !== undefined) updatePayload.template_id = validData.template_id
    if (validData.letter_date !== undefined) updatePayload.letter_date = validData.letter_date
    if (validData.rendered_content !== undefined)
      updatePayload.rendered_content = validData.rendered_content
    if (validData.status !== undefined) updatePayload.status = validData.status

    const { data: updated, error } = await adminClient
      .from('application_letters')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        *,
        employee:employees(*),
        job_offer:job_offers(*),
        template:letter_templates(*)
      `)
      .single()

    if (error || !updated) {
      console.error('updateApplicationLetter error:', error)
      return { success: false, error: 'Failed to update application letter.' }
    }

    await logAuditEvent('application_letter.updated', 'application_letter', id, {
      status: validData.status,
      updated_by_role: profile.role,
    })

    revalidatePath(`/dashboard/employees/${letter.employee_id}`)

    return { success: true, data: updated as ApplicationLetter }
  } catch (error) {
    console.error('updateApplicationLetter error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// issueLetter
// ---------------------------------------------------------------------------
export async function issueLetter(id: string): Promise<ApiResponse<ApplicationLetter>> {
  try {
    const actor = await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { data: letter } = await adminClient
      .from('application_letters')
      .select('*, employee:employees(id, full_name, employee_code)')
      .eq('id', id)
      .single()

    if (!letter) {
      return { success: false, error: 'Application letter not found.' }
    }

    if (letter.status === 'issued') {
      return { success: false, error: 'This letter has already been issued.' }
    }

    if (!letter.rendered_content) {
      return { success: false, error: 'Letter content must be set before issuing.' }
    }

    const newVersion = (letter.current_version ?? 0) + 1
    const issuedAt = new Date().toISOString()

    // Create version snapshot
    const { error: versionError } = await adminClient.from('letter_versions').insert({
      application_letter_id: id,
      version_number: newVersion,
      content_snapshot: letter.rendered_content as LetterContentJson,
      pdf_storage_path: null, // will be populated when PDF is generated
      created_by: actor.id,
      issued_by: actor.id,
      issued_at: issuedAt,
    })

    if (versionError) {
      console.error('issueLetter versionError:', versionError)
      return { success: false, error: 'Failed to create letter version snapshot.' }
    }

    // Update letter status
    const { data: updated, error: updateError } = await adminClient
      .from('application_letters')
      .update({
        status: 'issued',
        current_version: newVersion,
        issued_by: actor.id,
        issued_at: issuedAt,
        updated_by: actor.id,
      })
      .eq('id', id)
      .select(`
        *,
        employee:employees(*),
        job_offer:job_offers(*),
        template:letter_templates(*)
      `)
      .single()

    if (updateError || !updated) {
      return { success: false, error: 'Failed to update letter status to issued.' }
    }

    const employee = updated.employee as { id: string; full_name: string; employee_code: string } | null

    await logAuditEvent('application_letter.issued', 'application_letter', id, {
      version: newVersion,
      employee_id: employee?.id,
      employee_code: employee?.employee_code,
    })

    if (employee?.id) {
      revalidatePath(`/dashboard/employees/${employee.id}`)
    }
    revalidatePath('/dashboard/letters')

    return { success: true, data: updated as ApplicationLetter }
  } catch (error) {
    console.error('issueLetter error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// generateLetterPdf
// ---------------------------------------------------------------------------
export async function generateLetterPdf(
  letterId: string
): Promise<ApiResponse<{ signed_url: string; storage_path: string }>> {
  try {
    const actor = await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { data: letter } = await adminClient
      .from('application_letters')
      .select(`
        *,
        employee:employees(*),
        job_offer:job_offers(*),
        template:letter_templates(*)
      `)
      .eq('id', letterId)
      .single()

    if (!letter) {
      return { success: false, error: 'Application letter not found.' }
    }

    if (letter.status !== 'issued') {
      return { success: false, error: 'Only issued letters can have PDFs generated.' }
    }

    if (!letter.rendered_content) {
      return { success: false, error: 'Letter has no content to generate PDF from.' }
    }

    const employee = letter.employee as { id: string } | null
    if (!employee?.id) {
      return { success: false, error: 'Employee information is missing.' }
    }

    const storagePath = generatePdfStoragePath(employee.id, letterId, letter.current_version)

    // Build a minimal PDF as a Buffer using @react-pdf/renderer
    // The actual rendering is done server-side
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { default: React } = await import('react')
    const { LetterPdfDocument } = await import('@/components/letters/LetterPdfDocument')

    const content = letter.rendered_content as LetterContentJson
    const resolvedJobTitle =
      (Array.isArray(letter.job_offer) ? (letter.job_offer as any)[0]?.title : (letter.job_offer as any)?.title) ||
      (letter.rendered_content as any)?.job_title ||
      (letter.rendered_content as any)?.position ||
      'Construction Worker'

    const pdfBuffer = await renderToBuffer(
      React.createElement(LetterPdfDocument, {
        content,
        employeeName:
          (letter.employee as { full_name?: string } | null)?.full_name ?? 'Employee',
        jobTitle: resolvedJobTitle,
        passportNumber: (letter.employee as any)?.passport_number,
        issueDate: letter.issued_at ?? new Date().toISOString(),
      }) as any
    )

    // Upload to private storage bucket
    const { error: uploadError } = await adminClient.storage
      .from('letter-pdfs')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('generateLetterPdf upload error:', uploadError)
      return { success: false, error: 'Failed to store generated PDF.' }
    }

    // Update letter version record with pdf path
    await adminClient
      .from('letter_versions')
      .update({ pdf_storage_path: storagePath })
      .eq('application_letter_id', letterId)
      .eq('version_number', letter.current_version)

    // Generate signed URL (24 hours)
    const { data: signedData, error: signedError } = await adminClient.storage
      .from('letter-pdfs')
      .createSignedUrl(storagePath, 86400)

    if (signedError || !signedData?.signedUrl) {
      return { success: false, error: 'PDF generated but could not create download link.' }
    }

    await logAuditEvent('application_letter.pdf_generated', 'application_letter', letterId, {
      version: letter.current_version,
      storage_path: storagePath,
      generated_by: actor.id,
    })

    return {
      success: true,
      data: {
        signed_url: signedData.signedUrl,
        storage_path: storagePath,
      },
    }
  } catch (error) {
    console.error('generateLetterPdf error:', error)
    return { success: false, error: 'An unexpected error occurred during PDF generation.' }
  }
}

// ---------------------------------------------------------------------------
// getLetterDownloadUrl
// ---------------------------------------------------------------------------
export async function getLetterDownloadUrl(
  letterId: string
): Promise<ApiResponse<{ signed_url: string }>> {
  try {
    const profile = await requireAdmin()

    const adminClient = createAdminClient()

    const { data: letter } = await adminClient
      .from('application_letters')
      .select('status, employee_id, current_version')
      .eq('id', letterId)
      .single()

    if (!letter) {
      return { success: false, error: 'Letter not found.' }
    }

    if (letter.status !== 'issued') {
      return { success: false, error: 'Only issued letters can be downloaded.' }
    }

    // Permission check for sub-admins
    if (profile.role === 'sub_admin') {
      const allowed = await canManageEmployee(letter.employee_id)
      if (!allowed) {
        return { success: false, error: 'You are not authorized to download this letter.' }
      }
    }

    // Get the PDF path from the letter version
    const { data: version } = await adminClient
      .from('letter_versions')
      .select('pdf_storage_path')
      .eq('application_letter_id', letterId)
      .eq('version_number', letter.current_version)
      .single()

    if (!version?.pdf_storage_path) {
      return { success: false, error: 'PDF has not been generated yet. Please generate it first.' }
    }

    const { data: signedData, error: signedError } = await adminClient.storage
      .from('letter-pdfs')
      .createSignedUrl(version.pdf_storage_path, 3600) // 1 hour

    if (signedError || !signedData?.signedUrl) {
      return { success: false, error: 'Could not generate download link.' }
    }

    return { success: true, data: { signed_url: signedData.signedUrl } }
  } catch (error) {
    console.error('getLetterDownloadUrl error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
