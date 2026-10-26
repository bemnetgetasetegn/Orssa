'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdmin, getCurrentProfile } from '@/lib/auth/helpers'
import type {
  ApiResponse,
  DashboardStats,
  RegistrationTrendPoint,
  JobOfferDistribution,
  Employee,
  AuditLog,
  Notification,
  PaginatedResponse,
} from '@/types/database'

// ---------------------------------------------------------------------------
// getDashboardStats
// ---------------------------------------------------------------------------
export async function getDashboardStats(
  dateFilter?: string
): Promise<ApiResponse<DashboardStats>> {
  try {
    const profile = await requireAdmin()

    const adminClient = createAdminClient()

    // Base query scope — sub-admins only see their employees
    const buildQuery = () => {
      let q = adminClient.from('employees').select('*', { count: 'exact', head: true })
      if (profile.role === 'sub_admin') {
        q = q.eq('assigned_sub_admin_id', profile.id)
      }
      return q
    }

    // Date threshold for "newly registered" (default: last 30 days)
    const since = dateFilter
      ? new Date(dateFilter).toISOString()
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [
      { count: total_employees },
      { count: newly_registered },
      { count: active_employees },
      { count: pending_applications },
      { count: job_offers_issued },
      { count: disabled_accounts },
    ] = await Promise.all([
      buildQuery(),
      buildQuery().gte('registration_date', since.split('T')[0]),
      buildQuery().eq('account_status', 'active'),
      buildQuery().eq('application_status', 'pending'),
      buildQuery().eq('application_status', 'approved'),
      buildQuery().in('account_status', ['inactive', 'suspended']),
    ])

    return {
      success: true,
      data: {
        total_employees: total_employees ?? 0,
        newly_registered: newly_registered ?? 0,
        active_employees: active_employees ?? 0,
        pending_applications: pending_applications ?? 0,
        job_offers_issued: job_offers_issued ?? 0,
        disabled_accounts: disabled_accounts ?? 0,
      },
    }
  } catch (error) {
    console.error('getDashboardStats error:', error)
    return { success: false, error: 'Failed to fetch dashboard statistics.' }
  }
}

// ---------------------------------------------------------------------------
// getRegistrationTrend
// ---------------------------------------------------------------------------
export async function getRegistrationTrend(
  period: 'week' | 'month' | 'year' = 'month'
): Promise<ApiResponse<RegistrationTrendPoint[]>> {
  try {
    const profile = await requireAdmin()

    const adminClient = createAdminClient()

    // Calculate date range
    const now = new Date()
    let startDate: Date
    let groupFormat: string

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        groupFormat = 'YYYY-MM-DD'
        break
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        groupFormat = 'YYYY-MM'
        break
      case 'month':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        groupFormat = 'YYYY-MM-DD'
        break
    }

    let query = adminClient
      .from('employees')
      .select('registration_date')
      .gte('registration_date', startDate.toISOString().split('T')[0])
      .order('registration_date', { ascending: true })

    if (profile.role === 'sub_admin') {
      query = query.eq('assigned_sub_admin_id', profile.id)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: 'Failed to fetch registration trend.' }
    }

    // Group by date
    const countMap = new Map<string, number>()

    for (const row of data ?? []) {
      const date = row.registration_date
      const key =
        period === 'year'
          ? date.substring(0, 7) // YYYY-MM
          : date.substring(0, 10) // YYYY-MM-DD

      countMap.set(key, (countMap.get(key) ?? 0) + 1)
    }

    // Fill in zero-count dates for continuity
    const result: RegistrationTrendPoint[] = []
    const cursor = new Date(startDate)

    while (cursor <= now) {
      const key =
        period === 'year'
          ? cursor.toISOString().substring(0, 7)
          : cursor.toISOString().substring(0, 10)

      if (!result.find((r) => r.date === key)) {
        result.push({ date: key, count: countMap.get(key) ?? 0 })
      }

      // Increment by day or month
      if (period === 'year') {
        cursor.setMonth(cursor.getMonth() + 1)
      } else {
        cursor.setDate(cursor.getDate() + 1)
      }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('getRegistrationTrend error:', error)
    return { success: false, error: 'Failed to fetch registration trend.' }
  }
}

// ---------------------------------------------------------------------------
// getJobOfferDistribution
// ---------------------------------------------------------------------------
export async function getJobOfferDistribution(): Promise<
  ApiResponse<JobOfferDistribution[]>
