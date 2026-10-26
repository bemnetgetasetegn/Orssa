'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Employee, JobOffer } from '@/types/database'

const PAGE_SIZE = 20

const STATUS_COLORS: Record<string, string> = {
  active: '#22C55E',
  inactive: '#A1A1AA',
  suspended: '#EF4444',
}

const APP_STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  under_review: '#3B82F6',
  approved: '#22C55E',
  rejected: '#EF4444',
  withdrawn: '#A1A1AA',
}

interface Props {
  initialPage: number
  initialQuery: string
  initialStatus: string
  initialJobOfferId: string
  isSuperAdmin: boolean
  subAdminId?: string
}

type EmployeeRow = Employee & {
  job_offers: { title: string; id: string } | null
}

export default function EmployeeListClient({
  initialPage,
  initialQuery,
  initialStatus,
  initialJobOfferId,
  isSuperAdmin,
  subAdminId,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [employees, setEmployees] = useState<EmployeeRow[]>([])
  const [total, setTotal] = useState(0)
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)

  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState(initialStatus)
  const [jobOfferId, setJobOfferId] = useState(initialJobOfferId)
  const [page, setPage] = useState(initialPage)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Push filter state to URL ─────────────────────────────────────────────
  const syncUrl = useCallback(
    (q: string, st: string, jo: string, pg: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) params.set('q', q); else params.delete('q')
      if (st) params.set('status', st); else params.delete('status')
      if (jo) params.set('job_offer', jo); else params.delete('job_offer')
      if (pg > 1) params.set('page', String(pg)); else params.delete('page')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  // ── Fetch employees ──────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async (q: string, st: string, jo: string, pg: number) => {
    setLoading(true)
    try {
      const supabase = createClient()
      let qb = supabase
        .from('employees')
        .select('*, job_offers(title, id)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((pg - 1) * PAGE_SIZE, pg * PAGE_SIZE - 1)

      if (q) {
        qb = qb.or(
          `full_name.ilike.%${q}%,email.ilike.%${q}%,employee_code.ilike.%${q}%,passport_number.ilike.%${q}%`,
        )
      }
      if (st) qb = qb.eq('account_status', st)
      if (jo) qb = qb.eq('job_offer_id', jo)

      // Sub-admins only see their assigned employees
      if (!isSuperAdmin && subAdminId) {
        const { data: assignments } = await supabase
          .from('sub_admin_assignments')
          .select('employee_id')
          .eq('sub_admin_id', subAdminId)
        const ids = assignments?.map((a) => a.employee_id) ?? []

        if (ids.length > 0) {
          qb = qb.or(`assigned_sub_admin_id.eq.${subAdminId},id.in.(${ids.join(',')})`)
        } else {
          qb = qb.eq('assigned_sub_admin_id', subAdminId)
        }
      }

      const { data, count, error } = await qb
      if (error) throw error
      setEmployees((data as unknown as EmployeeRow[]) ?? [])
      setTotal(count ?? 0)
    } catch (err) {
      console.error('Failed to fetch employees:', err)
    } finally {
      setLoading(false)
    }
  }, [isSuperAdmin, subAdminId])

  // ── Fetch job offers for filter dropdown ─────────────────────────────────
  useEffect(() => {
    async function loadJobOffers() {
      const supabase = createClient()
      const { data } = await supabase
        .from('job_offers')
        .select('id, title, slug, currency, is_active, created_at, updated_at')
        .eq('is_active', true)
        .order('title')
      setJobOffers((data as JobOffer[]) ?? [])
    }
    loadJobOffers()
  }, [])

  // ── Initial load + re-fetch on filter change ──────────────────────────────
  useEffect(() => {
    fetchEmployees(query, status, jobOfferId, page)
  }, [fetchEmployees, query, status, jobOfferId, page])

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => syncUrl(value, status, jobOfferId, 1), 350)
  }

  function handleStatusChange(value: string) {
    setStatus(value)
    setPage(1)
    syncUrl(query, value, jobOfferId, 1)
  }

  function handleJobOfferChange(value: string) {
    setJobOfferId(value)
    setPage(1)
    syncUrl(query, status, value, 1)
  }

  function handlePageChange(next: number) {
    setPage(next)
    syncUrl(query, status, jobOfferId, next)
  }

  // ── CSV Export ───────────────────────────────────────────────────────────
  async function handleExport() {
    setExportLoading(true)
    try {
      const supabase = createClient()
      let qb = supabase
        .from('employees')
        .select('employee_code, full_name, email, passport_number, nationality, phone, registration_date, application_status, account_status, job_offers(title)')
        .order('created_at', { ascending: false })

      if (query) qb = qb.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      if (status) qb = qb.eq('account_status', status)
      if (jobOfferId) qb = qb.eq('job_offer_id', jobOfferId)

      const { data } = await qb
      if (!data) return

      const headers = ['Code', 'Full Name', 'Email', 'Passport', 'Nationality', 'Phone', 'Reg. Date', 'App. Status', 'Account Status', 'Job Offer']
      const rows = data.map((e: unknown) => {
        const emp = e as Record<string, unknown>
        return [
          emp.employee_code ?? '',
          emp.full_name,
          emp.email,
          emp.passport_number,
          emp.nationality ?? '',
          emp.phone ?? '',
          emp.registration_date,
          emp.application_status,
          emp.account_status,
          (emp.job_offers as Record<string, string> | null)?.title ?? '',
        ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
      })

      const csv = [headers.join(','), ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orsa-employees-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportLoading(false)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div
        className="rounded-xl p-4 flex flex-wrap gap-3 items-center"
        style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search name, email, code…"
            className="w-full rounded-lg pl-9 pr-4 py-2 text-sm outline-none"
            style={{
              backgroundColor: '#09090B',
              border: '1px solid #303036',
              color: '#FAFAFA',
            }}
          />
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: '#09090B', border: '1px solid #303036', color: status ? '#FAFAFA' : '#A1A1AA' }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>

        {/* Job offer filter */}
        <select
          value={jobOfferId}
          onChange={(e) => handleJobOfferChange(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: '#09090B', border: '1px solid #303036', color: jobOfferId ? '#FAFAFA' : '#A1A1AA' }}
        >
          <option value="">All Job Offers</option>
          {jobOffers.map((jo) => (
            <option key={jo.id} value={jo.id}>{jo.title}</option>
          ))}
        </select>

        {/* Export */}
        {isSuperAdmin && (
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: '#303036', color: '#FAFAFA' }}
          >
            <DownloadIcon />
            {exportLoading ? 'Exporting…' : 'Export CSV'}
          </button>
        )}

        <p className="text-xs ml-auto" style={{ color: '#A1A1AA' }}>
          {total} {total === 1 ? 'employee' : 'employees'}
        </p>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <SpinnerIcon />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #303036' }}>
                  {['', 'Name', 'Code', 'Job Offer', 'App. Status', 'Account', 'Registered', ''].map((h, i) => (
                    <th
                      key={i}
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
                    <td colSpan={8} className="px-5 py-16 text-center" style={{ color: '#A1A1AA' }}>
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr
                      key={emp.id}
                      style={{ borderBottom: '1px solid #303036' }}
                      className="hover:bg-[#232325] transition-colors"
                    >
                      {/* Avatar */}
                      <td className="pl-5 py-3 pr-2 w-10">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: '#E5091420', color: '#E50914' }}
                        >
                          {emp.full_name.charAt(0).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <p className="font-medium" style={{ color: '#FAFAFA' }}>{emp.full_name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{emp.email}</p>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: '#A1A1AA' }}>
                        {emp.employee_code ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: '#A1A1AA' }}>
                        {emp.job_offers?.title ?? '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          value={emp.application_status}
                          colorMap={APP_STATUS_COLORS}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge value={emp.account_status} colorMap={STATUS_COLORS} />
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: '#A1A1AA' }}>
                        {new Date(emp.registration_date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/employees/${emp.id}`}
                          className="text-xs transition-opacity hover:opacity-80"
                          style={{ color: '#E50914' }}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#A1A1AA' }}>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg px-3 py-1.5 text-sm disabled:opacity-40 transition-colors hover:bg-[#232325]"
              style={{ border: '1px solid #303036', color: '#FAFAFA' }}
            >
              ← Prev
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg px-3 py-1.5 text-sm disabled:opacity-40 transition-colors hover:bg-[#232325]"
              style={{ border: '1px solid #303036', color: '#FAFAFA' }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ value, colorMap }: { value: string; colorMap: Record<string, string> }) {
  const color = colorMap[value] ?? '#A1A1AA'
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {value.replace(/_/g, ' ')}
    </span>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A1A1AA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
}
