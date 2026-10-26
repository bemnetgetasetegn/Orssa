import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Profile } from '@/types/database'

// Get the current authenticated user's profile
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}

// Require authentication - redirect to login if not authenticated
export async function requireAuth() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

// Require super admin role
export async function requireSuperAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile()
  
  if (!profile || profile.role !== 'super_admin') {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login?error=unauthorized')
  }
  
  if (profile.account_status === 'suspended' || profile.account_status === 'inactive') {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login?error=account_suspended')
  }
  
  return profile
}

// Require admin role (super_admin or sub_admin)
export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile()
  
  if (!profile || !['super_admin', 'sub_admin'].includes(profile.role)) {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login?error=unauthorized')
  }
  
  if (profile.account_status === 'suspended' || profile.account_status === 'inactive') {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login?error=account_suspended')
  }
  
  return profile
}

// Require employee role
export async function requireEmployee(): Promise<Profile> {
  const profile = await getCurrentProfile()
  
  if (!profile || profile.role !== 'employee') {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login?error=unauthorized')
  }
  
  if (profile.account_status === 'suspended' || profile.account_status === 'inactive') {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login?error=account_suspended')
  }
  
  return profile
}

// Check if current user can manage a specific employee
export async function canManageEmployee(employeeId: string): Promise<boolean> {
  const profile = await getCurrentProfile()
  
  if (!profile) return false
  
  if (profile.role === 'super_admin') return true
  
  if (profile.role === 'sub_admin') {
    const supabase = await createClient()
    const { data: assignment } = await supabase
      .from('sub_admin_assignments')
      .select('id')
      .eq('sub_admin_id', profile.id)
      .eq('employee_id', employeeId)
      .maybeSingle()
    
    if (assignment) return true

    const { data: emp } = await supabase
      .from('employees')
      .select('assigned_sub_admin_id')
      .eq('id', employeeId)
      .maybeSingle()

    return emp?.assigned_sub_admin_id === profile.id
  }
  
  return false
}

// Check if current user can view letters
export async function canManageLetters(): Promise<boolean> {
  const profile = await getCurrentProfile()
  return profile?.role === 'super_admin'
}

// Log an audit event
export async function logAuditEvent(
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {}
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('audit_logs').insert({
      actor_user_id: user?.id || null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
    })
  } catch (error) {
    // Audit log failures should not break the main operation
    console.error('Failed to write audit log:', error)
  }
}

// Create a notification
export async function createNotification(
  recipientUserId: string,
  title: string,
  message: string,
  type: string = 'info',
  entityType?: string,
  entityId?: string
) {
  try {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminClient = createAdminClient()
    
    await adminClient.from('notifications').insert({
      recipient_user_id: recipientUserId,
      title,
      message,
      type,
      entity_type: entityType || null,
      entity_id: entityId || null,
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}
