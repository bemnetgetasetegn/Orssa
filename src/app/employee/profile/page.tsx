import { requireEmployee } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { getEmployeePhotoUrl } from '@/app/actions/employees'
import { EmployeeLayout } from '@/components/layout/employee-layout'
import { User, Mail, Phone, Globe, Calendar, Shield, MapPin, Briefcase } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EmployeeProfilePage() {
  const profile = await requireEmployee()
  const supabase = await createClient()

  const { data: employee } = await supabase
    .from('employees')
    .select(`
      *,
      job_offer:job_offers(*)
    `)
    .eq('user_id', profile.id)
    .single()

  let photoUrl: string | null = null
  if (employee?.photo_storage_path) {
    const photoRes = await getEmployeePhotoUrl(employee.photo_storage_path)
    if (photoRes.success && photoRes.data) {
      photoUrl = typeof photoRes.data === 'string' ? photoRes.data : (photoRes.data as any).signed_url
    }
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Candidate Profile</h1>
          <p className="text-sm text-[#A1A1AA]">
            Your officially registered employment records and identity documentation.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#303036]">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#141416] border-2 border-[#E50914] flex-shrink-0">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-[#E50914]">
                  {employee?.full_name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-xl font-bold text-[#FAFAFA]">{employee?.full_name}</h2>
              <p className="text-xs font-mono text-[#A1A1AA]">{employee?.employee_code}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-[#A1A1AA]">
                <span className="px-2.5 py-0.5 rounded bg-[#141416] border border-[#303036] text-[#FAFAFA]">
                  {employee?.job_offer?.title || 'Unassigned'}
                </span>
                <span>• Registered on {employee?.registration_date}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 text-xs">
            <div>
              <p className="text-[#A1A1AA] mb-1 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#52525B]" /> Registered Email
              </p>
              <p className="font-semibold text-sm text-[#FAFAFA]">{employee?.email}</p>
            </div>

            <div>
              <p className="text-[#A1A1AA] mb-1 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#52525B]" /> Contact Telephone
              </p>
              <p className="font-semibold text-sm text-[#FAFAFA]">{employee?.phone || 'Not recorded'}</p>
            </div>

            <div>
              <p className="text-[#A1A1AA] mb-1 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#52525B]" /> Nationality
              </p>
              <p className="font-semibold text-sm text-[#FAFAFA]">{employee?.nationality || 'Not recorded'}</p>
            </div>

            <div>
              <p className="text-[#A1A1AA] mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#52525B]" /> Date of Birth
              </p>
              <p className="font-semibold text-sm text-[#FAFAFA]">{employee?.date_of_birth || 'Not recorded'}</p>
            </div>

            <div>
              <p className="text-[#A1A1AA] mb-1 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#52525B]" /> Passport Verification
              </p>
              <p className="font-semibold font-mono text-sm text-[#FAFAFA]">
                ••••••••{employee?.passport_number.slice(-4)}
              </p>
            </div>

            <div>
              <p className="text-[#A1A1AA] mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#52525B]" /> Passport Expiry
              </p>
              <p className="font-semibold text-sm text-[#FAFAFA]">{employee?.passport_expiry_date || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#303036] bg-[#141416] text-xs text-[#A1A1AA] flex items-center justify-between">
          <p>
            Need to update your passport or legal details? Please contact your appointed Orsa recruitment coordinator.
          </p>
        </div>
      </div>
    </EmployeeLayout>
  )
}
