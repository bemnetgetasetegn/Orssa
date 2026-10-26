'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react'
import { updateEmployee } from '@/app/actions/employees'
import type { Employee, JobOffer } from '@/types/database'
import type { EmployeeEditInput } from '@/lib/validation/schemas'

interface EditEmployeeClientProps {
  employee: Employee
  jobOffers: JobOffer[]
  isSuperAdmin: boolean
}

export default function EditEmployeeClient({
  employee,
  jobOffers,
  isSuperAdmin,
}: EditEmployeeClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    const payload: EmployeeEditInput = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      passport_number: (formData.get('passport_number') as string).toUpperCase(),
      registration_date: formData.get('registration_date') as string,
      job_offer_id: isSuperAdmin
        ? ((formData.get('job_offer_id') as string) || null)
        : (employee.job_offer_id || null),
      application_status: formData.get('application_status') as any,
      account_status: formData.get('account_status') as any,
      phone: (formData.get('phone') as string) || '',
      nationality: (formData.get('nationality') as string) || '',
      date_of_birth: (formData.get('date_of_birth') as string) || '',
      passport_expiry_date: (formData.get('passport_expiry_date') as string) || '',
      internal_notes: (formData.get('internal_notes') as string) || '',
    }

    startTransition(async () => {
      try {
        const res = await updateEmployee(employee.id, payload)
        if (!res.success) {
          setError(res.error || 'Failed to update employee.')
        } else {
          router.push(`/admin/employees/${employee.id}`)
          router.refresh()
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.')
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/employees/${employee.id}`}
          className="p-2 rounded-lg bg-[#1D1D20] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#303036] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Edit Employee Details</h1>
          <p className="text-sm text-[#A1A1AA]">Modify official candidate records and placement progress.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-950/40 border border-[#EF4444]/40 text-[#EF4444]">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#FAFAFA] border-b border-[#303036] pb-3">Primary Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Full Legal Name</label>
              <input
                type="text"
                name="full_name"
                defaultValue={employee.full_name}
                required
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                defaultValue={employee.email}
                required
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Passport Number</label>
              <input
                type="text"
                name="passport_number"
                defaultValue={employee.passport_number}
                required
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm uppercase text-[#FAFAFA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Registration Date</label>
              <input
                type="date"
                name="registration_date"
                defaultValue={employee.registration_date}
                required
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#FAFAFA] border-b border-[#303036] pb-3">Placement & Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#A1A1AA]">Job Offer Category</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-yellow-500 bg-yellow-950/40 border border-yellow-800/50 px-1.5 py-0.5 rounded">
                    Super Admin Only
                  </span>
                )}
              </div>
              {isSuperAdmin ? (
                <select
                  name="job_offer_id"
                  defaultValue={employee.job_offer_id || ''}
                  className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
                >
                  <option value="">-- None --</option>
                  {jobOffers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#A1A1AA]">
                  {jobOffers.find((o) => o.id === employee.job_offer_id)?.title || 'Unassigned (Pending Super Admin)'}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Application Progress</label>
              <select
                name="application_status"
                defaultValue={employee.application_status}
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Account Status</label>
              <select
                name="account_status"
                defaultValue={employee.account_status}
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#FAFAFA] border-b border-[#303036] pb-3">Additional Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Phone</label>
              <input
                type="text"
                name="phone"
                defaultValue={employee.phone || ''}
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Nationality</label>
              <input
                type="text"
                name="nationality"
                defaultValue={employee.nationality || ''}
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">DOB</label>
              <input
                type="date"
                name="date_of_birth"
                defaultValue={employee.date_of_birth || ''}
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Passport Expiry</label>
              <input
                type="date"
                name="passport_expiry_date"
                defaultValue={employee.passport_expiry_date || ''}
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-4">
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Administrative Notes</label>
              <textarea
                name="internal_notes"
                defaultValue={employee.internal_notes || ''}
                rows={3}
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/employees/${employee.id}`}
            className="px-5 py-2.5 rounded-lg border border-[#303036] text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-[#E50914] text-sm font-semibold text-[#FAFAFA] hover:bg-[#B91C1C] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isPending ? 'Saving Updates...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
