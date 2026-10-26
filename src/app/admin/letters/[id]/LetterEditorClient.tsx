'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Send,
  FileDown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Eye,
  RefreshCw,
  FileCheck,
} from 'lucide-react'
import LetterPreview from '@/components/letters/LetterPreview'
import {
  updateApplicationLetter,
  issueLetter,
  generateLetterPdf,
  getLetterDownloadUrl,
} from '@/app/actions/letters'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatusBadge } from '@/components/employees/status-badge'
import type { ApplicationLetter, LetterTemplate, LetterContentJson, Employee, JobOffer } from '@/types/database'

interface LetterEditorClientProps {
  letter: ApplicationLetter & {
    employee: Employee
    job_offer: JobOffer | null
  }
  templates: LetterTemplate[]
}

export default function LetterEditorClient({ letter, templates }: LetterEditorClientProps) {
  const router = useRouter()
  const [content, setContent] = useState<LetterContentJson>(
    letter.rendered_content || {
      company_name: 'Orsa International Recruitment Agency',
      company_address: '123 Business District, International Plaza',
      company_email: 'recruitment@orsa.com',
      company_phone: '+1 (555) 019-2834',
      greeting: `Dear ${letter.employee.full_name},`,
      introduction:
        'We are pleased to extend this formal employment offer following your successful interview and skills assessment with Orsa International Recruitment Agency.',
      offer_body: `You are hereby offered the official placement of ${letter.job_offer?.title || 'Worker'}.`,
      work_location: letter.job_offer?.default_work_location || 'Designated Regional Project Site',
      visa_duration: letter.job_offer?.default_visa_duration || '24 Months',
      salary: letter.job_offer?.default_salary ? `$${letter.job_offer.default_salary} USD / Month` : 'Competitive',
      responsibilities: letter.job_offer?.responsibilities || '',
      accommodation: 'Furnished Company Housing Provided',
      food_allowance: 'Full Monthly Sustenance Allowance',
      acceptance_instructions:
        'Please acknowledge acceptance of this appointment by counter-signing and uploading through your Orsa candidate portal within 14 calendar days.',
      closing: 'Sincerely,',
      signatory_name: 'Director of Human Resources',
      signatory_title: 'Orsa International Operations',
    }
  )

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [isPending, startTransition] = useTransition()
  const [issueConfirmOpen, setIssueConfirmOpen] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [downloading, setDownloading] = useState(false)

  const isIssued = letter.status === 'issued'

  const handleFieldChange = (field: keyof LetterContentJson, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }))
  }

  const handleTemplateSelect = (templateId: string) => {
    const selected = templates.find((t) => t.id === templateId)
    if (selected && selected.content_json) {
      setContent({
        ...selected.content_json,
        greeting: `Dear ${letter.employee.full_name},`,
      })
      setMessage({ type: 'success', text: `Loaded template: ${selected.name}` })
    }
  }

  const handleSaveDraft = async () => {
    setMessage(null)
    startTransition(async () => {
      const res = await updateApplicationLetter(letter.id, {
        rendered_content: content,
        status: isIssued ? 'issued' : 'draft',
      })
      if (res.success) {
        setMessage({ type: 'success', text: 'Draft revisions saved successfully.' })
        router.refresh()
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save letter.' })
      }
    })
  }

  const handleIssueLetter = async () => {
    setMessage(null)
    startTransition(async () => {
      // First save content
      await updateApplicationLetter(letter.id, {
        rendered_content: content,
      })
      // Then issue
      const res = await issueLetter(letter.id)
      setIssueConfirmOpen(false)
      if (res.success) {
        setMessage({ type: 'success', text: 'Letter officially issued to candidate portal!' })
        // Trigger background PDF generation
        await generateLetterPdf(letter.id)
        router.refresh()
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to issue letter.' })
      }
    })
  }

  const handleDownloadPdf = async () => {
    setDownloading(true)
    try {
      // Ensure PDF is generated
      await generateLetterPdf(letter.id)
      const res = await getLetterDownloadUrl(letter.id)
      if (res.success && res.data) {
        const url = typeof res.data === 'string' ? res.data : (res.data as any).signed_url
        window.open(url, '_blank')
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to generate download URL.' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Download error.' })
    } finally {
      setDownloading(false)
    }
  }

  const insertVariable = (variable: string) => {
    setContent((prev) => ({
      ...prev,
      introduction: `${prev.introduction || ''} {{${variable}}}`,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/employees/${letter.employee.id}`}
            className="p-2 rounded-lg bg-[#1D1D20] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#303036] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">
                Employment Offer Letter
              </h1>
              <StatusBadge type="letter" status={letter.status} />
              <span className="text-xs font-mono text-[#A1A1AA] bg-[#141416] px-2 py-0.5 rounded border border-[#303036]">
                v{letter.current_version}
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Candidate: <span className="text-[#FAFAFA] font-medium">{letter.employee.full_name}</span> ({letter.employee.passport_number}) • Role: {letter.job_offer?.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#303036] bg-[#1D1D20] text-xs font-semibold text-[#FAFAFA] hover:bg-[#27272A] transition-colors cursor-pointer"
          >
            <Save className="h-3.5 w-3.5 text-[#A1A1AA]" />
            Save Draft
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#303036] bg-[#1D1D20] text-xs font-semibold text-[#FAFAFA] hover:bg-[#27272A] transition-colors cursor-pointer"
          >
            <FileDown className="h-3.5 w-3.5 text-[#A1A1AA]" />
            {downloading ? 'Preparing PDF...' : 'Download PDF'}
          </button>

          <button
            onClick={() => setIssueConfirmOpen(true)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E50914] text-xs font-semibold text-white hover:bg-[#B91C1C] transition-colors cursor-pointer shadow-lg shadow-[#E50914]/20"
          >
            <Send className="h-3.5 w-3.5" />
            {isIssued ? 'Re-Issue New Version' : 'Issue Official Offer'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-950/40 border-green-500/40 text-green-400'
              : 'bg-red-950/40 border-red-500/40 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Template Preset Selector & Dynamic Tags Bar */}
      <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#A1A1AA]">Load Template:</span>
          <select
            onChange={(e) => handleTemplateSelect(e.target.value)}
            defaultValue=""
            className="rounded-lg bg-[#141416] border border-[#303036] px-3 py-1.5 text-xs text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
          >
            <option value="" disabled>
              -- Select Corporate Preset --
            </option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#A1A1AA]">
          <span className="font-semibold text-xs text-[#FAFAFA] mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#E50914]" /> Dynamic Variables:
          </span>
          {['employee_name', 'passport_number', 'job_title', 'work_location', 'salary', 'visa_duration'].map(
            (v) => (
              <button
                key={v}
                type="button"
                onClick={() => insertVariable(v)}
                className="px-2 py-0.5 rounded bg-[#141416] border border-[#303036] hover:border-[#E50914] text-[#A1A1AA] hover:text-[#FAFAFA] font-mono transition-colors"
              >
                {`{{${v}}}`}
              </button>
            )
          )}
        </div>
      </div>

      {/* Split view toggle for mobile */}
      <div className="flex lg:hidden border-b border-[#303036] mb-4">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 ${
            activeTab === 'editor' ? 'border-[#E50914] text-[#E50914]' : 'border-transparent text-[#A1A1AA]'
          }`}
        >
          Structured Editor
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 ${
            activeTab === 'preview' ? 'border-[#E50914] text-[#E50914]' : 'border-transparent text-[#A1A1AA]'
          }`}
        >
          Live A4 Preview
        </button>
      </div>

      {/* Split Screen Layout (Editor on Left, Live Preview on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: Structured Rich Editor */}
        <div className={`space-y-4 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#FAFAFA] border-b border-[#303036] pb-2">
              Letterhead & Agency Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#A1A1AA] mb-1">Company Name</label>
                <input
                  type="text"
                  value={content.company_name || ''}
                  onChange={(e) => handleFieldChange('company_name', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Official Address</label>
                <input
                  type="text"
                  value={content.company_address || ''}
                  onChange={(e) => handleFieldChange('company_address', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Contact Email</label>
                <input
                  type="email"
                  value={content.company_email || ''}
                  onChange={(e) => handleFieldChange('company_email', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Telephone</label>
                <input
                  type="tel"
                  value={content.company_phone || ''}
                  onChange={(e) => handleFieldChange('company_phone', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#FAFAFA] border-b border-[#303036] pb-2">
              Opening Statement & Terms
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#A1A1AA] mb-1">Salutation / Greeting</label>
                <input
                  type="text"
                  value={content.greeting || ''}
                  onChange={(e) => handleFieldChange('greeting', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Introduction Paragraph</label>
                <textarea
                  rows={3}
                  value={content.introduction || ''}
                  onChange={(e) => handleFieldChange('introduction', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Offer Body Text</label>
                <textarea
                  rows={3}
                  value={content.offer_body || ''}
                  onChange={(e) => handleFieldChange('offer_body', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#FAFAFA] border-b border-[#303036] pb-2">
              Contractual Placement Terms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#A1A1AA] mb-1">Work Location</label>
                <input
                  type="text"
                  value={content.work_location || ''}
                  onChange={(e) => handleFieldChange('work_location', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Contract / Visa Duration</label>
                <input
                  type="text"
                  value={content.visa_duration || ''}
                  onChange={(e) => handleFieldChange('visa_duration', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Compensation / Salary</label>
                <input
                  type="text"
                  value={content.salary || ''}
                  onChange={(e) => handleFieldChange('salary', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Accommodation Terms</label>
                <input
                  type="text"
                  value={content.accommodation || ''}
                  onChange={(e) => handleFieldChange('accommodation', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#A1A1AA] mb-1">Specific Operational Responsibilities</label>
                <textarea
                  rows={4}
                  value={content.responsibilities || ''}
                  onChange={(e) => handleFieldChange('responsibilities', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#A1A1AA] mb-1">Acceptance Instructions & Deadlines</label>
                <textarea
                  rows={2}
                  value={content.acceptance_instructions || ''}
                  onChange={(e) => handleFieldChange('acceptance_instructions', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#FAFAFA] border-b border-[#303036] pb-2">
              Signatures & Official Closing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#A1A1AA] mb-1">Signatory Full Name</label>
                <input
                  type="text"
                  value={content.signatory_name || ''}
                  onChange={(e) => handleFieldChange('signatory_name', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1AA] mb-1">Signatory Title</label>
                <input
                  type="text"
                  value={content.signatory_title || ''}
                  onChange={(e) => handleFieldChange('signatory_title', e.target.value)}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3 py-1.5 text-[#FAFAFA]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Responsive Preview (Paper Simulation) */}
        <div className={`sticky top-6 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <div className="rounded-xl border border-[#303036] bg-[#141416] p-4 mb-2 flex items-center justify-between text-xs text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-[#E50914]" /> Dynamic A4 Typeset Preview
            </span>
            <span>Scale: 100% (A4 Standard)</span>
          </div>

          <LetterPreview
            content={content}
            employeeName={letter.employee.full_name}
            jobTitle={letter.job_offer?.title || 'Worker'}
            passportNumber={letter.employee.passport_number}
            issueDate={letter.issued_at || undefined}
          />
        </div>
      </div>

      {/* Confirmation Dialog for Issuing */}
      <ConfirmDialog
        open={issueConfirmOpen}
        onClose={() => setIssueConfirmOpen(false)}
        onConfirm={handleIssueLetter}
        title="Issue Official Employment Letter?"
        description="Issuing locks this document snapshot, bumps the official version number, generates a verifiable PDF, and makes it available to the candidate's dashboard."
        confirmLabel="Issue Official Offer"
        type="destructive"
      />
    </div>
  )
}
