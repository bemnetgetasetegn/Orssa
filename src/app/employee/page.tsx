import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireEmployee } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { EmployeeLayout } from '@/components/layout/employee-layout'
import { StatusBadge } from '@/components/employees/status-badge'
import {
  FileText,
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EmployeeDashboardPage() {
  const profile = await requireEmployee()
  const supabase = await createClient()

  // Fetch employee record
  const { data: employee } = await supabase
    .from('employees')
    .select(`
      *,
      job_offer:job_offers(*)
    `)
    .eq('user_id', profile.id)
    .single()

  if (!employee) {
    return (
      <EmployeeLayout>
        <div className="p-8 text-center text-[#A1A1AA]">
          Your employee record is being linked. Please contact the administrator.
        </div>
      </EmployeeLayout>
    )
  }

  // Fetch application letter directly for this employee
  const { data: letterData } = await supabase
    .from('application_letters')
    .select('*')
    .eq('employee_id', employee.id)
    .maybeSingle()

  const letter = letterData
  const hasIssuedLetter = letter && letter.status === 'issued'

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#E50914] font-bold">
                International Placement
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA] mt-1">
                Welcome, {employee.full_name}
              </h1>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Review your overseas placement contract status, credential records, and travel documents.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#141416] border border-[#303036] text-[#A1A1AA]">
                ID: {employee.employee_code}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4">
            <span className="text-xs text-[#A1A1AA]">Application Status</span>
            <div className="mt-2 flex items-center justify-between">
              <StatusBadge type="application" status={employee.application_status} />
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4">
            <span className="text-xs text-[#A1A1AA]">Assigned Position</span>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-semibold text-xs text-[#FAFAFA] truncate">
                {employee.job_offer?.title || 'Pending Placement'}
              </p>
              <Briefcase className="h-4 w-4 text-[#E50914]" />
            </div>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4">
            <span className="text-xs text-[#A1A1AA]">Registration Date</span>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-semibold text-xs text-[#FAFAFA]">{employee.registration_date}</p>
              <Calendar className="h-4 w-4 text-[#A1A1AA]" />
            </div>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4">
            <span className="text-xs text-[#A1A1AA]">Offer Letter Status</span>
            <div className="mt-2 flex items-center justify-between">
              <StatusBadge type="letter" status={letter?.status || 'not_created'} />
              <FileText className="h-4 w-4 text-[#A1A1AA]" />
            </div>
          </div>
        </div>

        {/* Employment Letter Main Card */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#303036] pb-3">
            <h2 className="text-base font-semibold text-[#FAFAFA] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#E50914]" />
              Official Employment Offer Document
            </h2>
            {hasIssuedLetter && (
              <span className="text-xs font-mono text-green-400 bg-green-950/40 border border-green-800 px-2 py-0.5 rounded">
                Verified v{letter.current_version}
              </span>
            )}
          </div>

          {hasIssuedLetter ? (
            <div className="space-y-4">
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Your formal appointment document has been officially approved and issued by Orsa Recruitment Agency. You may preview your document online below. Official stamped copies are issued directly in person at the agency office.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/employee/application-letter"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-xs font-semibold text-white hover:bg-[#B91C1C] transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View Offer Letter
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-[#A1A1AA] mx-auto opacity-40" />
              <h3 className="text-sm font-semibold text-[#FAFAFA]">
                Your employment letter is not available yet
              </h3>
              <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
                Please check again later or contact the recruitment administrator. Official offers are made visible here once authorized and certified by our executives.
              </p>
            </div>
          )}
        </div>

        {/* Security / First login note */}
        {profile.must_change_password && (
          <div className="p-4 rounded-xl border border-yellow-500/40 bg-yellow-950/30 text-yellow-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold">Security Action Required</p>
                <p className="text-[11px] text-yellow-400 mt-0.5">
                  You are currently using a temporary password. Please update it to ensure your account security.
                </p>
              </div>
            </div>
            <Link
              href="/employee/security"
              className="px-3 py-1.5 rounded-lg bg-yellow-600 text-black font-semibold text-xs hover:bg-yellow-500 transition-colors"
            >
              Update Password
            </Link>
          </div>
        )}
      </div>
    </EmployeeLayout>
  )
}
