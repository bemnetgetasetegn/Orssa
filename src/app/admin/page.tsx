import { Suspense } from 'react'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import type {
  DashboardStats,
  RegistrationTrendPoint,
  JobOfferDistribution,
  Employee,
  AuditLog,
} from '@/types/database'
import DashboardCharts from './_components/DashboardCharts'

export const dynamic = 'force-dynamic'

// ─── Data fetchers ─────────────────────────────────────────────────────────────

async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [total, newlyReg, active, pending, issued, disabled] = await Promise.all([
    supabase.from('employees').select('id', { count: 'exact', head: true }),
    supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .gte('registration_date', thirtyDaysAgo),
    supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .eq('account_status', 'active'),
    supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .eq('application_status', 'pending'),
    supabase
      .from('application_letters')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'issued'),
    supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .in('account_status', ['inactive', 'suspended']),
  ])

  return {
    total_employees: total.count ?? 0,
    newly_registered: newlyReg.count ?? 0,
    active_employees: active.count ?? 0,
    pending_applications: pending.count ?? 0,
    job_offers_issued: issued.count ?? 0,
    disabled_accounts: disabled.count ?? 0,
  }
}

async function getRegistrationTrend(): Promise<RegistrationTrendPoint[]> {
  const supabase = await createClient()
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const { data } = await supabase
    .from('employees')
    .select('registration_date')
    .gte('registration_date', ninetyDaysAgo)
    .order('registration_date', { ascending: true })

  if (!data) return []

  // Aggregate by day
  const counts: Record<string, number> = {}
  for (const row of data) {
    const day = row.registration_date.split('T')[0]
    counts[day] = (counts[day] ?? 0) + 1
  }

  return Object.entries(counts).map(([date, count]) => ({ date, count }))
}

async function getJobOfferDistribution(): Promise<JobOfferDistribution[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('employees')
    .select('job_offer_id, job_offers(title)')

  if (!data) return []

  const counts: Record<string, { title: string; count: number }> = {}
  const rows = data as unknown as Array<{ job_offer_id: string | null; job_offers: { title: string } | Array<{ title: string }> | null }>
  for (const row of rows) {
    const rawOffers = row.job_offers
    const title = Array.isArray(rawOffers) ? rawOffers[0]?.title ?? 'Unassigned' : rawOffers?.title ?? 'Unassigned'
    const key = row.job_offer_id ?? 'none'
    if (!counts[key]) counts[key] = { title, count: 0 }
    counts[key].count++
  }

  const total = data.length || 1
  return Object.values(counts).map(({ title, count }) => ({
    job_offer: title,
    count,
    percentage: Math.round((count / total) * 100),
  }))
}

async function getRecentRegistrations(): Promise<Employee[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('employees')
    .select('*, job_offers(title, id)')
    .order('created_at', { ascending: false })
    .limit(8)

  return (data as unknown as Employee[]) ?? []
}

async function getRecentActivity(): Promise<AuditLog[]> {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15)

  if (!logs || logs.length === 0) return []

  // Fetch actor profiles for the logs
  const actorIds = [...new Set(logs.map((l) => l.actor_user_id).filter(Boolean))]
  if (actorIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .in('id', actorIds)

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]))
    return logs.map((l) => ({
      ...l,
      actor: l.actor_user_id ? profileMap.get(l.actor_user_id) : undefined,
    })) as unknown as AuditLog[]
  }

  return logs as unknown as AuditLog[]
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color = '#E50914',
  icon,
}: {
  label: string
  value: number | string
  color?: string
  icon: React.ReactNode
}) {
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4"
      style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: '#FAFAFA' }}>
          {value.toLocaleString()}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>
          {label}
        </p>
      </div>
    </div>
  )
}

async function StatsGrid() {
  const stats = await getDashboardStats()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatCard
        label="Total Employees"
        value={stats.total_employees}
        color="#E50914"
        icon={<UsersIcon />}
      />
      <StatCard
        label="Newly Registered (30d)"
        value={stats.newly_registered}
        color="#22C55E"
        icon={<UserPlusIcon />}
      />
      <StatCard
        label="Active Employees"
        value={stats.active_employees}
        color="#22C55E"
        icon={<CheckCircleIcon />}
      />
      <StatCard
        label="Pending Applications"
        value={stats.pending_applications}
        color="#F59E0B"
        icon={<ClockIcon />}
      />
      <StatCard
        label="Job Offers Issued"
        value={stats.job_offers_issued}
        color="#3B82F6"
        icon={<DocumentIcon />}
      />
      <StatCard
        label="Disabled Accounts"
        value={stats.disabled_accounts}
        color="#EF4444"
        icon={<BanIcon />}
      />
    </div>
  )
}

