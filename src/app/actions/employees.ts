'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  requireSuperAdmin,
  requireAdmin,
  logAuditEvent,
  canManageEmployee,
  getCurrentProfile,
} from '@/lib/auth/helpers'
import {
  generateSecurePassword,
  generatePhotoStoragePath,
  buildLoginUrl,
  generateLoginRef,
} from '@/lib/security/utils'
import { getBaseUrl } from '@/lib/utils/url'
import {
  employeeRegistrationSchema,
  employeeEditSchema,
  validatePhotoFile,
  type EmployeeEditInput,
} from '@/lib/validation/schemas'
import type {
  ApiResponse,
  CredentialResponse,
  Employee,
  EmployeeWithRelations,
  PaginatedResponse,
  AccountStatus,
  ApplicationStatus,
} from '@/types/database'

// ---------------------------------------------------------------------------
// Helper: build employee code from auto-increment seq
// ---------------------------------------------------------------------------
async function generateEmployeeCode(): Promise<string> {
  const adminClient = createAdminClient()
  // Count existing employees to generate a sequential code
  const { count } = await adminClient
    .from('employees')
    .select('*', { count: 'exact', head: true })
  const seq = String((count ?? 0) + 1).padStart(5, '0')
  return `EMP-${seq}`
}

// ---------------------------------------------------------------------------
// registerEmployee
// ---------------------------------------------------------------------------
export async function registerEmployee(
  formData: FormData
): Promise<ApiResponse<CredentialResponse>> {
  try {
    const actorProfile = await requireAdmin()

    const rawData = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      passport_number: formData.get('passport_number') as string,
      registration_date: formData.get('registration_date') as string,
      job_offer_id: formData.get('job_offer_id') as string,
      account_status: (formData.get('account_status') as AccountStatus) ?? 'active',
      phone: (formData.get('phone') as string) || undefined,
      nationality: (formData.get('nationality') as string) || undefined,
      date_of_birth: (formData.get('date_of_birth') as string) || undefined,
      passport_expiry_date: (formData.get('passport_expiry_date') as string) || undefined,
      internal_notes: (formData.get('internal_notes') as string) || undefined,
    }

    const parsed = employeeRegistrationSchema.safeParse(rawData)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Validation failed'
      return { success: false, error: firstError }
    }

    const data = parsed.data

    // Super admin must select a job offer, sub-admin cannot assign one
    if (actorProfile.role === 'super_admin' && !rawData.job_offer_id) {
      return { success: false, error: 'Please select a job offer category for this employee.' }
    }
    const finalJobOfferId = actorProfile.role === 'super_admin' ? (data.job_offer_id || null) : null

    const adminClient = createAdminClient()

    // Check for duplicate email
    const { data: existingUser } = await adminClient.auth.admin.listUsers()
    const emailExists = existingUser?.users?.some(
      (u: { email?: string }) => u.email?.toLowerCase() === data.email.toLowerCase()
    )
    if (emailExists) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    // Check for duplicate passport
    const { data: existingPassport } = await adminClient
      .from('employees')
      .select('id')
      .eq('passport_number', data.passport_number)
      .maybeSingle()
    if (existingPassport) {
      return { success: false, error: 'An employee with this passport number already exists.' }
    }

    const temporaryPassword = generateSecurePassword(16)
    const employeeCode = await generateEmployeeCode()
    const loginRef = generateLoginRef()

    // 1. Create auth user
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name,
        role: 'employee',
      },
    })

    if (authError || !authUser?.user) {
      console.error('Auth user creation error:', authError)
      return { success: false, error: authError?.message ?? 'Failed to create user account.' }
    }

    const userId = authUser.user.id

    // 2. Update profile (trigger should have created it, but upsert to be safe)
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        id: userId,
        full_name: data.full_name,
        email: data.email,
        role: 'employee',
        account_status: data.account_status,
        must_change_password: true,
      })

    if (profileError) {
      // Rollback auth user
      await adminClient.auth.admin.deleteUser(userId)
      return { success: false, error: 'Failed to create user profile.' }
    }

    // 3. Create employee record
    const supabase = await createClient()
    const { data: { user: actor } } = await supabase.auth.getUser()

    const { data: employee, error: empError } = await adminClient
      .from('employees')
      .insert({
        user_id: userId,
        employee_code: employeeCode,
        full_name: data.full_name,
        email: data.email,
        passport_number: data.passport_number,
        registration_date: data.registration_date,
        job_offer_id: finalJobOfferId,
        account_status: data.account_status,
        application_status: 'pending',
        phone: data.phone || null,
        nationality: data.nationality || null,
        date_of_birth: data.date_of_birth || null,
        passport_expiry_date: data.passport_expiry_date || null,
        internal_notes: data.internal_notes || null,
        created_by: actor?.id || null,
        assigned_sub_admin_id: actorProfile.role === 'sub_admin' ? actorProfile.id : null,
      })
      .select()
      .single()

    if (empError || !employee) {
      // Rollback auth user
      await adminClient.auth.admin.deleteUser(userId)
      return { success: false, error: 'Failed to create employee record.' }
    }

    // If registered by sub-admin, also add to sub_admin_assignments table
    if (actorProfile.role === 'sub_admin') {
      await adminClient.from('sub_admin_assignments').insert({
        sub_admin_id: actorProfile.id,
        employee_id: employee.id,
        assigned_by: actorProfile.id,
      })
    }

    // 4. Store login ref for pre-fill hint
    await adminClient.from('employee_login_refs').insert({
      employee_id: employee.id,
      ref_token: loginRef,
      is_active: true,
    })

    // 5. Log audit event
    await logAuditEvent('employee.registered', 'employee', employee.id, {
      employee_code: employeeCode,
      email: data.email,
      full_name: data.full_name,
    })

    revalidatePath('/admin/employees')

    const baseUrl = await getBaseUrl()
    const loginUrl = buildLoginUrl(baseUrl, loginRef)

    return {
      success: true,
      data: {
        employee_name: data.full_name,
        email: data.email,
        temporary_password: temporaryPassword,
        login_url: loginUrl,
        employee_id: employee.id,
        employee_code: employeeCode,
      },
    }
  } catch (error) {
    console.error('registerEmployee error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// updateEmployee
// ---------------------------------------------------------------------------
export async function updateEmployee(
  id: string,
  data: EmployeeEditInput
): Promise<ApiResponse<Employee>> {
  try {
    const profile = await requireAdmin()

    // Sub-admins can only update their assigned employees
    if (profile.role === 'sub_admin') {
      const allowed = await canManageEmployee(id)
      if (!allowed) {
        return { success: false, error: 'You are not authorized to edit this employee.' }
      }
    }

    const parsed = employeeEditSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Validation failed'
      return { success: false, error: firstError }
    }

    const validData = parsed.data
    const adminClient = createAdminClient()

    // Check for duplicate passport (excluding self)
    const { data: dupPassport } = await adminClient
      .from('employees')
      .select('id')
      .eq('passport_number', validData.passport_number)
      .neq('id', id)
      .maybeSingle()
    if (dupPassport) {
      return { success: false, error: 'Another employee with this passport number already exists.' }
    }

    // Check for duplicate email (excluding self)
    const { data: dupEmail } = await adminClient
      .from('employees')
      .select('id')
      .eq('email', validData.email)
      .neq('id', id)
      .maybeSingle()
    if (dupEmail) {
      return { success: false, error: 'Another employee with this email already exists.' }
    }

    const updatePayload: Record<string, any> = {
      full_name: validData.full_name,
      email: validData.email,
      passport_number: validData.passport_number,
      registration_date: validData.registration_date,
      application_status: validData.application_status,
      account_status: validData.account_status,
      phone: validData.phone || null,
      nationality: validData.nationality || null,
      date_of_birth: validData.date_of_birth || null,
      passport_expiry_date: validData.passport_expiry_date || null,
      internal_notes: validData.internal_notes || null,
    }

    // Only super admin can assign or modify job offer
    if (profile.role === 'super_admin') {
      updatePayload.job_offer_id = validData.job_offer_id || null
    }

    const { data: updated, error } = await adminClient
      .from('employees')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('updateEmployee error:', error)
      return { success: false, error: 'Failed to update employee.' }
    }

    // Sync email to profile and auth user
    if (updated.user_id) {
      await adminClient
        .from('profiles')
        .update({ full_name: validData.full_name, email: validData.email })
        .eq('id', updated.user_id)

      await adminClient.auth.admin.updateUserById(updated.user_id, {
        email: validData.email,
      })
    }

    await logAuditEvent('employee.updated', 'employee', id, {
      changes: Object.keys(data),
      updated_by_role: profile.role,
    })

    revalidatePath('/admin/employees')
    revalidatePath(`/dashboard/employees/${id}`)

    return { success: true, data: updated }
  } catch (error) {
    console.error('updateEmployee error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// deleteEmployee (soft delete)
// ---------------------------------------------------------------------------
export async function deleteEmployee(id: string): Promise<ApiResponse> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    // Get employee for audit log
    const { data: employee } = await adminClient
      .from('employees')
      .select('employee_code, full_name, user_id')
      .eq('id', id)
      .single()

    if (!employee) {
      return { success: false, error: 'Employee not found.' }
    }

    // Soft delete: set account_status to suspended and nullify user_id link
    const { error } = await adminClient
      .from('employees')
      .update({ account_status: 'suspended' })
      .eq('id', id)

    if (error) {
      return { success: false, error: 'Failed to delete employee.' }
    }

    // Disable auth account
    if (employee.user_id) {
      await adminClient.auth.admin.updateUserById(employee.user_id, {
        ban_duration: 'none', // Keep record but the account_status check handles it
      })
      await adminClient
        .from('profiles')
        .update({ account_status: 'suspended' })
        .eq('id', employee.user_id)
    }

    await logAuditEvent('employee.deleted', 'employee', id, {
      employee_code: employee.employee_code,
      full_name: employee.full_name,
    })

    revalidatePath('/admin/employees')

    return { success: true }
  } catch (error) {
    console.error('deleteEmployee error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// toggleEmployeeStatus
// ---------------------------------------------------------------------------
export async function toggleEmployeeStatus(
  id: string,
  status: AccountStatus
): Promise<ApiResponse> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { data: employee, error: fetchError } = await adminClient
      .from('employees')
      .select('user_id, full_name, employee_code')
      .eq('id', id)
      .single()

    if (fetchError || !employee) {
      return { success: false, error: 'Employee not found.' }
    }

    const { error } = await adminClient
      .from('employees')
      .update({ account_status: status })
      .eq('id', id)

    if (error) {
      return { success: false, error: 'Failed to update employee status.' }
    }

    // Sync to profile
    if (employee.user_id) {
      await adminClient
        .from('profiles')
        .update({ account_status: status })
        .eq('id', employee.user_id)
    }

    await logAuditEvent('employee.status_changed', 'employee', id, {
      new_status: status,
      employee_code: employee.employee_code,
    })

    revalidatePath('/admin/employees')
    revalidatePath(`/dashboard/employees/${id}`)

    return { success: true }
  } catch (error) {
    console.error('toggleEmployeeStatus error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// resetEmployeePassword
// ---------------------------------------------------------------------------
export async function resetEmployeePassword(
  id: string
): Promise<ApiResponse<{ temporary_password: string; email: string }>> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { data: employee } = await adminClient
      .from('employees')
      .select('user_id, email, full_name, employee_code')
      .eq('id', id)
      .single()

    if (!employee?.user_id) {
      return { success: false, error: 'Employee account not found.' }
    }

    const newPassword = generateSecurePassword(16)

    const { error } = await adminClient.auth.admin.updateUserById(employee.user_id, {
      password: newPassword,
    })

    if (error) {
      return { success: false, error: 'Failed to reset password.' }
    }

    // Force must_change_password
    await adminClient
      .from('profiles')
      .update({ must_change_password: true })
      .eq('id', employee.user_id)

    await logAuditEvent('employee.password_reset', 'employee', id, {
      employee_code: employee.employee_code,
      reset_by: 'super_admin',
    })

    return {
      success: true,
      data: {
        temporary_password: newPassword,
        email: employee.email,
      },
    }
  } catch (error) {
    console.error('resetEmployeePassword error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// getEmployees
// ---------------------------------------------------------------------------
export interface GetEmployeesParams {
  page?: number
  pageSize?: number
  search?: string
  filters?: {
    account_status?: AccountStatus
    application_status?: ApplicationStatus
    job_offer_id?: string
    assigned_sub_admin_id?: string
    registration_date_from?: string
    registration_date_to?: string
  }
}

export async function getEmployees(
  params: GetEmployeesParams = {}
): Promise<ApiResponse<PaginatedResponse<EmployeeWithRelations>>> {
  try {
    const profile = await requireAdmin()

    const {
      page = 1,
      pageSize = 20,
      search = '',
      filters = {},
    } = params

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const adminClient = createAdminClient()

    let query = adminClient
      .from('employees')
      .select(
        `
        *,
        job_offer:job_offers(*),
        assigned_sub_admin:profiles!employees_assigned_sub_admin_id_fkey(*),
        application_letter:application_letters(*)
        `,
        { count: 'exact' }
      )

    // Sub-admins only see their assigned employees
    if (profile.role === 'sub_admin') {
      query = query.eq('assigned_sub_admin_id', profile.id)
    }

    // Search filter
    if (search.trim()) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,passport_number.ilike.%${search}%,employee_code.ilike.%${search}%`
      )
    }

    // Status filters
    if (filters.account_status) {
      query = query.eq('account_status', filters.account_status)
    }
    if (filters.application_status) {
      query = query.eq('application_status', filters.application_status)
    }
    if (filters.job_offer_id) {
      query = query.eq('job_offer_id', filters.job_offer_id)
    }
    if (filters.assigned_sub_admin_id) {
      query = query.eq('assigned_sub_admin_id', filters.assigned_sub_admin_id)
    }
    if (filters.registration_date_from) {
      query = query.gte('registration_date', filters.registration_date_from)
    }
    if (filters.registration_date_to) {
      query = query.lte('registration_date', filters.registration_date_to)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('getEmployees error:', error)
      return { success: false, error: 'Failed to fetch employees.' }
    }

    const total = count ?? 0

    return {
      success: true,
      data: {
        data: (data ?? []) as EmployeeWithRelations[],
        total,
        page,
        page_size: pageSize,
        total_pages: Math.ceil(total / pageSize),
      },
    }
  } catch (error) {
    console.error('getEmployees error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// getEmployee
// ---------------------------------------------------------------------------
export async function getEmployee(
  id: string
): Promise<ApiResponse<EmployeeWithRelations>> {
  try {
    const profile = await requireAdmin()

    // Sub-admins can only view their assigned employees
    if (profile.role === 'sub_admin') {
      const allowed = await canManageEmployee(id)
      if (!allowed) {
        return { success: false, error: 'You are not authorized to view this employee.' }
      }
    }

    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('employees')
      .select(
        `
        *,
        job_offer:job_offers(*),
        assigned_sub_admin:profiles!employees_assigned_sub_admin_id_fkey(*),
        application_letter:application_letters(
          *,
          template:letter_templates(*)
        )
        `
      )
      .eq('id', id)
      .single()

    if (error || !data) {
      return { success: false, error: 'Employee not found.' }
    }

    return { success: true, data: data as EmployeeWithRelations }
  } catch (error) {
    console.error('getEmployee error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// uploadEmployeePhoto
// ---------------------------------------------------------------------------
export async function uploadEmployeePhoto(
  id: string,
  file: File
): Promise<ApiResponse<{ signed_url: string; storage_path: string }>> {
  try {
    const profile = await requireAdmin()

    if (profile.role === 'sub_admin') {
      const allowed = await canManageEmployee(id)
      if (!allowed) {
        return { success: false, error: 'You are not authorized to upload a photo for this employee.' }
      }
    }

    const validationError = validatePhotoFile(file)
    if (validationError) {
      return { success: false, error: validationError }
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const storagePath = generatePhotoStoragePath(id, ext)

    const adminClient = createAdminClient()

    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await adminClient.storage
      .from('employee-photos')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Photo upload error:', uploadError)
      return { success: false, error: 'Failed to upload photo.' }
    }

    // Remove old photo if present
    const { data: employee } = await adminClient
      .from('employees')
      .select('photo_storage_path')
      .eq('id', id)
      .single()

    if (employee?.photo_storage_path) {
      await adminClient.storage
        .from('employee-photos')
        .remove([employee.photo_storage_path])
    }

    // Update employee record
    await adminClient
      .from('employees')
      .update({ photo_storage_path: storagePath })
      .eq('id', id)

    // Return signed URL (60 minutes)
    const { data: signedData, error: signedError } = await adminClient.storage
      .from('employee-photos')
      .createSignedUrl(storagePath, 3600)

    if (signedError || !signedData?.signedUrl) {
      return { success: false, error: 'Photo uploaded but could not generate preview URL.' }
    }

    await logAuditEvent('employee.photo_uploaded', 'employee', id, { storage_path: storagePath })

    revalidatePath(`/dashboard/employees/${id}`)

    return {
      success: true,
      data: {
        signed_url: signedData.signedUrl,
        storage_path: storagePath,
      },
    }
  } catch (error) {
    console.error('uploadEmployeePhoto error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// getEmployeePhotoUrl
// ---------------------------------------------------------------------------
export async function getEmployeePhotoUrl(
  storagePath: string
): Promise<ApiResponse<{ signed_url: string }>> {
  try {
    await requireAdmin()

    const adminClient = createAdminClient()

    const { data, error } = await adminClient.storage
      .from('employee-photos')
      .createSignedUrl(storagePath, 3600) // 1 hour

    if (error || !data?.signedUrl) {
      return { success: false, error: 'Could not generate photo URL.' }
    }

    return { success: true, data: { signed_url: data.signedUrl } }
  } catch (error) {
    console.error('getEmployeePhotoUrl error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// assignSubAdmin
// ---------------------------------------------------------------------------
export async function assignSubAdmin(
  employeeId: string,
  subAdminId: string | null
): Promise<ApiResponse> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    if (subAdminId) {
      // Verify sub-admin exists and has correct role
      const { data: subAdmin } = await adminClient
        .from('profiles')
        .select('id, role, account_status')
        .eq('id', subAdminId)
        .single()

      if (!subAdmin || subAdmin.role !== 'sub_admin') {
        return { success: false, error: 'Invalid sub-admin.' }
      }
      if (subAdmin.account_status !== 'active') {
        return { success: false, error: 'Sub-admin account is not active.' }
      }
    }

    const { error } = await adminClient
      .from('employees')
      .update({ assigned_sub_admin_id: subAdminId })
      .eq('id', employeeId)

    if (error) {
      return { success: false, error: 'Failed to assign sub-admin.' }
    }

    await logAuditEvent('employee.sub_admin_assigned', 'employee', employeeId, {
      sub_admin_id: subAdminId,
    })

    revalidatePath('/dashboard/employees')
    revalidatePath(`/dashboard/employees/${employeeId}`)

    return { success: true }
  } catch (error) {
    console.error('assignSubAdmin error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// exportEmployees (CSV)
// ---------------------------------------------------------------------------
export async function exportEmployees(
  filters: GetEmployeesParams['filters'] = {}
): Promise<ApiResponse<{ csv: string; filename: string }>> {
  try {
    const profile = await requireAdmin()

    const adminClient = createAdminClient()

    let query = adminClient
      .from('employees')
      .select(`*, job_offer:job_offers(title)`)
      .order('created_at', { ascending: false })

    // Sub-admins only export their assigned employees
    if (profile.role === 'sub_admin') {
      query = query.eq('assigned_sub_admin_id', profile.id)
    }

    if (filters?.account_status) query = query.eq('account_status', filters.account_status)
    if (filters?.application_status)
      query = query.eq('application_status', filters.application_status)
    if (filters?.job_offer_id) query = query.eq('job_offer_id', filters.job_offer_id)
    if (filters?.registration_date_from)
      query = query.gte('registration_date', filters.registration_date_from)
    if (filters?.registration_date_to)
      query = query.lte('registration_date', filters.registration_date_to)

    const { data, error } = await query

    if (error) {
      return { success: false, error: 'Failed to fetch employees for export.' }
    }

    const rows = data ?? []

    const headers = [
      'Employee Code',
      'Full Name',
      'Email',
      'Passport Number',
      'Phone',
      'Nationality',
      'Date of Birth',
      'Passport Expiry',
      'Registration Date',
      'Job Offer',
      'Application Status',
      'Account Status',
    ]

    const escapeCell = (val: unknown): string => {
      const str = val === null || val === undefined ? '' : String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const csvLines = [
      headers.join(','),
      ...rows.map((emp: any) =>
        [
          emp.employee_code,
          emp.full_name,
          emp.email,
          emp.passport_number,
          emp.phone,
          emp.nationality,
          emp.date_of_birth,
          emp.passport_expiry_date,
          emp.registration_date,
          (emp.job_offer as { title?: string } | null)?.title ?? '',
          emp.application_status,
          emp.account_status,
        ]
          .map(escapeCell)
          .join(',')
      ),
    ]

    const csv = csvLines.join('\n')
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `orsa-employees-${timestamp}.csv`

    await logAuditEvent('employees.exported', 'employee', null, {
      count: rows.length,
      filters,
    })

    return { success: true, data: { csv, filename } }
  } catch (error) {
    console.error('exportEmployees error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
