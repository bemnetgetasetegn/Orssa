'use client';

import React from 'react';
import { useDocumentTitle } from '@/utils/useDocumentTitle';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Container } from '../ui/Container';
import { OfficialSourceLink } from '../ui/OfficialSourceLink';
import { Disclaimer } from '../ui/Disclaimer';
import { FAQAccordion } from '../ui/FAQAccordion';
import { ConsultationCTA } from '../sections/ConsultationCTA';
import { AlertTriangle, FileCheck } from 'lucide-react';

export const RomaniaPage: React.FC = () => {
  useDocumentTitle(
    'Work Visa Guidance — Romania | ORSA',
    'Understand the general employment and work authorization process for Romania. Learn about permit types, key considerations, and official sources.'
  );

  const romaniaSteps = [
    {
      step: '01',
      title: 'Employment Offer & Labor Market Clearance',
      description:
        'The prospective Romanian employer registers a vacancy. Unless the occupation falls under statutory quota exceptions or shortage classifications, the employer secures clearance from the National Employment Agency (ANOFM).',
    },
    {
      step: '02',
      title: 'Work Authorization Application via WorkinRomania.gov.ro',
      description:
        'The Romanian employer submits the formal work notice (Aviz de Angajare) application directly through the official digital portal WorkinRomania.gov.ro to the General Inspectorate for Immigration (IGI).',
    },
    {
      step: '03',
      title: 'Long-Stay Visa Application (D/AM)',
      description:
        'Upon IGI issuance of the work authorization notice, the candidate applies for a Romanian Type D/AM long-stay visa at the competent Romanian diplomatic mission or consular post in their home country.',
    },
    {
      step: '04',
      title: 'Consular Verification & Entry',
      description:
        'After consular processing and visa endorsement, the candidate travels to Romania within the authorized validity window of the D/AM visa.',
    },
    {
      step: '05',
      title: 'Registration & Residence Card (Permis de Ședere)',
      description:
        'Within 30–60 days of arrival in Romania, the employee registers in-person at the local IGI territorial unit for biometric collection and issuance of the formal Residence Permit for Work.',
    },
  ];

  const romaniaFAQs = [
    {
      question: 'Can an individual applicant apply directly to IGI for a Romanian work authorization?',
      answer:
        'No. Under Romanian immigration legislation, the initial work authorization (Aviz de Angajare) must be initiated and petitioned by the hiring Romanian legal entity through the WorkinRomania.gov.ro portal. Once issued, the candidate uses this document to apply for their D/AM visa.',
    },
    {
      question: 'What is the distinction between D/AM1 and D/AM2 visa categories?',
      answer:
        'D/AM1 generally designates authorizations for highly qualified employees, technical specialists, and EU Blue Card applicants fulfilling specific higher-education or specialized experience thresholds. D/AM2 covers general permanent employees, skilled trade workers, and occupations subject to the annual national non-EU workforce quota.',
    },
    {
      question: 'How does the annual foreign worker quota affect applications?',
      answer:
        'The Romanian Government establishes an annual quota for newly admitted non-EU foreign workers (contingentul de lucrători străini). Applications are approved on a rolling basis until the quota is exhausted. In recent years, high demand has made early preparation critical.',
    },
    {
      question: 'Are EU/EEA citizens subject to this work authorization procedure?',
      answer:
        'No. Citizens of the European Union, European Economic Area (EEA), and Switzerland possess complete freedom of movement and the right to work in Romania without a work permit or D/AM visa. They merely register their residency certificate (Certificat de Înregistrare) with IGI if staying longer than 90 days.',
    },
    {
      question: 'How long is the initial Romanian residence permit valid?',
      answer:
        'Standard residence permits for employed workers are typically issued for one year, renewable annually provided the employment contract remains active and tax/social security contributions are compliant. EU Blue Card holders may receive multi-year permits.',
    },
  ];

  return (
    <div className="pt-24 lg:pt-28 bg-[#F5F4F1]">
      {/* 1. Breadcrumbs & Hero */}
      <section className="bg-cream pb-12 lg:pb-16 border-b border-[#DAD8D3]">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Destinations', href: '/#destinations' },
              { label: 'Romania' },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border-l-2 border-[#850D0D] pl-3 mb-4">
                <span className="uppercase tracking-widest text-xs font-semibold text-[#777570]">
                  DESTINATION PROFILE · EU MEMBER STATE (RO)
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#171717] tracking-tight leading-[1.15] mb-6">
                Exploring employment opportunities in Romania
              </h1>
              <p className="font-body text-base sm:text-lg text-[#777570] leading-relaxed">
                Romania offers an expanding industrial, technical, and logistics marketplace. Understanding the formalized dual-phase process between employer digital filings and consular visa issuance is essential for prospective workers.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden border border-[#DAD8D3] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
                  alt="Romanian architectural heritage in Bucharest"
                  width={1200}
                  height={900}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#171717]/85 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                  RO · Work Permit & D/AM
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Overview Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
                REGULATORY OVERVIEW
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] leading-snug">
                The institutional framework for labor immigration in Romania
              </h2>
              <p className="text-sm sm:text-base text-[#777570] leading-relaxed font-body">
                Romania is a full Member State of the European Union and participates in the Schengen area for air and maritime borders. Employment of third-country nationals is governed by the Romanian Ministry of Internal Affairs through the <strong>General Inspectorate for Immigration (IGI — Inspectoratul General pentru Imigrări)</strong>.
              </p>
              <p className="text-sm sm:text-base text-[#777570] leading-relaxed font-body">
                In recent years, Romania has modernized its administrative systems through the unified digital platform <strong>WorkinRomania.gov.ro</strong>. Employers submit labor requests electronically, enabling standardized validation of corporate tax compliance and quota allocation.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] overflow-hidden border border-[#DAD8D3] shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=900&q=80"
                  alt="Bucharest city center and economic avenues"
                  width={900}
                  height={562}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 bg-[#171717]/85 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Bucharest Central Business District
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2b. Economic Hubs & Work Environments in Romania */}
      <section className="py-16 sm:py-20 bg-[#F5F4F1] border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              REGIONAL PROFILE & INDUSTRY
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              Key economic hubs and employment landscapes
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Employment opportunities for international workers in Romania are heavily clustered across specialized metropolitan clusters and industrial centers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#DAD8D3] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE8E3]">
                <img
                  src="https://images.unsplash.com/photo-1562625964-ffe9b2d3c3b0?w=700&q=80"
                  alt="Bucharest financial and software development offices"
                  width={700}
                  height={525}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Bucharest & Ilfov
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-[#171717] mb-2">
                  IT, Finance & Shared Services
                </h3>
                <p className="font-body text-xs text-[#777570] leading-relaxed">
                  Romania’s capital commands over 40% of national enterprise volume, leading demand in technical engineering, fintech, multilingual support, and multinational project leadership.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#DAD8D3] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE8E3]">
                <img
                  src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=700&q=80"
                  alt="Cluj-Napoca and Transylvania technological cluster"
                  width={700}
                  height={525}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Cluj-Napoca & Timișoara
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-[#171717] mb-2">
                  Innovation & Research Corridor
                </h3>
                <p className="font-body text-xs text-[#777570] leading-relaxed">
                  Transylvania's premier tech centers feature dense university collaboration, software R&D centers, and advanced manufacturing operations requiring qualified specialists.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#DAD8D3] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE8E3]">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&q=80"
                  alt="Romanian automotive and advanced production facility"
                  width={700}
                  height={525}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Brașov, Pitești & Constanța
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-[#171717] mb-2">
                  Automotive, Logistics & Port
                </h3>
                <p className="font-body text-xs text-[#777570] leading-relaxed">
                  Major manufacturing, civil construction, Black Sea freight logistics, and component assembly corridors utilizing annual national worker quotas.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Work Authorization Categories */}
      <section className="py-16 sm:py-20 bg-[#F5F4F1] border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              PERMIT CATEGORIES & PATHWAYS
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              Understanding Romanian work authorization tracks
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Third-country nationals enter Romania under differentiated statutory authorizations depending on qualifications and occupational category:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white border border-[#DAD8D3] p-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#DAD8D3] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#850D0D]">
                  Category D/AM1 & Blue Card
                </span>
                <span className="text-xs text-[#777570]">Specialized / High Qualification</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#171717] mb-3">
                Highly Qualified Specialists & EU Blue Card
              </h3>
              <p className="text-xs sm:text-sm text-[#777570] leading-relaxed mb-4">
                Tailored for professionals holding certified tertiary education credentials (minimum 3-year bachelor degree or equivalent senior professional experience). The Romanian EU Blue Card pathway features salary thresholds set at 1.5× average national gross wage and benefits from streamlined residency renewals.
              </p>
              <div className="text-[11px] text-[#171717] bg-[#F5F4F1] p-3 border-l-2 border-[#850D0D]">
                Key requirement: Recognized degree certificates and verified employment agreement.
              </div>
            </div>

            <div className="bg-white border border-[#DAD8D3] p-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#DAD8D3] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#850D0D]">
                  Category D/AM2
                </span>
                <span className="text-xs text-[#777570]">General Labor & Shortage Roles</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#171717] mb-3">
                Employed Permanent Workers (Lucrători Permanenți)
              </h3>
              <p className="text-xs sm:text-sm text-[#777570] leading-relaxed mb-4">
                The primary pathway for industrial, manufacturing, construction, logistics, and service sector staff. The hiring Romanian firm must demonstrate employer compliance, absence of tax debts, and in eligible cases conduct labor market advertising before securing an Aviz de Angajare under the national quota.
              </p>
              <div className="text-[11px] text-[#171717] bg-[#F5F4F1] p-3 border-l-2 border-[#850D0D]">
                Key requirement: Subject to annual national quota limits set by Government decree.
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#DAD8D3] flex items-start gap-3 text-xs text-[#777570]">
            <AlertTriangle className="w-4 h-4 text-[#850D0D] flex-shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> Specific visa rules, quota allocations, and processing formalities vary according to the applicant's country of citizenship, employment contract terms, and territorial consulate jurisdiction.
            </p>
          </div>
        </Container>
      </section>

      {/* 4. Document Categories */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              DOCUMENTATION PREREQUISITES
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              General document categories (non-exhaustive)
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Every application requires rigorous documentary substantiation. The following documents are standard examples:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Valid International Passport
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Must remain valid for at least 3 months beyond the intended visa validity, with at least two blank consecutive pages.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Romanian Work Notice (Aviz)
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Original copy of the work permit notice issued by the General Inspectorate for Immigration to the employer.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Criminal Record Clearance
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Issued by authorities of the applicant’s home country, legalized or apostilled, and translated into Romanian.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Proof of Registered Accommodation
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Lease agreement or employer accommodation undertaking compliant with Romanian residential norms.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Comprehensive Travel Medical Insurance
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Covering the period of initial stay with minimum coverage value of €30,000 across EU borders.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Educational / Vocational Credentials
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Certified certificates and reference letters corroborating qualifications demanded by the specific job description.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#777570] italic">
            Document requirements depend on individual circumstances, consular posts, and professional qualifications.
          </p>
        </Container>
      </section>

      {/* 5. Step-by-Step Process */}
      <section className="py-16 sm:py-20 bg-[#F5F4F1] border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              PROCEDURAL SEQUENCE
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              Step-by-step general process in Romania
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              A standard overview of the progression from initial job offer to residency card issuance:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {romaniaSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-white border border-[#DAD8D3] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-6 hover:border-[#850D0D]/40 transition-colors"
                >
                  <div className="font-display italic text-4xl text-[#850D0D] font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-[#171717] mb-2">
                      {step.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-[#777570] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white border border-[#DAD8D3] p-6">
                <div className="relative aspect-[4/3] overflow-hidden mb-5 border border-[#DAD8D3]">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                    alt="Professional consultation and dossier review team"
                    width={800}
                    height={600}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#850D0D] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                    Dossier Compliance
                  </span>
                </div>
                <h4 className="font-heading font-bold text-base text-[#171717] mb-2">
                  Procedural Rigor Matters
                </h4>
                <p className="text-xs text-[#777570] leading-relaxed mb-4">
                  Incomplete employer filings or misaligned occupation codes in the WorkinRomania portal can cause consular delays. We review every element before submission.
                </p>
                <div className="p-3 bg-[#F5F4F1] border-l-2 border-[#850D0D] text-[11px] text-[#171717]">
                  Indicative timeframe: 2–4 months from initial employer petition to consular visa stamping.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Official Sources & Romanian FAQs */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* FAQs */}
            <div className="lg:col-span-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
                FREQUENTLY ASKED
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-6">
                Romania-specific questions
              </h2>

              <FAQAccordion items={romaniaFAQs} allowMultiple={true} />
            </div>

            {/* Official Sources */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
                  VERIFIED DIRECTORIES
                </span>
                <h3 className="font-heading font-bold text-xl text-[#171717] mb-4">
                  Official Romanian Authorities
                </h3>
                <p className="text-xs text-[#777570] leading-relaxed mb-6">
                  Verify current immigration quotas, procedural changes, and statutory fees directly on official government websites.
                </p>
              </div>

              <OfficialSourceLink
                country="Romania"
                name="Work in Romania Digital Portal"
                url="https://workinromania.gov.ro"
                description="The official platform established by the Romanian state for labor migration and employer permits."
              />

              <OfficialSourceLink
                country="Romania"
                name="Inspectoratul General pentru Imigrări (IGI)"
                url="https://igi.mai.gov.ro"
                description="Central authority under the Ministry of Internal Affairs regulating legal residency and visa permits."
              />

              {/* Information reviewed note */}
              <div className="p-4 bg-[#F5F4F1] border border-[#DAD8D3] text-[11px] text-[#777570] space-y-1">
                <p className="font-semibold text-[#171717]">Regulatory Review Notice</p>
                <p>Information reviewed: October 2025. Requirements may change. Always verify with official sources.</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Disclaimer />
          </div>
        </Container>
      </section>

      {/* 7. Bottom CTA */}
      <ConsultationCTA variant="dark" />
    </div>
  );
};
