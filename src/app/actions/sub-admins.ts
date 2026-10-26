'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { requireSuperAdmin, logAuditEvent } from '@/lib/auth/helpers'
import { generateSecurePassword, generateLoginRef, buildLoginUrl } from '@/lib/security/utils'
import { getAdminBaseUrl } from '@/lib/utils/url'
import { subAdminSchema, type SubAdminInput } from '@/lib/validation/schemas'
import type { ApiResponse, CredentialResponse, Profile, AccountStatus } from '@/types/database'

// ---------------------------------------------------------------------------
// createSubAdmin
// ---------------------------------------------------------------------------
export async function createSubAdmin(
  data: SubAdminInput
): Promise<ApiResponse<CredentialResponse>> {
  try {
    const actor = await requireSuperAdmin()

    const parsed = subAdminSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Validation failed.'
      return { success: false, error: firstError }
    }

    const validData = parsed.data
    const adminClient = createAdminClient()

    // Check for duplicate email in auth
    const { data: existingUsers } = await adminClient.auth.admin.listUsers()
    const emailExists = existingUsers?.users?.some(
      (u: { email?: string }) => u.email?.toLowerCase() === validData.email.toLowerCase()
    )
    if (emailExists) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const temporaryPassword = generateSecurePassword(16)
    const loginRef = generateLoginRef()

    // Create auth user
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: validData.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: validData.full_name,
        role: 'sub_admin',
      },
    })

    if (authError || !authUser?.user) {
      console.error('createSubAdmin auth error:', authError)
      return { success: false, error: authError?.message ?? 'Failed to create user account.' }
    }

    const userId = authUser.user.id

    // Upsert profile with sub_admin role
    const { error: profileError } = await adminClient.from('profiles').upsert({
      id: userId,
      full_name: validData.full_name,
      email: validData.email,
      role: 'sub_admin',
      account_status: validData.account_status,
      must_change_password: true,
    })

    if (profileError) {
      await adminClient.auth.admin.deleteUser(userId)
      return { success: false, error: 'Failed to create sub-admin profile.' }
    }

    await logAuditEvent('sub_admin.created', 'profile', userId, {
      full_name: validData.full_name,
      email: validData.email,
      created_by: actor.id,
    })

    revalidatePath('/admin/sub-admins')

    const baseUrl = await getAdminBaseUrl()
    const loginUrl = `${baseUrl}/login`

    return {
      success: true,
      data: {
        employee_name: validData.full_name,
        email: validData.email,
        temporary_password: temporaryPassword,
        login_url: loginUrl,
        employee_id: userId,
        employee_code: 'N/A',
      },
    }
  } catch (error) {
    console.error('createSubAdmin error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// updateSubAdmin
// ---------------------------------------------------------------------------
export async function updateSubAdmin(
  id: string,
  data: Partial<SubAdminInput>
): Promise<ApiResponse<Profile>> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    // Verify it's actually a sub_admin
    const { data: existing } = await adminClient
      .from('profiles')
      .select('role, email')
      .eq('id', id)
      .single()

    if (!existing || existing.role !== 'sub_admin') {
      return { success: false, error: 'Sub-admin not found.' }
    }

    const updatePayload: Record<string, unknown> = {}
    if (data.full_name !== undefined) updatePayload.full_name = data.full_name
    if (data.email !== undefined) updatePayload.email = data.email
    if (data.account_status !== undefined) updatePayload.account_status = data.account_status

    const { data: updated, error } = await adminClient
      .from('profiles')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error || !updated) {
      console.error('updateSubAdmin error:', error)
      return { success: false, error: 'Failed to update sub-admin.' }
    }

    // Sync email to auth if changed
    if (data.email && data.email !== existing.email) {
      await adminClient.auth.admin.updateUserById(id, { email: data.email })
    }

    await logAuditEvent('sub_admin.updated', 'profile', id, { changes: Object.keys(data) })

    revalidatePath('/admin/sub-admins')
    revalidatePath(`/dashboard/sub-admins/${id}`)

    return { success: true, data: updated as Profile }
  } catch (error) {
    console.error('updateSubAdmin error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// toggleSubAdminStatus
// ---------------------------------------------------------------------------
export async function toggleSubAdminStatus(
  id: string,
  status: AccountStatus
): Promise<ApiResponse> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('profiles')
      .update({ account_status: status })
      .eq('id', id)
      .eq('role', 'sub_admin')

    if (error) {
      return { success: false, error: 'Failed to update sub-admin status.' }
    }

    await logAuditEvent('sub_admin.status_changed', 'profile', id, { new_status: status })

    revalidatePath('/admin/sub-admins')

    return { success: true }
  } catch (error) {
    console.error('toggleSubAdminStatus error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// resetSubAdminPassword
// ---------------------------------------------------------------------------
export async function resetSubAdminPassword(
  id: string
): Promise<ApiResponse<{ temporary_password: string; email: string }>> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { data: profile } = await adminClient
      .from('profiles')
      .select('email, role')
      .eq('id', id)
      .single()

    if (!profile || profile.role !== 'sub_admin') {
      return { success: false, error: 'Sub-admin not found.' }
    }

    const newPassword = generateSecurePassword(16)

    const { error } = await adminClient.auth.admin.updateUserById(id, {
      password: newPassword,
    })

    if (error) {
      return { success: false, error: 'Failed to reset password.' }
    }

    await adminClient
      .from('profiles')
      .update({ must_change_password: true })
      .eq('id', id)

    await logAuditEvent('sub_admin.password_reset', 'profile', id, { reset_by: 'super_admin' })

    return {
      success: true,
      data: { temporary_password: newPassword, email: profile.email },
    }
  } catch (error) {
    console.error('resetSubAdminPassword error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// getSubAdmins
// ---------------------------------------------------------------------------
export interface SubAdminWithCounts extends Profile {
  assigned_employee_count: number
}

export async function getSubAdmins(): Promise<ApiResponse<SubAdminWithCounts[]>> {
  try {
    await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { data: profiles, error } = await adminClient
      .from('profiles')
      .select('*')
      .eq('role', 'sub_admin')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: 'Failed to fetch sub-admins.' }
    }

    // Get assignment counts per sub-admin
    const { data: employeeCounts } = await adminClient
      .from('employees')
      .select('assigned_sub_admin_id')
      .not('assigned_sub_admin_id', 'is', null)

    const countMap = new Map<string, number>()
    for (const emp of employeeCounts ?? []) {
      if (emp.assigned_sub_admin_id) {
        countMap.set(
          emp.assigned_sub_admin_id,
          (countMap.get(emp.assigned_sub_admin_id) ?? 0) + 1
        )
      }
    }

    const result: SubAdminWithCounts[] = (profiles ?? []).map((p: any) => ({
      ...(p as Profile),
      assigned_employee_count: countMap.get(p.id) ?? 0,
    }))

    return { success: true, data: result }
  } catch (error) {
    console.error('getSubAdmins error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// assignEmployeesToSubAdmin
// ---------------------------------------------------------------------------
export async function assignEmployeesToSubAdmin(
  subAdminId: string,
  employeeIds: string[]
): Promise<ApiResponse<{ assigned: number }>> {
  try {
    const actor = await requireSuperAdmin()

    if (!employeeIds.length) {
      return { success: false, error: 'No employees specified.' }
    }

    const adminClient = createAdminClient()

    // Verify sub-admin exists and is active
    const { data: subAdmin } = await adminClient
      .from('profiles')
      .select('id, role, account_status')
      .eq('id', subAdminId)
      .single()

    if (!subAdmin || subAdmin.role !== 'sub_admin') {
      return { success: false, error: 'Invalid sub-admin.' }
    }

    if (subAdmin.account_status !== 'active') {
      return { success: false, error: 'Cannot assign employees to an inactive sub-admin.' }
    }

    // Bulk update all specified employees
    const { error, count } = await adminClient
      .from('employees')
      .update({ assigned_sub_admin_id: subAdminId })
      .in('id', employeeIds)

    if (error) {
      console.error('assignEmployeesToSubAdmin error:', error)
      return { success: false, error: 'Failed to assign employees.' }
    }

    // Also sync into sub_admin_assignments table
    const assignmentRows = employeeIds.map((empId) => ({
      sub_admin_id: subAdminId,
      employee_id: empId,
      assigned_by: actor.id,
    }))
    await adminClient
      .from('sub_admin_assignments')
      .upsert(assignmentRows, { onConflict: 'sub_admin_id,employee_id' })

    await logAuditEvent('sub_admin.employees_assigned', 'profile', subAdminId, {
      employee_ids: employeeIds,
      count: employeeIds.length,
      assigned_by: actor.id,
    })

    revalidatePath('/admin/sub-admins')
    revalidatePath('/admin/employees')

    return { success: true, data: { assigned: count ?? employeeIds.length } }
  } catch (error) {
    console.error('assignEmployeesToSubAdmin error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// removeEmployeeFromSubAdmin
// ---------------------------------------------------------------------------
export async function removeEmployeeFromSubAdmin(
  subAdminId: string,
  employeeId: string
): Promise<ApiResponse> {
  try {
    const actor = await requireSuperAdmin()

    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('employees')
      .update({ assigned_sub_admin_id: null })
      .eq('id', employeeId)
      .eq('assigned_sub_admin_id', subAdminId)

    if (error) {
      return { success: false, error: 'Failed to remove employee assignment.' }
    }

    await adminClient
      .from('sub_admin_assignments')
      .delete()
      .eq('sub_admin_id', subAdminId)
      .eq('employee_id', employeeId)

    await logAuditEvent('sub_admin.employee_removed', 'profile', subAdminId, {
      employee_id: employeeId,
      removed_by: actor.id,
    })

    revalidatePath('/admin/sub-admins')
    revalidatePath('/admin/employees')

    return { success: true }
  } catch (error) {
    console.error('removeEmployeeFromSubAdmin error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
