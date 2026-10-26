import React from 'react'
import type { LetterContentJson } from '@/types/database'
import Image from 'next/image'

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

  const companyName = content.company_name || 'Gilbertin Kansainvälinen Työagentti'
  const companyAddress = content.company_address || 'Hämeenkatu 10, 33100 Tampere, Finland'
  const companyEmail = content.company_email || 'info@kansainvalinentyo.com'
  const companyPhone = content.company_phone || '+358 9 876 5432'
  const website = 'www.kansainvalinentyo.com'

  return (
    <div className="relative bg-white text-slate-800 rounded-lg shadow-2xl max-w-4xl mx-auto border border-slate-200 overflow-hidden font-sans text-xs sm:text-sm leading-relaxed transition-all">
      {/* Left Vertical Decorative Ribbon Accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 sm:w-3 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #1E88B5 0%, #2993C1 40%, #0F3A5D 100%)',
        }}
      />

      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden opacity-[0.06]">
        <img
          src="/letter-assets/watermark.png"
          alt="Watermark"
          className="w-[520px] max-w-full object-contain"
        />
      </div>

      <div className="relative z-10 pl-6 sm:pl-10 pr-6 sm:pr-10 pt-8 pb-10">
        {/* Top Header / Letterhead */}
        <div className="border-b-2 border-[#1E88B5] pb-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Logo & Tagline */}
            <div className="space-y-1.5 max-w-md">
              <img
                src="/letter-assets/logo.png"
                alt={companyName}
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#1E88B5] uppercase">
                Your International Employment Partner
              </p>
            </div>

            {/* Company Contact Details */}
            <div className="text-left sm:text-right text-[11px] text-slate-500 space-y-0.5">
              <p className="font-bold text-slate-800 text-xs">{companyName}</p>
              <p>{companyAddress}</p>
              <p>Phone: {companyPhone}</p>
              <p>Email: {companyEmail}</p>
              <p className="text-[#1E88B5] font-medium">{website}</p>
            </div>
          </div>

          {/* Thin decorative gold/cyan sub-rule */}
          <div className="h-0.5 w-full bg-gradient-to-r from-[#1E88B5] via-[#38BDF8] to-[#1E88B5]/20 mt-3" />
        </div>

        {/* Date, Ref, and Recipient Meta Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Recipient Details */}
          <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-md p-3.5 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#0369A1]">
              Candidate Information
            </div>
            <p className="font-bold text-slate-900 text-sm">{employeeName}</p>
            {passportNumber && (
              <p className="text-xs text-slate-700">
                <span className="font-medium text-slate-500">Passport Number:</span> {passportNumber}
              </p>
            )}
            <p className="text-xs text-slate-700">
              <span className="font-medium text-slate-500">Proposed Role:</span> {jobTitle}
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
                  REF-{employeeName.slice(0, 3).toUpperCase()}-2026-FI
                </span>
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Official Employment Offer
            </div>
          </div>
        </div>

        {/* Subject Header Banner */}
        <div className="bg-gradient-to-r from-[#0F3A5D] to-[#1E88B5] text-white px-4 py-2.5 rounded-md mb-6 shadow-sm">
          <p className="font-bold text-xs sm:text-sm tracking-wide uppercase">
            Subject: Formal Offer of Employment — {jobTitle}
          </p>
        </div>

        {/* Salutation */}
        <p className="font-bold text-slate-900 mb-4 text-sm">
          {content.greeting || `Dear Mr. ${employeeName},`}
        </p>

        {/* Introduction */}
        <p className="mb-4 text-justify text-slate-700 leading-relaxed">
          {content.introduction ||
            `On behalf of ${companyName}, it is with immense pleasure and excitement that we extend this official offer of employment for the position of ${jobTitle}. We have been thoroughly impressed with your qualifications and believe your skills and dedication will be a significant asset to our projects in Finland. This opportunity represents a gateway to a rewarding career, offering a stable environment and substantial growth prospects in one of Europe's most dynamic and innovative landscapes.`}
        </p>

        {/* Offer Body */}
        <p className="mb-6 text-justify text-slate-700 leading-relaxed">
          {content.offer_body ||
            'Finland is renowned for its high standards of living, robust economy, and commitment to worker welfare. Joining our team means becoming part of a community dedicated to excellence, safety, and mutual respect. We are confident that you will find this new chapter both professionally fulfilling and personally enriching.'}
        </p>

        {/* Position Details & Location Section */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
            <span className="w-2 h-2 rounded-sm bg-[#1E88B5]" />
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-[#0F3A5D]">
              Position Details & Designated Worksite
            </h3>
          </div>
          <p className="text-slate-700 text-justify leading-relaxed">
            {content.responsibilities ||
              `You are being offered the role of ${jobTitle}, where you will be instrumental in ongoing operations. Your primary worksite will be located within Finland, specifically tailored to projects that require skilled and dedicated individuals. Your duties encompass site preparation, execution of designated trade tasks, and rigorous adherence to occupational safety standards.`}
          </p>
        </div>

        {/* Key Contract Summary Grid / Table */}
        <div className="mb-6 rounded-lg border border-[#BAE6FD] overflow-hidden shadow-sm">
          <div className="bg-[#F0F9FF] px-4 py-2 border-b border-[#BAE6FD] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0369A1]">
              Contract & Employment Specifications
            </span>
            <span className="text-[10px] text-slate-500 font-mono">REG-SEC-2026</span>
          </div>
          <table className="w-full text-left text-xs divide-y divide-[#E0F2FE]">
            <tbody className="divide-y divide-[#E0F2FE]">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60 w-1/3">
                  Designated Position
                </td>
                <td className="py-2.5 px-4 font-bold text-slate-900">{jobTitle}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">
                  Work Location
                </td>
                <td className="py-2.5 px-4 text-slate-800">
                  {content.work_location || 'Finland Project Sites (Tampere / Helsinki Region)'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50/60">
                  Contract & Visa Validity
                </td>
                <td className="py-2.5 px-4 font-semibold text-[#0369A1]">
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
                  Accommodation & Sustenance
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
            <span className="w-2 h-2 rounded-sm bg-[#1E88B5]" />
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-[#0F3A5D]">
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
              <span className="font-bold text-slate-900 text-xs block">Food & Sustenance:</span>
              <span className="text-[11px] text-slate-600">
                Daily nutritional support or stipend provided to maintain optimal health.
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block">Medical Insurance:</span>
              <span className="text-[11px] text-slate-600">
                Full healthcare coverage under Finnish national health and occupational safety systems.
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block">Paid Time Off:</span>
              <span className="text-[11px] text-slate-600">
                2 (Two) weeks paid annual leave per year to recharge and explore Finland.
              </span>
            </div>
          </div>
        </div>

        {/* Acceptance and Instructions */}
        <div className="mb-8 p-3.5 rounded-md bg-[#F0F9FF] border border-[#BAE6FD]">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#0369A1] mb-1.5">
            Acceptance &amp; Next Steps
          </h3>
          <p className="text-slate-700 text-xs text-justify leading-relaxed">
            {content.acceptance_instructions ||
              'Please review this offer carefully. Should you accept this opportunity, submit your confirmation and requisite documentation through the official portal. Upon receiving your acceptance, we will immediately initiate the formal procedures for your work visa authorization and relocation arrangements.'}
          </p>
        </div>

        {/* Authentication, Signature & Official Stamp Section */}
        <div className="pt-4 border-t border-slate-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            {/* Signature Block */}
            <div className="space-y-1">
              <p className="text-slate-700 mb-1">{content.closing || 'Sincerely,'}</p>
              
              {/* Handwritten Blue Signature */}
              <div className="relative h-14 w-40">
                <img
                  src="/letter-assets/signature.png"
                  alt="Authorized Signature"
                  className="h-12 w-auto object-contain transform -rotate-1"
                />
              </div>

              <div className="w-52 border-t-2 border-slate-400 pt-1">
                <p className="font-bold text-slate-900 text-xs">
                  {content.signatory_name || 'Mikael Virtanen'}
                </p>
                <p className="text-[11px] text-slate-600">
                  {content.signatory_title || 'The Recruitment Team'}
                </p>
                <p className="text-[11px] font-semibold text-[#1E88B5]">
                  {companyName}
                </p>
                <p className="text-[10px] text-slate-400 italic">
                  Your Partner in International Employment
                </p>
              </div>
            </div>

            {/* Official Circular Stamp & Security Seal */}
            <div className="flex flex-col items-center sm:items-end">
              <div className="relative group">
                {/* Authentic circular stamp */}
                <img
                  src="/letter-assets/stamp.png"
                  alt="Official Company Seal"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain transform rotate-[-6deg] drop-shadow-sm opacity-95 transition-transform hover:scale-105"
                />
              </div>
              <div className="mt-1 text-center sm:text-right">
                <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 block">
                  Official Embossed Stamp
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Verified &amp; Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Running Footer */}
        <div className="mt-8 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
          <span>{companyName} • Confidential &amp; Binding Employment Offer</span>
          <span className="font-medium text-[#1E88B5]">{website}</span>
        </div>
      </div>
    </div>
  )
}
