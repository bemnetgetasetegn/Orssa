import React from 'react'
import type { LetterContentJson } from '@/types/database'

interface LetterPreviewProps {
  content: LetterContentJson
  employeeName: string
  jobTitle: string
  issueDate?: string
  passportNumber?: string
}

export default function LetterPreview({
  content,
  employeeName,
  jobTitle,
  issueDate,
  passportNumber,
}: LetterPreviewProps) {
  const formattedDate = issueDate
    ? new Date(issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-2xl p-8 sm:p-12 max-w-3xl mx-auto border border-gray-200 text-xs sm:text-sm leading-relaxed font-serif">
      {/* Letterhead */}
      <div className="border-b-2 border-[#E50914] pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-wide text-[#E50914]">
            {content.company_name || 'ORSA RECRUITMENT AGENCY'}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {content.company_address || 'Global Workforce Solutions & International Placements'}
          </p>
          <p className="text-gray-500 text-xs">
            Email: {content.company_email || 'contact@orsa.com'} | Tel:{' '}
            {content.company_phone || '+1 (555) 019-2834'}
          </p>
        </div>
        <div className="text-right sm:text-right text-xs text-gray-400">
          <p>ISO 9001:2015 CERTIFIED</p>
          <p>LIC: ORSA-INTL-REC-892</p>
        </div>
      </div>

      {/* Date & Ref */}
      <div className="flex justify-between text-xs text-gray-500 mb-6">
        <span>Date: {formattedDate}</span>
        <span>Ref: ORSA-OFFER-{employeeName.slice(0, 3).toUpperCase()}-2026</span>
      </div>

      {/* Recipient block */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
        <p className="font-bold text-gray-900 text-sm">{employeeName}</p>
        {passportNumber && <p className="text-gray-600 text-xs">Passport No: {passportNumber}</p>}
        <p className="text-gray-600 text-xs">Position: {jobTitle}</p>
      </div>

      {/* Subject */}
      <div className="mb-6">
        <p className="font-bold text-sm text-gray-900 uppercase tracking-wide underline">
          Subject: Formal Offer of Employment — {jobTitle}
        </p>
      </div>

      {/* Greeting */}
      <p className="mb-4">{content.greeting || `Dear ${employeeName},`}</p>

      {/* Intro */}
      <p className="mb-4 text-justify">
        {content.introduction ||
          'We are delighted to extend to you this formal offer of international employment through Orsa Recruitment Agency. Following a comprehensive review of your vocational profile, we have determined that your qualifications align precisely with our sponsor’s requirements.'}
      </p>

      {/* Offer Body */}
      <p className="mb-6 text-justify">
        {content.offer_body ||
          `Under this appointment, you will serve in the capacity of ${jobTitle}. The terms, privileges, and standard conditions governing your overseas employment are detailed below.`}
      </p>

      {/* Key terms summary table */}
      <div className="border border-gray-200 rounded overflow-hidden mb-6">
        <table className="w-full text-left text-xs divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 px-3 font-bold bg-gray-50 text-gray-700 w-1/3">Position Offered</td>
              <td className="py-2 px-3 text-gray-900">{jobTitle}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-bold bg-gray-50 text-gray-700">Designated Worksite</td>
              <td className="py-2 px-3 text-gray-900">{content.work_location || 'Project Site, To Be Confirmed'}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-bold bg-gray-50 text-gray-700">Contract & Visa Duration</td>
              <td className="py-2 px-3 text-gray-900">{content.visa_duration || '24 Months (Renewable)'}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-bold bg-gray-50 text-gray-700">Monthly Compensation</td>
              <td className="py-2 px-3 text-gray-900">{content.salary || 'As per contractual agreement'}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-bold bg-gray-50 text-gray-700">Housing & Sustenance</td>
              <td className="py-2 px-3 text-gray-900">
                {content.accommodation || 'Company Provided'} | {content.food_allowance || 'Covered Allowance'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Responsibilities */}
      {content.responsibilities && (
        <div className="mb-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
            Key Responsibilities & Operational Scope
          </h3>
          <p className="text-gray-800 text-justify whitespace-pre-line text-xs">{content.responsibilities}</p>
        </div>
      )}

      {/* Acceptance instructions */}
      <div className="mb-8">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
          Acceptance & Next Steps
        </h3>
        <p className="text-justify text-xs text-gray-700">
          {content.acceptance_instructions ||
            'To confirm acceptance of this position, please sign and submit the requisite declarations through your secure Orsa candidate portal within fourteen (14) business days of this notice.'}
        </p>
      </div>

      {/* Signature block */}
      <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
        <div>
          <p className="mb-8">{content.closing || 'Respectfully,'}</p>
          <div className="w-48 border-t border-gray-400 pt-1">
            <p className="font-bold text-gray-900 text-xs">
              {content.signatory_name || 'Authorized Recruitment Director'}
            </p>
            <p className="text-gray-500 text-[11px]">
              {content.signatory_title || 'Orsa Global Human Resources'}
            </p>
          </div>
        </div>

        <div className="text-center p-3 border border-gray-300 rounded bg-gray-50">
          <div className="w-16 h-16 border border-dashed border-[#E50914] flex items-center justify-center text-[10px] text-[#E50914] font-bold mx-auto mb-1">
            SEAL
          </div>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Orsa Official Stamp</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400">
        <p>
          {content.footer ||
            'Orsa International Recruitment Agency • Confidential & Legally Binding Employment Offer'}
        </p>
      </div>
    </div>
  )
}