> {
  try {
    const profile = await requireAdmin()

    const adminClient = createAdminClient()

    let query = adminClient
      .from('employees')
      .select('job_offer_id, job_offer:job_offers(title)')

    if (profile.role === 'sub_admin') {
      query = query.eq('assigned_sub_admin_id', profile.id)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: 'Failed to fetch job offer distribution.' }
    }

    const rows = data ?? []
    const total = rows.length

    // Aggregate counts
    const countMap = new Map<string, { title: string; count: number }>()

    for (const row of rows) {
      const offer = row.job_offer as { title?: string } | null
      const title = offer?.title ?? 'Unassigned'
      const existing = countMap.get(title)
      if (existing) {
        existing.count++
      } else {
        countMap.set(title, { title, count: 1 })
      }
    }

    const result: JobOfferDistribution[] = Array.from(countMap.values())
      .map(({ title, count }) => ({
        job_offer: title,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return { success: true, data: result }
  } catch (error) {
    console.error('getJobOfferDistribution error:', error)
    return { success: false, error: 'Failed to fetch job offer distribution.' }
  }
}

// ---------------------------------------------------------------------------
// getRecentRegistrations
// ---------------------------------------------------------------------------
export async function getRecentRegistrations(
  limit: number = 10
): Promise<ApiResponse<Employee[]>> {
  try {
    const profile = await requireAdmin()

    const adminClient = createAdminClient()

    let query = adminClient
      .from('employees')
      .select('*, job_offer:job_offers(id, title)')
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 50)) // cap at 50

    if (profile.role === 'sub_admin') {
      query = query.eq('assigned_sub_admin_id', profile.id)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: 'Failed to fetch recent registrations.' }
    }

    return { success: true, data: (data ?? []) as Employee[] }
  } catch (error) {
    console.error('getRecentRegistrations error:', error)
    return { success: false, error: 'Failed to fetch recent registrations.' }
  }
}

// ---------------------------------------------------------------------------
// getRecentAuditLogs
// ---------------------------------------------------------------------------
export async function getRecentAuditLogs(
  limit: number = 20
): Promise<ApiResponse<AuditLog[]>> {
  try {
    const profile = await requireAdmin()

    const adminClient = createAdminClient()

    let query = adminClient
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 100))

    // Sub-admins only see logs related to their assigned employees
    if (profile.role === 'sub_admin') {
      query = query.eq('actor_user_id', profile.id)
    }

    const { data: rawLogs, error } = await query

    if (error) {
      return { success: false, error: 'Failed to fetch audit logs.' }
    }

    let logs = (rawLogs || []) as any[]
    const actorIds = [...new Set(logs.map((l: any) => l.actor_user_id).filter(Boolean))]
    if (actorIds.length > 0) {
      const { data: profiles } = await adminClient
        .from('profiles')
        .select('id, full_name, email, role')
        .in('id', actorIds)

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))
      logs = logs.map((l: any) => ({
        ...l,
        actor: l.actor_user_id ? profileMap.get(l.actor_user_id) : undefined,
      }))
    }

    return { success: true, data: logs as AuditLog[] }
  } catch (error) {
    console.error('getRecentAuditLogs error:', error)
    return { success: false, error: 'Failed to fetch audit logs.' }
  }
}

// ---------------------------------------------------------------------------
// getUnreadNotificationsCount
// ---------------------------------------------------------------------------
export async function getUnreadNotificationsCount(): Promise<ApiResponse<{ count: number }>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated.' }
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_user_id', user.id)
      .is('read_at', null)

    if (error) {
      return { success: false, error: 'Failed to fetch notification count.' }
    }

    return { success: true, data: { count: count ?? 0 } }
  } catch (error) {
    console.error('getUnreadNotificationsCount error:', error)
    return { success: false, error: 'Failed to fetch notification count.' }
  }
}

// ---------------------------------------------------------------------------
// getNotifications
// ---------------------------------------------------------------------------
export async function getNotifications(
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedResponse<Notification>>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated.' }
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('recipient_user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return { success: false, error: 'Failed to fetch notifications.' }
    }

    const total = count ?? 0

    return {
      success: true,
      data: {
        data: (data ?? []) as Notification[],
        total,
        page,
        page_size: pageSize,
        total_pages: Math.ceil(total / pageSize),
      },
    }
  } catch (error) {
    console.error('getNotifications error:', error)
    return { success: false, error: 'Failed to fetch notifications.' }
  }
}

// ---------------------------------------------------------------------------
// markNotificationRead
// ---------------------------------------------------------------------------
export async function markNotificationRead(id: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated.' }
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('recipient_user_id', user.id) // ensures users can only mark their own notifications

    if (error) {
      return { success: false, error: 'Failed to mark notification as read.' }
    }

    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('markNotificationRead error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
