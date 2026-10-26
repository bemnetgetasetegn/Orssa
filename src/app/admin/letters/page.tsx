import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/helpers'
import { createAdminClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import { StatusBadge } from '@/components/employees/status-badge'
import { FileText, ExternalLink, Calendar, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminLettersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const profile = await requireAdmin()
  const isSuperAdmin = profile.role === 'super_admin'
  const adminClient = createAdminClient()

  let query = adminClient
    .from('application_letters')
    .select(`
      id,
      status,
      current_version,
      issued_at,
      letter_date,
      employee:employees(id, full_name, email, passport_number, employee_code, assigned_sub_admin_id),
      job_offer:job_offers(id, title)
    `)
    .order('updated_at', { ascending: false })

  const { data: allLetters } = await query

  // Sub-admins only see letters for their assigned candidates
  const letters = isSuperAdmin
    ? (allLetters || [])
    : (allLetters || []).filter((l: any) => l.employee?.assigned_sub_admin_id === profile.id)

  return (
    <AdminLayout title="Employment Letters">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Employment Offer Letters</h1>
            <p className="text-sm text-[#A1A1AA]">
              Review, compose, typeset, and issue binding international employment contracts.
            </p>
          </div>
          {isSuperAdmin && (
            <Link
              href="/admin/letters/templates"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D1D20] border border-[#303036] text-xs font-semibold text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
            >
              Manage Letter Templates
            </Link>
          )}
        </div>

        {/* Table of Letters */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#303036] bg-[#141416]/50 text-[#A1A1AA]">
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Passport</th>
                <th className="py-3 px-4 font-semibold">Assigned Job Offer</th>
                <th className="py-3 px-4 font-semibold">Letter Status</th>
                <th className="py-3 px-4 font-semibold">Version</th>
                <th className="py-3 px-4 font-semibold">Issued Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#303036]/50">
              {(!letters || letters.length === 0) ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#A1A1AA]">
                    No application letter records registered. Register an employee first to generate an offer letter.
                  </td>
                </tr>
              ) : (
                letters.map((row: any) => (
                  <tr key={row.id} className="hover:bg-[#141416]/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#FAFAFA]">
                      {row.employee?.full_name || 'Candidate'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#A1A1AA]">
                      {row.employee?.passport_number || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {row.job_offer?.title || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="letter" status={row.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#A1A1AA]">
                      v{row.current_version}
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {row.issued_at ? new Date(row.issued_at).toLocaleDateString() : 'Pending'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/letters/${row.employee?.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#141416] border border-[#303036] text-[#FAFAFA] hover:border-[#E50914] transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#E50914]" />
                        Edit / Typeset
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
