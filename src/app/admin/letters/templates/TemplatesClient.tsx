'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Check, AlertTriangle, FileCode } from 'lucide-react'
import { createLetterTemplate, updateLetterTemplate } from '@/app/actions/letters'
import type { LetterTemplate, JobOffer } from '@/types/database'

interface TemplatesClientProps {
  templates: (LetterTemplate & { job_offer?: JobOffer | null })[]
  jobOffers: JobOffer[]
}

export default function TemplatesClient({ templates, jobOffers }: TemplatesClientProps) {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSaveTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    const payload = {
      name: formData.get('name') as string,
      job_offer_id: (formData.get('job_offer_id') as string) || null,
      content_json: {
        company_name: formData.get('company_name') as string,
        company_address: formData.get('company_address') as string,
        company_email: formData.get('company_email') as string,
        company_phone: formData.get('company_phone') as string,
        introduction: formData.get('introduction') as string,
        offer_body: formData.get('offer_body') as string,
        responsibilities: formData.get('responsibilities') as string,
        acceptance_instructions: formData.get('acceptance_instructions') as string,
        closing: formData.get('closing') as string,
        signatory_name: formData.get('signatory_name') as string,
        signatory_title: formData.get('signatory_title') as string,
      },
    }

    startTransition(async () => {
      let res
      if (selectedTemplate) {
        res = await updateLetterTemplate(selectedTemplate.id, payload)
      } else {
        res = await createLetterTemplate(payload)
      }

      if (!res.success) {
        setError(res.error || 'Failed to save template.')
      } else {
        setModalOpen(false)
        setSelectedTemplate(null)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/letters"
            className="p-2 rounded-lg bg-[#1D1D20] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#303036] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Letter Templates</h1>
            <p className="text-sm text-[#A1A1AA]">
              Configure standard boilerplate wording and responsibilities for specific job offerings.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedTemplate(null)
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-xs font-semibold text-white hover:bg-[#B91C1C]"
        >
          <Plus className="h-4 w-4" />
          Create Template Preset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#141416] border border-[#303036] text-[#A1A1AA]">
                  v{tpl.version}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-green-950/40 border border-green-800 text-green-400">
                  Active
                </span>
              </div>
              <h3 className="font-bold text-[#FAFAFA] text-base">{tpl.name}</h3>
              <p className="text-xs text-[#A1A1AA]">
                Linked Job Category: <span className="text-[#FAFAFA] font-medium">{tpl.job_offer?.title || 'Universal / Generic'}</span>
              </p>
              <p className="text-xs text-[#52525B] line-clamp-3">
                {tpl.content_json?.introduction || 'No custom introduction text configured.'}
              </p>
            </div>

            <div className="pt-6 border-t border-[#303036] mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedTemplate(tpl)
                  setModalOpen(true)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#303036] bg-[#141416] text-xs font-semibold text-[#FAFAFA] hover:border-[#E50914] transition-colors"
              >
                <Edit className="h-3.5 w-3.5 text-[#E50914]" />
                Edit Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#303036] bg-[#1D1D20] p-6 text-[#FAFAFA] shadow-2xl space-y-4">
            <h2 className="text-base font-bold">
              {selectedTemplate ? `Edit Template: ${selectedTemplate.name}` : 'New Letter Template'}
            </h2>

            {error && (
              <div className="p-3 rounded bg-red-950/40 border border-red-500/40 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Template Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedTemplate?.name || ''}
                    placeholder="e.g. Construction Placement v2"
                    className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Target Job Offer</label>
                  <select
                    name="job_offer_id"
                    defaultValue={selectedTemplate?.job_offer_id || ''}
                    className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                  >
                    <option value="">-- Generic / None --</option>
                    {jobOffers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    defaultValue={selectedTemplate?.content_json?.company_name || 'Orsa International Recruitment Agency'}
                    className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Company Address</label>
                  <input
                    type="text"
                    name="company_address"
                    defaultValue={selectedTemplate?.content_json?.company_address || '123 Business District, International Plaza'}
                    className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="company_email"
                    defaultValue={selectedTemplate?.content_json?.company_email || 'recruitment@orsa.com'}
                    className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    name="company_phone"
                    defaultValue={selectedTemplate?.content_json?.company_phone || '+1 (555) 019-2834'}
                    className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Introduction</label>
                <textarea
                  name="introduction"
                  rows={3}
                  defaultValue={selectedTemplate?.content_json?.introduction || ''}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Offer Body</label>
                <textarea
                  name="offer_body"
                  rows={3}
                  defaultValue={selectedTemplate?.content_json?.offer_body || ''}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="block text-[#A1A1AA] mb-1">Responsibilities Boilerplate</label>
                <textarea
                  name="responsibilities"
                  rows={3}
                  defaultValue={selectedTemplate?.content_json?.responsibilities || ''}
                  className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Signatory Name</label>
                  <input
                    type="text"
                    name="signatory_name"
                    defaultValue={selectedTemplate?.content_json?.signatory_name || 'Director of Human Resources'}
                    className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] mb-1">Signatory Title</label>
                  <input
                    type="text"
                    name="signatory_title"
                    defaultValue={selectedTemplate?.content_json?.signatory_title || 'Orsa Global Operations'}
                    className="w-full rounded bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#303036]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#303036] text-[#A1A1AA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-[#E50914] font-semibold text-white hover:bg-[#B91C1C]"
                >
                  {isPending ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
