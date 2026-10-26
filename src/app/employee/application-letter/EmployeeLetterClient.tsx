'use client'

import { FileText, ShieldCheck } from 'lucide-react'
import LetterPreview from '@/components/letters/LetterPreview'
import type { ApplicationLetter, Employee, JobOffer, LetterContentJson } from '@/types/database'

interface EmployeeLetterClientProps {
  letter: ApplicationLetter & {
    employee: Employee
    job_offer: JobOffer | null
  } | null
}

export default function EmployeeLetterClient({ letter }: EmployeeLetterClientProps) {
  if (!letter || letter.status !== 'issued') {
    return (
      <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-12 text-center space-y-4">
        <FileText className="h-12 w-12 text-[#A1A1AA] mx-auto opacity-40" />
        <h2 className="text-lg font-bold text-[#FAFAFA]">Offer Letter Not Issued Yet</h2>
        <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
          Your formal employment offer letter has not yet been authorized or issued by the executive board. Please check back later or consult with your placement officer.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">
              Employment Offer Letter
            </h1>
            <span className="text-xs font-mono text-green-400 bg-green-950/40 border border-green-800 px-2 py-0.5 rounded">
              Official v{letter.current_version}
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Issued on {letter.issued_at ? new Date(letter.issued_at).toLocaleDateString() : 'Recent'} • Authorized Placement Document
          </p>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-4 rounded-xl border border-green-500/30 bg-green-950/20 text-xs text-green-300 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-green-400 flex-shrink-0" />
        <p>
          This document represents your legally approved employment offer. It contains your designated job classification, worksite assignment, and international sponsorship terms.
        </p>
      </div>

      {/* Styled A4 Document Display */}
      <div className="rounded-xl border border-[#303036] bg-[#141416] p-4 sm:p-8">
        <LetterPreview
          content={(letter.rendered_content as LetterContentJson) || {}}
          employeeName={letter.employee.full_name}
          jobTitle={letter.job_offer?.title || 'Worker'}
          passportNumber={letter.employee.passport_number}
          issueDate={letter.issued_at || undefined}
        />
      </div>
    </div>
  )
}
