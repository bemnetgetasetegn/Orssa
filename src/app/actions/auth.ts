'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { logAuditEvent, getCurrentProfile } from '@/lib/auth/helpers'
import {
  loginSchema,
  changePasswordSchema,
  type LoginInput,
  type ChangePasswordInput,
} from '@/lib/validation/schemas'
import type { ApiResponse } from '@/types/database'

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------
export async function login(data: LoginInput): Promise<ApiResponse<{ must_change_password: boolean; role: string }>> {
  try {
    const parsed = loginSchema.safeParse(data)
    if (!parsed.success) {
      // Generic message — don't reveal which field is wrong
      return { success: false, error: 'Invalid email or password.' }
    }

    const { email, password } = parsed.data
    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData?.user) {
      // Always return a generic message to prevent user enumeration
      return { success: false, error: 'Invalid email or password.' }
    }

    const userId = authData.user.id

    // Fetch profile to check account status
    const adminClient = createAdminClient()
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('account_status, must_change_password, role')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      // Sign out the just-created session and return generic error
      await supabase.auth.signOut()
      return { success: false, error: 'Invalid email or password.' }
    }

    if (profile.account_status === 'suspended') {
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Your account has been suspended. Please contact an administrator.',
      }
    }

    if (profile.account_status === 'inactive') {
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Your account is inactive. Please contact an administrator.',
      }
    }

    await logAuditEvent('auth.login', 'auth', userId, { role: profile.role })

    return {
      success: true,
      data: {
        must_change_password: profile.must_change_password,
        role: profile.role,
      },
    }
  } catch (error) {
    console.error('login error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------
export async function logout(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await logAuditEvent('auth.logout', 'auth', user.id, {})
  }

  await supabase.auth.signOut()
  redirect('/login')
}

// ---------------------------------------------------------------------------
// changePassword
// ---------------------------------------------------------------------------
export async function changePassword(data: ChangePasswordInput): Promise<ApiResponse> {
  try {
    const parsed = changePasswordSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Validation failed.'
      return { success: false, error: firstError }
    }

    const { current_password, new_password } = parsed.data
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return { success: false, error: 'You must be logged in to change your password.' }
    }

    // Verify current password by re-signing in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current_password,
    })

    if (verifyError) {
      return { success: false, error: 'Current password is incorrect.' }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password,
    })

    if (updateError) {
      console.error('changePassword updateUser error:', updateError)
      return { success: false, error: 'Failed to update password. Please try again.' }
    }

    // Mark must_change_password = false
    const adminClient = createAdminClient()
    await adminClient
      .from('profiles')
      .update({ must_change_password: false })
      .eq('id', user.id)

    await logAuditEvent('auth.password_changed', 'auth', user.id, { self_change: true })

    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('changePassword error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// checkMustChangePassword
// ---------------------------------------------------------------------------
export async function checkMustChangePassword(): Promise<ApiResponse<{ must_change: boolean; role: string }>> {
  try {
    const profile = await getCurrentProfile()

    if (!profile) {
      return { success: false, error: 'Not authenticated.' }
    }

    return {
      success: true,
      data: {
        must_change: profile.must_change_password,
        role: profile.role,
      },
    }
  } catch (error) {
    console.error('checkMustChangePassword error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

// ---------------------------------------------------------------------------
// validateEmployeeLoginRef
// ---------------------------------------------------------------------------
export async function validateEmployeeLoginRef(refToken: string): Promise<
  ApiResponse<{
    employee_name: string
    email: string
    employee_code: string
  }>
> {
  try {
    if (!refToken || typeof refToken !== 'string') {
      return { success: false, error: 'Invalid login reference token.' }
    }

    const adminClient = createAdminClient()
    const { data: refRecord, error: refError } = await adminClient
      .from('employee_login_refs')
      .select('id, employee_id, is_active')
      .eq('ref_token', refToken.trim())
      .eq('is_active', true)
      .maybeSingle()

    if (refError || !refRecord) {
      return { success: false, error: 'This unique login link is invalid, expired, or has been revoked.' }
    }

    const { data: employee, error: empError } = await adminClient
      .from('employees')
      .select('id, user_id, full_name, email, employee_code, account_status')
      .eq('id', refRecord.employee_id)
      .single()

    if (empError || !employee) {
      return { success: false, error: 'Associated candidate record was not found.' }
    }

    if (employee.account_status === 'suspended') {
      return {
        success: false,
        error: 'This candidate account has been suspended. Please contact an administrator.',
      }
    }

    return {
      success: true,
      data: {
        employee_name: employee.full_name,
        email: employee.email,
        employee_code: employee.employee_code,
      },
    }
  } catch (error) {
    console.error('validateEmployeeLoginRef error:', error)
    return { success: false, error: 'Failed to validate unique login reference.' }
  }
}