async function RecentRegistrationsTable() {
  const employees = await getRecentRegistrations()

  const statusColor: Record<string, string> = {
    active: '#22C55E',
    inactive: '#A1A1AA',
    suspended: '#EF4444',
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #303036' }}>
        <h2 className="font-semibold" style={{ color: '#FAFAFA' }}>Recent Registrations</h2>
        <Link
          href="/admin/employees"
          className="text-xs transition-opacity hover:opacity-80"
          style={{ color: '#E50914' }}
        >
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #303036' }}>
              {['Name', 'Code', 'Job Offer', 'Status', 'Registered'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#A1A1AA' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm" style={{ color: '#A1A1AA' }}>
                  No employees yet
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  style={{ borderBottom: '1px solid #303036' }}
                  className="hover:bg-[#232325] transition-colors"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/employees/${emp.id}`}
                      className="font-medium hover:underline"
                      style={{ color: '#FAFAFA' }}
                    >
                      {emp.full_name}
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{emp.email}</p>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs" style={{ color: '#A1A1AA' }}>
                    {emp.employee_code ?? '—'}
                  </td>
                  <td className="px-5 py-3" style={{ color: '#A1A1AA' }}>
                    {(emp.job_offer as unknown as { title: string } | null)?.title ?? '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                      style={{
                        backgroundColor: `${statusColor[emp.account_status]}20`,
                        color: statusColor[emp.account_status],
                      }}
                    >
                      {emp.account_status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#A1A1AA' }}>
                    {new Date(emp.registration_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function RecentActivityPanel() {
  const logs = await getRecentActivity()

  function formatAction(action: string) {
    return action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  function actionColor(action: string) {
    if (action.includes('create') || action.includes('register')) return '#22C55E'
    if (action.includes('delete') || action.includes('suspend')) return '#EF4444'
    if (action.includes('update') || action.includes('edit')) return '#F59E0B'
    return '#A1A1AA'
  }

  return (
    <div
      className="rounded-xl"
      style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #303036' }}>
        <h2 className="font-semibold" style={{ color: '#FAFAFA' }}>Recent Activity</h2>
      </div>
      <div className="divide-y" style={{ borderColor: '#303036' }}>
        {logs.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm" style={{ color: '#A1A1AA' }}>
            No activity yet
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="px-5 py-3 flex items-start gap-3">
              <div
                className="mt-1 w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: actionColor(log.action) }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm" style={{ color: '#FAFAFA' }}>
                  <span className="font-medium">{formatAction(log.action)}</span>
                  {log.actor && (
                    <span style={{ color: '#A1A1AA' }}>
                      {' '}by{' '}
                      {(log.actor as unknown as { full_name: string }).full_name}
                    </span>
                  )}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#52525b' }}>
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function UserPlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function BanIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

// ─── Skeleton loaders ──────────────────────────────────────────────────────────
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-5 h-[76px] animate-pulse"
          style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
        />
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div
      className="rounded-xl h-64 animate-pulse"
      style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
    />
  )
}

// ─── Charts data fetcher (passed as prop to client component) ──────────────────
async function ChartsSection() {
  const [trend, distribution] = await Promise.all([
    getRegistrationTrend(),
    getJobOfferDistribution(),
  ])
  return <DashboardCharts trend={trend} distribution={distribution} />
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  await requireAdmin()

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#FAFAFA' }}>Dashboard</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A1A1AA' }}>
              Welcome back — here&apos;s what&apos;s happening today.
            </p>
          </div>
          <Link
            href="/admin/employees/new"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#E50914', color: '#FAFAFA' }}
          >
            <PlusIcon />
            Register Employee
          </Link>
        </div>

        {/* Stats */}
        <Suspense fallback={<StatsSkeleton />}>
          <StatsGrid />
        </Suspense>

        {/* Charts */}
        <Suspense
          fallback={
            <div
              className="rounded-xl h-72 animate-pulse"
              style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
            />
          }
        >
          <ChartsSection />
        </Suspense>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Suspense fallback={<TableSkeleton />}>
              <RecentRegistrationsTable />
            </Suspense>
          </div>
          <div>
            <Suspense fallback={<TableSkeleton />}>
              <RecentActivityPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
