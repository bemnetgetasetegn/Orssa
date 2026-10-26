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
    ? new Date(issueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

  // Dynamic job role resolution: prevent fallback "Worker" from masking real role
  const resolvedJobTitle =
    jobTitle && jobTitle.trim().toLowerCase() !== 'worker'
      ? jobTitle.trim()
      : (content as any)?.job_title || (content as any)?.position || 'Construction Worker'

  // Dynamic location resolution: replace {{work_location}} placeholder or empty value
  const resolvedWorkLocation =
    content.work_location &&
    content.work_location.trim() !== '{{work_location}}' &&
    content.work_location.trim().toLowerCase() !== 'to be determined'
      ? content.work_location.trim()
      : 'European Project Sites (Romania / Finland)'

  const companyName = 'Orsa Recruitment Agency'
  const companyAddress = content.company_address || '123 Business District, International Plaza'
  const companyEmail = 'contact@orssa.net'
  const companyPhone = content.company_phone || '+1 (555) 019-2834'
  const website = 'www.orssa.net'

  // Helper to replace static/placeholder tokens across template fields
  const sanitizeText = (text: string | undefined): string => {
    if (!text) return ''
    return text
      .replace(/\{\{work_location\}\}/g, resolvedWorkLocation)
      .replace(/\{\{job_title\}\}/g, resolvedJobTitle)
      .replace(/\{\{employee_name\}\}/g, employeeName)
      .replace(/\bthe role of Worker\b/gi, `the role of ${resolvedJobTitle}`)
      .replace(/\bposition of Worker\b/gi, `position of ${resolvedJobTitle}`)
  }

  const rawOfferBody = content.offer_body || ''
  const sanitizedOfferBody = sanitizeText(rawOfferBody)

  return (
    <div className="relative bg-white text-slate-800 rounded-lg shadow-2xl max-w-4xl mx-auto border border-slate-200 overflow-hidden font-sans text-xs sm:text-sm leading-relaxed transition-all">
      {/* Left Vertical Decorative Ribbon Accent - ORSA RED THEME */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 sm:w-3.5 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #E50914 0%, #DC2626 50%, #991B1B 100%)',
        }}
      />

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden opacity-[0.05]">
        <img
          src="/letter-assets/watermark.png"
          alt="Orsa Watermark"
          className="w-[480px] max-w-full object-contain"
        />
      </div>

      <div className="relative z-10 pl-6 sm:pl-10 pr-6 sm:pr-10 pt-8 pb-10">
        {/* Top Header / Letterhead */}
        <div className="border-b-2 border-[#E50914] pb-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Logo & Tagline */}
            <div className="space-y-1.5 max-w-md">
              <img
                src="/letter-assets/logo.png"
                alt="Orsa Recruitment Agency"
                className="h-12 sm:h-14 w-auto object-contain"
              />
              <p className="text-[11px] sm:text-xs font-bold tracking-wider text-[#E50914] uppercase">
                Your Future. Our Priority.
              </p>
            </div>

            {/* Company Contact Details */}
            <div className="text-left sm:text-right text-[11px] text-slate-500 space-y-0.5">
              <p className="font-bold text-slate-900 text-xs">{companyName}</p>
              <p>{companyAddress}</p>
              <p>Phone: {companyPhone}</p>
              <p>Email: {companyEmail}</p>
              <p className="text-[#E50914] font-bold">{website}</p>
            </div>
          </div>

          {/* Thin decorative red gradient sub-rule */}
          <div className="h-0.5 w-full bg-gradient-to-r from-[#E50914] via-[#F87171] to-[#E50914]/20 mt-3" />
        </div>

        {/* Date, Ref, and Recipient Meta Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Recipient Details */}
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-md p-3.5 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">
              Candidate Information
            </div>
            <p className="font-bold text-slate-900 text-sm">{employeeName}</p>
            {passportNumber && (
              <p className="text-xs text-slate-700">
                <span className="font-medium text-slate-500">Passport Number:</span> {passportNumber}
              </p>
            )}
            <p className="text-xs text-slate-700">
              <span className="font-medium text-slate-500">Proposed Role:</span>{' '}
              <span className="font-bold text-[#DC2626]">{resolvedJobTitle}</span>
            </p>
          </div>

          {/* Issuance Meta */}
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-1 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Document Details
              </div>
              <p className="text-xs text-slate-700 mt-1">
                <span className="font-medium text-slate-500">Date:</span> {formattedDate}
              </p>
              <p className="text-xs text-slate-700">
                <span className="font-medium text-slate-500">Reference:</span>{' '}
                <span className="font-mono text-slate-900">
                  REF-{employeeName.slice(0, 3).toUpperCase()}-2026-ORSA
                </span>
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 rounded w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
              Official Employment Offer
            </div>
          </div>
        </div>

        {/* Subject Header Banner - RED THEME */}
        <div className="bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#E50914] text-white px-4 py-2.5 rounded-md mb-6 shadow-sm">
          <p className="font-bold text-xs sm:text-sm tracking-wide uppercase">
            Subject: Formal Offer of Employment — {resolvedJobTitle}
          </p>
        </div>

        {/* Salutation */}
        <p className="font-bold text-slate-900 mb-4 text-sm">
          {content.greeting || `Dear Mr. ${employeeName},`}
        </p>

        {/* Introduction */}
        <p className="mb-4 text-justify text-slate-700 leading-relaxed">
          {sanitizeText(content.introduction) ||
            `On behalf of ${companyName}, it is with immense pleasure and excitement that we extend this official offer of employment for the position of ${resolvedJobTitle}. We have been thoroughly impressed with your qualifications and believe your skills and dedication will be a significant asset to our international projects. This opportunity represents a gateway to a rewarding career, offering a stable environment and substantial growth prospects.`}
        </p>

        {/* Offer Body */}
        <p className="mb-6 text-justify text-slate-700 leading-relaxed">
          {sanitizedOfferBody ||
            `We are offering you the position of ${resolvedJobTitle} based at ${resolvedWorkLocation}. This opportunity has been secured through our international recruitment network and represents an excellent career development prospect. Joining our team means becoming part of a community dedicated to excellence, safety, and mutual respect.`}
        </p>

        {/* Position Details & Location Section */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
            <span className="w-2 h-2 rounded-sm bg-[#E50914]" />
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-[#991B1B]">
              Position Details &amp; Designated Worksite
            </h3>
          </div>
          <p className="text-slate-700 text-justify leading-relaxed">
            {sanitizeText(content.responsibilities) ||
              `You are being offered the role of ${resolvedJobTitle}, where you will be instrumental in ongoing operations. Your primary worksite will be located at ${resolvedWorkLocation}, specifically tailored to projects that require skilled and dedicated individuals. Your duties encompass site preparation, execution of designated trade tasks, and rigorous adherence to occupational safety standards.`}
          </p>
        </div>

        {/* Key Contract Summary Grid / Table - RED THEME */}
        <div className="mb-6 rounded-lg border border-[#FECACA] overflow-hidden shadow-sm">
          <div className="bg-[#FEF2F2] px-4 py-2 border-b border-[#FECACA] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#991B1B]">
              Contract &amp; Employment Specifications
            </span>
            <span className="text-[10px] text-slate-500 font-mono">REG-SEC-2026</span>
          </div>
          <table className="w-full text-left text-xs divide-y divide-[#FEE2E2]">
            <tbody className="divide-y divide-[#FEE2E2]">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60 w-1/3">
                  Designated Position
                </td>
                <td className="py-2.5 px-4 font-bold text-[#DC2626]">{resolvedJobTitle}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">
                  Primary Worksite
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-medium">
                  {resolvedWorkLocation}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">
                  Contract &amp; Visa Validity
                </td>
                <td className="py-2.5 px-4 font-semibold text-slate-900">
                  {content.visa_duration || '2 (Two) Years Initial Validity (Renewable)'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">
                  Gross Monthly Compensation
                </td>
                <td className="py-2.5 px-4 font-bold text-slate-900">
                  {content.salary || '1600€ (One Thousand Six Hundred Euros) per month'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">
                  Accommodation &amp; Sustenance
                </td>
                <td className="py-2.5 px-4 text-slate-800">
                  {content.accommodation || 'Company Provided Housing'} &amp;{' '}
                  {content.food_allowance || 'Daily Meal Provision / Allowance'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Benefits Package Highlights */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
            <span className="w-2 h-2 rounded-sm bg-[#E50914]" />
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-[#991B1B]">
              Comprehensive Benefits Package
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block">Accommodation:</span>
              <span className="text-[11px] text-slate-600">
                Comfortable, verified housing provided for the full duration of employment.
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block">Food &amp; Sustenance:</span>
              <span className="text-[11px] text-slate-600">
                Daily nutritional support or stipend provided to maintain optimal health.
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block">Medical Insurance:</span>
              <span className="text-[11px] text-slate-600">
                Full healthcare coverage under international occupational safety systems.
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block">Paid Time Off:</span>
              <span className="text-[11px] text-slate-600">
                2 (Two) weeks paid annual leave per year for rest and recreation.
              </span>
            </div>
          </div>
        </div>

        {/* Acceptance and Instructions - CONTACTING YOUR AGENCY Wording */}
        <div className="mb-8 p-3.5 rounded-md bg-[#FEF2F2] border border-[#FECACA]">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#991B1B] mb-1.5">
            Acceptance &amp; Next Steps
          </h3>
          <p className="text-slate-800 text-xs text-justify leading-relaxed font-medium">
            To accept this offer, please confirm your acceptance by contacting your agency. Further
            instructions regarding documentation and pre-departure procedures will follow upon your
            acceptance.
          </p>
        </div>

        {/* Authentication, Signature & Official Stamp Section */}
        <div className="pt-4 border-t border-slate-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            {/* Signature Block */}
            <div className="space-y-1">
              <p className="text-slate-700 mb-1">{content.closing || 'Sincerely,'}</p>

              {/* Red Handwritten Signature - Ville Oskari */}
              <div className="relative h-14 w-44">
                <img
                  src="/letter-assets/signature.png"
                  alt="Ville Oskari Signature"
                  className="h-14 w-auto object-contain transform -rotate-1"
                />
              </div>

              <div className="w-56 border-t-2 border-slate-400 pt-1">
                <p className="font-bold text-slate-900 text-xs">
                  {content.signatory_name || 'Ville Oskari'}
                </p>
                <p className="text-[11px] text-slate-600">
                  {content.signatory_title || 'Recruitment Director'}
                </p>
                <p className="text-[11px] font-bold text-[#E50914]">{companyName}</p>
                <p className="text-[10px] text-slate-400 italic">Your Future. Our Priority.</p>
              </div>
            </div>

            {/* Official Circular Stamp & Security Seal */}
            <div className="flex flex-col items-center sm:items-end">
              <div className="relative group">
                {/* Authentic circular red ORSA stamp */}
                <img
                  src="/letter-assets/stamp.png"
                  alt="Orsa Official Seal"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain transform rotate-[-4deg] drop-shadow-sm opacity-95 transition-transform hover:scale-105"
                />
              </div>
              <div className="mt-1 text-center sm:text-right">
                <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 block">
                  Official Embossed Stamp
                </span>
                <span className="text-[9px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Verified &amp; Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Running Footer */}
        <div className="mt-8 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
          <span>{companyName} • Confidential &amp; Binding Employment Offer</span>
          <span className="font-bold text-[#E50914]">{website}</span>
        </div>
      </div>
    </div>
  )
}
