import { Suspense } from 'react'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/helpers'
import { AdminLayout } from '@/components/layout/admin-layout'
import EmployeeListClient from './_components/EmployeeListClient'

export const dynamic = 'force-dynamic'

// ─── Page ──────────────────────────────────────────────────────────────────────
export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const profile = await requireAdmin()
  const isSuperAdmin = profile.role === 'super_admin'

  const resolvedParams = await searchParams
  const page = Number(resolvedParams.page ?? 1)
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : ''
  const jobOfferId = typeof resolvedParams.job_offer === 'string' ? resolvedParams.job_offer : ''

  return (
    <AdminLayout title="Employees">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#FAFAFA' }}>
              Employees
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#A1A1AA' }}>
              Manage registered employees and their profiles
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

        {/* Main client component handles search/filter/pagination/table */}
        <Suspense
          fallback={
            <div
              className="rounded-xl h-96 animate-pulse"
              style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
            />
          }
        >
          <EmployeeListClient
            initialPage={page}
            initialQuery={query}
            initialStatus={status}
            initialJobOfferId={jobOfferId}
            isSuperAdmin={isSuperAdmin}
            subAdminId={profile.role === 'sub_admin' ? profile.id : undefined}
          />
        </Suspense>
      </div>
    </AdminLayout>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}
