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

export const FinlandPage: React.FC = () => {
  useDocumentTitle(
    'Work Visa Guidance — Finland | ORSA',
    'Understand the Residence Permit for an Employed Person in Finland. Learn about Enter Finland electronic applications, statutory wage thresholds, and Migri requirements.'
  );

  const finlandSteps = [
    {
      step: '01',
      title: 'Employment Contract & Terms',
      description:
        'A formal, signed employment contract or binding job offer meeting Finnish collective agreement terms and statutory income requirements (minimum gross €1,600/month threshold).',
    },
    {
      step: '02',
      title: 'Online Application via Enter Finland',
      description:
        'The applicant creates a user account on the official Enter Finland portal (enterfinland.fi), completes the application for an Employed Person (TTOL) or Specialist, and uploads required documents.',
    },
    {
      step: '03',
      title: 'Employer Submission in Employer’s Enter Finland',
      description:
        'The Finnish employer logs into Employer’s Enter Finland to fill in the statutory terms of employment, insurance details, and salary declarations.',
    },
    {
      step: '04',
      title: 'In-Person Identity Verification (Consulate or Migri)',
      description:
        'The applicant visits a Finnish embassy, consulate, or VFS Global application centre abroad (or Migri service point in Finland) to verify passport originality and provide biometrics.',
    },
    {
      step: '05',
      title: 'Two-Stage Decision & Biometric Card Delivery',
      description:
        'The Employment and Economic Development Office (TE Office) performs labor market evaluation, followed by Migri’s final residence decision and delivery of the physical residence permit card.',
    },
  ];

  const finlandFAQs = [
    {
      question: 'What is the minimum statutory income threshold for an Employed Person in Finland?',
      answer:
        'As of recent legislative updates (effective 2025), a statutory minimum income threshold of at least €1,600 gross per month applies to the Residence Permit for an Employed Person (unless a sector-wide collective bargaining agreement specifies higher minimum pay). Always verify the current exact euro threshold on migri.fi.',
    },
    {
      question: 'What is the difference between a general Employed Person permit and a Specialist permit?',
      answer:
        'Specialists (such as senior software engineers, researchers, and management consultants holding higher academic degrees) can apply for the Specialist Residence Permit. This route is exempt from TE Office labor market testing and qualifies for the expedited 14-day Fast Track process, provided the salary meets the higher specialist threshold (currently exceeding €3,638 gross/month in 2025).',
    },
    {
      question: 'What protections exist under Finnish law if my employment ceases?',
      answer:
        'Recent Finnish regulations grant a statutory 3-month protection period (or up to 6 months for specialists and those who have resided for longer durations) during which a foreign worker can remain legally in Finland to seek a new qualifying employment contract without immediate permit cancellation.',
    },
    {
      question: 'Do EU/EEA or Nordic citizens require a residence permit to work in Finland?',
      answer:
        'No. Citizens of EU/EEA member states and Nordic countries enjoy complete freedom of movement. They do not need a residence permit or visa; they simply register their right of residence with Migri or the Digital and Population Data Services Agency (DVV) if residing longer than three months.',
    },
    {
      question: 'How long does electronic application processing via Enter Finland take?',
      answer:
        'Electronic processing through enterfinland.fi typically ranges from 1 to 3 months for standard employed persons, compared to faster processing (under 2 weeks) for the specialist route. Electronic filing is significantly faster and less costly than paper applications.',
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
              { label: 'Finland' },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border-l-2 border-[#850D0D] pl-3 mb-4">
                <span className="uppercase tracking-widest text-xs font-semibold text-[#777570]">
                  DESTINATION PROFILE · EU, SCHENGEN & NORDIC MEMBER (FI)
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#171717] tracking-tight leading-[1.15] mb-6">
                Exploring employment opportunities in Finland
              </h1>
              <p className="font-body text-base sm:text-lg text-[#777570] leading-relaxed">
                Known for workplace equality, high living standards, and advanced digital administration, Finland maintains a streamlined electronic residence permit framework for qualified workers, engineers, and technical talent.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden border border-[#DAD8D3] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1518982380512-5a3c6ade4561?w=1200&q=80"
                  alt="Finnish architectural landscape and modern Nordic surroundings"
                  width={1200}
                  height={900}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#171717]/85 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                  FI · Enter Finland / Migri
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Overview Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
                REGULATORY OVERVIEW
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] leading-snug">
                Electronic immigration administration through Migri
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[#777570] leading-relaxed font-body">
              <p>
                Finland operates under the <strong>Finnish Aliens Act (Ulkomaalaislaki)</strong>, administered by the <strong>Finnish Immigration Service (Maahanmuuttovirasto — Migri)</strong> under the Ministry of the Interior.
              </p>
              <p>
                Almost all applications are handled digitally through <strong>Enter Finland (enterfinland.fi)</strong>. The system facilitates parallel processing: the applicant submits biographical details and job offer data, while the employer submits statutory compensation and collective agreement confirmations through <em>Employer's Enter Finland</em>.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Work Authorization Section */}
      <section className="py-16 sm:py-20 bg-[#F5F4F1] border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              RESIDENCE PERMIT TYPES
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              Standard routes for international employees in Finland
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Third-country nationals generally qualify under one of two primary employment routes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white border border-[#DAD8D3] p-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#DAD8D3] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#850D0D]">
                  Standard Route (TTOL)
                </span>
                <span className="text-xs text-[#777570]">Two-Stage Assessment</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#171717] mb-3">
                Residence Permit for an Employed Person (TTOL)
              </h3>
              <p className="text-xs sm:text-sm text-[#777570] leading-relaxed mb-4">
                The core pathway for skilled workers, technical trades, and general employment. Involves a preliminary assessment by the Employment and Economic Development Office (TE Office) concerning labor availability and collective terms, followed by Migri’s final decision.
              </p>
              <div className="text-[11px] text-[#171717] bg-[#F5F4F1] p-3 border-l-2 border-[#850D0D]">
                Statutory Wage Threshold: At least €1,600 gross/month (effective 2025; verify at migri.fi).
              </div>
            </div>

            <div className="bg-white border border-[#DAD8D3] p-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#DAD8D3] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#850D0D]">
                  Specialist & Fast Track
                </span>
                <span className="text-xs text-[#777570]">Exempt from TE Office</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#171717] mb-3">
                Specialist Permit & EU Blue Card
              </h3>
              <p className="text-xs sm:text-sm text-[#777570] leading-relaxed mb-4">
                Designed for highly educated technical professionals, software developers, and executive leaders. Bypasses labor market availability tests completely and qualifies for the national 14-day Fast Track service, including expedited residence cards for accompanying family members.
              </p>
              <div className="text-[11px] text-[#171717] bg-[#F5F4F1] p-3 border-l-2 border-[#850D0D]">
                Higher Income Threshold: Meets specialist gross salary criteria (approx. €3,638+/month).
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#DAD8D3] flex items-start gap-3 text-xs text-[#777570]">
            <AlertTriangle className="w-4 h-4 text-[#850D0D] flex-shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> Finnish residence permit requirements vary by occupation, nationality, and circumstances. Statutory salary minimums are updated periodically. Always verify current criteria directly at migri.fi.
            </p>
          </div>
        </Container>
      </section>

      {/* 4. Document Prerequisites */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              DOCUMENTARY EVIDENCE
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              General document categories (examples)
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Standard supporting documentation for electronic filing via Enter Finland:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Valid National Passport
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Color scans of personal data pages and all stamped pages; original presented during biometric appointment.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Signed Employment Agreement
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Contract outlining primary duties, regular working hours, gross wage, and applicable collective labor agreement.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Employer TEM054 Supplement
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Statutory terms of employment submitted electronically by the Finnish employer through Employer’s Enter Finland.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Professional Credentials & Degrees
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Certificates, educational diplomas, and curriculum vitae translated into Finnish, Swedish, or English.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Regulated Profession Licensure
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                If practicing a regulated profession (such as healthcare), official decision from Valvira or OPH.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Passport Photo Code
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Electronic photograph retrieval code from an accredited Finnish photo shop or photo taken at consulate.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#777570] italic">
            Document requirements depend on individual circumstances, occupational category, and applicant nationality.
          </p>
        </Container>
      </section>

      {/* 5. Step-by-Step General Process */}
      <section className="py-16 sm:py-20 bg-[#F5F4F1] border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              APPLICATION SEQUENCE
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              Step-by-step general process in Finland
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Standard procedure from contract signature to biometric card collection:
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            {finlandSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white border border-[#DAD8D3] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-6"
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
        </Container>
      </section>

      {/* 6. Official Sources & FAQs */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* FAQs */}
            <div className="lg:col-span-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
                FREQUENTLY ASKED
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-6">
                Finland-specific questions
              </h2>

              <FAQAccordion items={finlandFAQs} allowMultiple={true} />
            </div>

            {/* Official Sources */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
                  VERIFIED DIRECTORIES
                </span>
                <h3 className="font-heading font-bold text-xl text-[#171717] mb-4">
                  Official Finnish Authorities
                </h3>
                <p className="text-xs text-[#777570] leading-relaxed mb-6">
                  Verify current income limits, application fees, and processing queues directly on official Finnish state portals.
                </p>
              </div>

              <OfficialSourceLink
                country="Finland"
                name="Finnish Immigration Service (Migri)"
                url="https://migri.fi"
                description="Central immigration authority under the Ministry of the Interior responsible for residence permits."
              />

              <OfficialSourceLink
                country="Finland"
                name="Enter Finland Online Service"
                url="https://enterfinland.fi"
                description="Official e-service portal for electronic residence permit submissions and employer supplements."
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
