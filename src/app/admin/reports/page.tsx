import { requireSuperAdmin } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/layout/admin-layout'
import { BarChart3, TrendingUp, Users, FileCheck, Shield, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  await requireSuperAdmin()
  const supabase = await createClient()

  // Collect summary counts for reporting
  const [employeesRes, lettersRes, offersRes] = await Promise.all([
    supabase.from('employees').select('application_status, account_status'),
    supabase.from('application_letters').select('status'),
    supabase.from('job_offers').select('title, id'),
  ])

  const totalEmployees = employeesRes.data?.length || 0
  const approvedEmployees = employeesRes.data?.filter((e) => e.application_status === 'approved').length || 0
  const activeEmployees = employeesRes.data?.filter((e) => e.account_status === 'active').length || 0
  const issuedLetters = lettersRes.data?.filter((l) => l.status === 'issued').length || 0

  return (
    <AdminLayout title="Operational Reports">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Executive Recruitment Reports</h1>
          <p className="text-sm text-[#A1A1AA]">
            High-level metrics on international worker deployment, issuance velocity, and quota fulfillment.
          </p>
        </div>

        {/* Report Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4">
            <span className="text-xs text-[#A1A1AA]">Total Candidates Enrolled</span>
            <p className="text-2xl font-bold text-[#FAFAFA] mt-1">{totalEmployees}</p>
            <span className="text-[11px] text-green-400 mt-1 block">100% Verified Database</span>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4">
            <span className="text-xs text-[#A1A1AA]">Approved Applications</span>
            <p className="text-2xl font-bold text-green-400 mt-1">{approvedEmployees}</p>
            <span className="text-[11px] text-[#A1A1AA] mt-1 block">
              {totalEmployees ? Math.round((approvedEmployees / totalEmployees) * 100) : 0}% Conversion Rate
            </span>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4">
            <span className="text-xs text-[#A1A1AA]">Official Offers Issued</span>
            <p className="text-2xl font-bold text-[#E50914] mt-1">{issuedLetters}</p>
            <span className="text-[11px] text-[#A1A1AA] mt-1 block">Legally Binding Packages</span>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4">
            <span className="text-xs text-[#A1A1AA]">Active System Logins</span>
            <p className="text-2xl font-bold text-[#FAFAFA] mt-1">{activeEmployees}</p>
            <span className="text-[11px] text-[#A1A1AA] mt-1 block">Portal Access Granted</span>
          </div>
        </div>

        {/* Placement Categories Breakdown */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#FAFAFA] border-b border-[#303036] pb-2">
            Placement Categories & Quotas
          </h2>

          <div className="divide-y divide-[#303036]/50 text-xs">
            {offersRes.data?.map((offer) => (
              <div key={offer.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#FAFAFA] text-sm">{offer.title}</p>
                  <p className="text-[#A1A1AA] text-[11px]">Primary Overseas Workforce Pipeline</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-[#141416] border border-[#303036] text-[#FAFAFA] font-mono">
                    Active Offering
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
