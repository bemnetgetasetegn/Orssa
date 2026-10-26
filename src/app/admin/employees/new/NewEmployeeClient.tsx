'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Copy, Check, Eye, EyeOff, AlertTriangle, ShieldCheck, UserPlus } from 'lucide-react'
import { registerEmployee } from '@/app/actions/employees'
import { CredentialDialog } from '@/components/employees/credential-dialog'
import type { JobOffer, CredentialResponse } from '@/types/database'

interface NewEmployeeClientProps {
  jobOffers: JobOffer[]
  isSuperAdmin?: boolean
}

export default function NewEmployeeClient({ jobOffers, isSuperAdmin = false }: NewEmployeeClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<CredentialResponse | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  // Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photograph must be smaller than 5MB.')
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (photoFile) {
      formData.set('photo', photoFile)
    }

    startTransition(async () => {
      try {
        const res = await registerEmployee(formData)
        if (!res.success) {
          setError(res.error || 'Failed to register employee.')
        } else if (res.data) {
          setCredentials(res.data)
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.')
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/employees"
          className="p-2 rounded-lg bg-[#1D1D20] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#303036] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Register New Employee</h1>
          <p className="text-sm text-[#A1A1AA]">
            Enroll an international recruit, capture passport data, and generate secure temporary credentials.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-950/40 border border-[#EF4444]/40 text-[#EF4444]">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Identity & Photograph */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-6">
          <h2 className="text-base font-semibold text-[#FAFAFA] border-b border-[#303036] pb-3 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#E50914]" /> Primary Identification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo upload column */}
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#303036] rounded-xl bg-[#141416]/50 hover:border-[#E50914]/50 transition-colors">
              {photoPreview ? (
                <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-[#E50914]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <label
                    htmlFor="photo-upload"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs text-[#FAFAFA] font-medium"
                  >
                    Change Photo
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center cursor-pointer text-center p-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1D1D20] flex items-center justify-center border border-[#303036] mb-3 text-[#A1A1AA]">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-[#FAFAFA]">Upload Photograph</span>
                  <span className="text-xs text-[#A1A1AA] mt-1">JPG, PNG, or WebP (max 5MB)</span>
                </label>
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Core fields column */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Full Legal Name <span className="text-[#E50914]">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="e.g. Johnathan Doe"
                  className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Registered Email Address <span className="text-[#E50914]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="recruit@example.com"
                  className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Passport Number <span className="text-[#E50914]">*</span>
                </label>
                <input
                  type="text"
                  name="passport_number"
                  required
                  placeholder="e.g. P12345678"
                  className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm uppercase tracking-wide text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Registration Date <span className="text-[#E50914]">*</span>
                </label>
                <input
                  type="date"
                  name="registration_date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
                />
              </div>

              {isSuperAdmin ? (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                    Assigned Job Offer Category <span className="text-[#E50914]">*</span>
                  </label>
                  <select
                    name="job_offer_id"
                    required
                    className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="">-- Select Job Offer --</option>
                    {jobOffers.map((offer) => (
                      <option key={offer.id} value={offer.id}>
                        {offer.title} ({offer.currency} {offer.default_salary ? Number(offer.default_salary).toLocaleString() : 'Negotiable'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="sm:col-span-2 p-3.5 rounded-lg border border-[#303036] bg-[#141416]/60">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-[#A1A1AA]">
                      Assigned Job Offer Category
                    </label>
                    <span className="text-[10px] text-yellow-500 bg-yellow-950/40 border border-yellow-800/50 px-2 py-0.5 rounded font-medium">
                      Super Admin Only
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#FAFAFA] flex items-center gap-2 pt-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                    Pending Super Admin Assignment
                  </p>
                  <p className="text-[11px] text-[#71717A] leading-relaxed pt-1">
                    Job offer categories (e.g. Construction Worker, Industry Worker) are designated exclusively by the Super Admin following registration.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Extended Details (Optional) */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-6">
          <h2 className="text-base font-semibold text-[#FAFAFA] border-b border-[#303036] pb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#A1A1AA]" /> Additional Background Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Nationality</label>
              <input
                type="text"
                name="nationality"
                placeholder="e.g. Polish, Mexican, etc."
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Passport Expiry Date</label>
              <input
                type="date"
                name="passport_expiry_date"
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Initial Account Status</label>
              <select
                name="account_status"
                defaultValue="active"
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
              >
                <option value="active">Active (Access Allowed)</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended (Access Blocked)</option>
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Internal Administrative Notes</label>
              <textarea
                name="internal_notes"
                rows={3}
                placeholder="Private remarks regarding application vetting or medical clearance..."
                className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/employees"
            className="px-5 py-2.5 rounded-lg border border-[#303036] text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1D1D20] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-[#E50914] text-sm font-semibold text-[#FAFAFA] hover:bg-[#B91C1C] transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-[#E50914]/20 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Registering & Generating Credentials...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </div>
      </form>

      {/* Credential Delivery Dialog */}
      {credentials && (
        <CredentialDialog
          open={!!credentials}
          onClose={() => {
            setCredentials(null)
            router.push(`/admin/employees`)
          }}
          credentials={credentials}
        />
      )}
    </div>
  )
}
