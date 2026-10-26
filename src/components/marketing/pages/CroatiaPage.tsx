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

export const CroatiaPage: React.FC = () => {
  useDocumentTitle(
    'Work Visa Guidance — Croatia | ORSA',
    'Understand the Single Permit and work authorization framework for Croatia. Learn about HZZ labor market tests, shortage occupations, and official MUP sources.'
  );

  const croatiaSteps = [
    {
      step: '01',
      title: 'Labor Market Test via HZZ (Test tržišta rada)',
      description:
        'The Croatian employer requests a labor market test from the Croatian Employment Service (HZZ) to determine if domestic or EU jobseekers can fill the vacancy, unless the position is on the designated shortage list.',
    },
    {
      step: '02',
      title: 'Single Permit Application to MUP (Jedinstvena dozvola)',
      description:
        'Upon positive opinion from HZZ (or if exempt by shortage list), the employer or foreign applicant submits the Single Residence and Work Permit application to the competent Police Administration (MUP).',
    },
    {
      step: '03',
      title: 'Inter-Agency Clearance & Security Checks',
      description:
        'The Ministry of the Interior (MUP) verifies criminal records, public order clearances, tax standing of the employer, and issues the official permit decision.',
    },
    {
      step: '04',
      title: 'Entry Visa (Type D) if Applicable',
      description:
        'If the applicant’s nationality requires an entry visa to enter the Schengen Area, they apply for a Long-Stay Type D Visa at the Croatian diplomatic mission abroad, presenting the MUP permit approval.',
    },
    {
      step: '05',
      title: 'Biometrics & Residence Card Issuance',
      description:
        'Upon arrival in Croatia, the applicant registers address at the local police station (MUP) within 3 days, provides biometric fingerprints, and receives their physical biometric residence card (boravišna iskaznica).',
    },
  ];

  const croatiaFAQs = [
    {
      question: 'What is the "Single Permit" (Jedinstvena dozvola za boravak i rad)?',
      answer:
        'The Single Permit is an integrated administrative decision issued by the Croatian Ministry of the Interior (MUP) that simultaneously grants both legal residency and authorization to work for a specific designated employer in Croatia.',
    },
    {
      question: 'What happens if my occupation is on the HZZ Shortage List?',
      answer:
        'If an occupation is formally listed on the Croatian Employment Service (HZZ) Shortage List (deficitarne profesije)—which commonly includes specific construction trades, hospitality specialists, and medical personnel—the employer is legally exempt from conducting the labor market test, speeding up the submission.',
    },
    {
      question: 'How long can a Croatian Single Permit be issued for?',
      answer:
        'Under Croatian Foreigners Act amendments, Single Permits can be granted for up to 3 years depending on the duration of the employment contract, with renewals allowed subject to continued lawful employment.',
    },
    {
      question: 'What protections exist if my employment ends unexpectedly?',
      answer:
        'Croatian legislation provides a statutory transition window (grace period) allowing foreign workers who lose their employment through no fault of their own a defined period (typically up to 60 days) to register with HZZ and seek new qualifying employment without immediate permit revocation.',
    },
    {
      question: 'Do EU/EEA citizens require a Single Permit to work in Croatia?',
      answer:
        'No. As an EU and Schengen Member State, Croatia accords full freedom of movement to EU/EEA and Swiss citizens. They may work without work permits and simply submit a standard temporary residence registration certificate with the police station after 90 days.',
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
              { label: 'Croatia' },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border-l-2 border-[#850D0D] pl-3 mb-4">
                <span className="uppercase tracking-widest text-xs font-semibold text-[#777570]">
                  DESTINATION PROFILE · EU & SCHENGEN MEMBER (HR)
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#171717] tracking-tight leading-[1.15] mb-6">
                Exploring employment opportunities in Croatia
              </h1>
              <p className="font-body text-base sm:text-lg text-[#777570] leading-relaxed">
                As a member of the European Union and the Schengen area, Croatia employs a modernized Single Permit system uniting residence and labor rights across tourism, logistics, technical trades, and professional sectors.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden border border-[#DAD8D3] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1595450547833-95af46bcb0d5?w=1200&q=80"
                  alt="Croatian Adriatic coastline and architectural scenery"
                  width={1200}
                  height={900}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#171717]/85 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                  HR · Single Permit (MUP)
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
                Unified residency and work authorization in the Republic of Croatia
              </h2>
              <p className="text-sm sm:text-base text-[#777570] leading-relaxed font-body">
                Croatia operates under the <strong>Foreigners Act (Zakon o strancima)</strong>, establishing the <strong>Single Permit (Jedinstvena dozvola za boravak i rad)</strong> as the primary pathway for third-country nationals.
              </p>
              <p className="text-sm sm:text-base text-[#777570] leading-relaxed font-body">
                The procedure relies on formal collaboration between two government bodies: the <strong>Ministry of the Interior (Ministarstvo unutarnjih poslova — MUP)</strong>, which governs residency and biometric credentials, and the <strong>Croatian Employment Service (Hrvatski zavod za zapošljavanje — HZZ)</strong>, which assesses labor market dynamics.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] overflow-hidden border border-[#DAD8D3] shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80"
                  alt="Zagreb city architecture and corporate avenues"
                  width={900}
                  height={562}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 bg-[#171717]/85 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Zagreb Metropolitan Commercial District
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2b. Economic Hubs & Work Environments in Croatia */}
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
              Employment opportunities for international workers in Croatia span central commercial centers, deep-water logistics ports, and the Adriatic construction and tourism corridors:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#DAD8D3] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE8E3]">
                <img
                  src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=700&q=80"
                  alt="Zagreb financial and administrative headquarters"
                  width={700}
                  height={525}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Zagreb Region
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-[#171717] mb-2">
                  IT, Commerce & Corporate
                </h3>
                <p className="font-body text-xs text-[#777570] leading-relaxed">
                  Croatia’s financial and administrative engine, offering extensive career pathways in software engineering, telecommunications, financial services, and regional HQ operations.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#DAD8D3] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE8E3]">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80"
                  alt="Rijeka deep water port and maritime freight facility"
                  width={700}
                  height={525}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Rijeka & Kvarner Port
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-[#171717] mb-2">
                  Maritime Logistics & Freight
                </h3>
                <p className="font-body text-xs text-[#777570] leading-relaxed">
                  Northern Adriatic transportation hub with constant operational demand across international freight forwarding, shipping logistics, warehouse coordination, and heavy civil works.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#DAD8D3] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE8E3]">
                <img
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=700&q=80"
                  alt="Split and Dubrovnik coastal development and architecture"
                  width={700}
                  height={525}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Split, Zadar & Dubrovnik
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-[#171717] mb-2">
                  Hospitality, Marine & Trades
                </h3>
                <p className="font-body text-xs text-[#777570] leading-relaxed">
                  World-renowned coastal corridor characterized by high seasonal and year-round quotas in hotel management, yacht maintenance, specialty construction, and food services.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Work Authorization Section */}
      <section className="py-16 sm:py-20 bg-[#F5F4F1] border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              AUTHORIZATION MECHANISM
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              Single Permit criteria and compliance requirements
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Employers and candidates must satisfy defined statutory conditions under Croatian administrative law:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white border border-[#DAD8D3] p-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#DAD8D3] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#850D0D]">
                  Standard Route
                </span>
                <span className="text-xs text-[#777570]">Single Residence & Work Permit</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#171717] mb-3">
                Single Permit via Labor Market Test / Shortage List
              </h3>
              <p className="text-xs sm:text-sm text-[#777570] leading-relaxed mb-4">
                The hiring company must be actively registered, demonstrate economic activity, and have no outstanding tax or social security arrears. If the position is not on the HZZ shortage list, a 15-day labor market test must confirm no qualified domestic worker is available.
              </p>
              <div className="text-[11px] text-[#171717] bg-[#F5F4F1] p-3 border-l-2 border-[#850D0D]">
                Multi-year validity: Permits may be approved for up to 3 years for continuous contracts.
              </div>
            </div>

            <div className="bg-white border border-[#DAD8D3] p-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#DAD8D3] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#850D0D]">
                  Advanced Route
                </span>
                <span className="text-xs text-[#777570]">Tertiary Education</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#171717] mb-3">
                Croatian EU Blue Card for Specialized Talent
              </h3>
              <p className="text-xs sm:text-sm text-[#777570] leading-relaxed mb-4">
                Designed for highly qualified professionals possessing higher education diplomas (equivalent to EQF Level 6 or above). The salary offered must equal or exceed 1.5 times the average gross annual salary published by the Croatian Bureau of Statistics.
              </p>
              <div className="text-[11px] text-[#171717] bg-[#F5F4F1] p-3 border-l-2 border-[#850D0D]">
                Advantage: Exemption from the standard HZZ labor market testing phase.
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#DAD8D3] flex items-start gap-3 text-xs text-[#777570]">
            <AlertTriangle className="w-4 h-4 text-[#850D0D] flex-shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> Croatian immigration rules and quotas are subject to ministerial directives. Applicants must ensure employers meet statutory compliance thresholds before submission.
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
              Typical document requirements (illustrative)
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Standard document packages required during MUP filings:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Valid Passport Copy
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Color copy of biometric passport pages with at least 3 months validity past the intended stay.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Binding Employment Contract
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Signed employment contract specifying occupational classification, working hours, and wage scale.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Criminal Record Extract
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Certified police clearance from home country, translated into Croatian by a court-certified interpreter.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Evidence of Qualifications
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Diplomas, vocational licenses, and verified CV evidencing expertise relevant to the position.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Proof of Accommodation
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                Notarized lease agreement or employer-provided housing confirmation meeting municipal living standards.
              </p>
            </div>

            <div className="p-5 border border-[#DAD8D3] bg-[#F5F4F1]">
              <FileCheck className="w-5 h-5 text-[#850D0D] mb-2" />
              <h4 className="font-heading font-semibold text-sm text-[#171717] mb-1">
                Biometric Identification Photos
              </h4>
              <p className="text-xs text-[#777570] leading-relaxed">
                ICAO-compliant biometric photographs conforming to MUP border control specifications.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#777570] italic">
            Document requirements depend on individual circumstances and the regional MUP jurisdiction handling the submission.
          </p>
        </Container>
      </section>

      {/* 5. 5-Step General Process */}
      <section className="py-16 sm:py-20 bg-[#F5F4F1] border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
              ADMINISTRATIVE TIMELINE
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#171717] mb-4">
              Step-by-step general process in Croatia
            </h2>
            <p className="text-sm text-[#777570] leading-relaxed">
              Procedural milestones from HZZ assessment to biometric ID card collection:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {croatiaSteps.map((step) => (
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
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
                    alt="Corporate legal and employment compliance team"
                    width={800}
                    height={600}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#850D0D] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                    MUP Coordination
                  </span>
                </div>
                <h4 className="font-heading font-bold text-base text-[#171717] mb-2">
                  Unified Single Permit
                </h4>
                <p className="text-xs text-[#777570] leading-relaxed mb-4">
                  The Croatian Single Permit coordinates both HZZ labor verification and MUP residence adjudication into one decision valid for up to 3 years.
                </p>
                <div className="p-3 bg-[#F5F4F1] border-l-2 border-[#850D0D] text-[11px] text-[#171717]">
                  Indicative timeframe: 6–12 weeks from employer labor test to biometric card issuance.
                </div>
              </div>
            </div>
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
                Croatia-specific questions
              </h2>

              <FAQAccordion items={croatiaFAQs} allowMultiple={true} />
            </div>

            {/* Official Sources */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#850D0D] mb-2 block">
                  VERIFIED DIRECTORIES
                </span>
                <h3 className="font-heading font-bold text-xl text-[#171717] mb-4">
                  Official Croatian Authorities
                </h3>
                <p className="text-xs text-[#777570] leading-relaxed mb-6">
                  Verify current legal regulations, shortage occupational catalogs, and consular instructions directly on official state portals.
                </p>
              </div>

              <OfficialSourceLink
                country="Croatia"
                name="Ministry of the Interior (MUP)"
                url="https://mup.gov.hr"
                description="Central ministry responsible for citizenship, border control, and residence/work permit adjudications."
              />

              <OfficialSourceLink
                country="Croatia"
                name="Croatian Employment Service (HZZ)"
                url="https://www.hzz.hr"
                description="National employment agency managing labor market test protocols and publication of shortage profession registers."
              />

              <OfficialSourceLink
                country="Croatia"
                name="Official Government Portal (GOV.HR)"
                url="https://gov.hr"
                description="Central e-government hub outlining administrative rights and legal responsibilities for foreign nationals."
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
