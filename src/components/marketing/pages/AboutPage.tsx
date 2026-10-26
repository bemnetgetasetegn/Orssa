'use client';

import React from 'react';
import { useDocumentTitle } from '@/utils/useDocumentTitle';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Container } from '../ui/Container';
import { DestinationGrid } from '../sections/DestinationGrid';
import { ConsultationCTA } from '../sections/ConsultationCTA';
import { ShieldCheck, Target, Compass, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useDocumentTitle(
    'About | ORSA',
    'Learn about ORSA, our professional approach to European labor migration guidance, and our commitment to transparent advisory.'
  );

  const principles = [
    {
      title: 'Transparency',
      icon: ShieldCheck,
      description:
        'We never make unrealistic promises or guarantee visa approvals. Every advisory roadmap is based squarely on published statutory law, quota limits, and current consulate directives.',
    },
    {
      title: 'Clear Communication',
      icon: BookOpen,
      description:
        'European administrative bureaucracy can be intricate. We deconstruct statutory legalese into clear steps, structured timelines, and actionable document checklists.',
    },
    {
      title: 'Responsible Guidance',
      icon: Compass,
      description:
        'We evaluate qualifications objectively before advising candidates to initiate formal procedures. If an applicant’s background does not meet statutory requirements, we state so immediately.',
    },
    {
      title: 'Destination-Specific Information',
      icon: Target,
      description:
        'Rather than offering superficial advice across dozens of countries, we concentrate our advisory on Romania, Croatia, and Finland, ensuring authoritative domain depth.',
    },
  ];

  const workStages = [
    {
      step: '01',
      title: 'Preliminary Qualification Assessment',
      detail:
        'We evaluate employment contracts, job descriptions, educational transcripts, and national quota eligibility before any state filings occur.',
    },
    {
      step: '02',
      title: 'Document Dossier Verification',
      detail:
        'We inspect certified translations, apostilles, criminal record background checks, and official application portals to prevent administrative rejections.',
    },
    {
      step: '03',
      title: 'Procedural Advisory & Post-Arrival Roadmapping',
      detail:
        'Guidance through consular biometric interviews, entry formalities, and mandatory local municipal registrations (such as IGI or MUP appointments).',
    },
  ];

  return (
    <div className="pt-24 lg:pt-28">
      {/* 1. Page Hero */}
      <section className="bg-cream pb-12 lg:pb-16 border-b border-[#DAD8D3]">
        <Container>
          <Breadcrumbs items={[{ label: 'About Our Practice' }]} />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center border-l-2 border-[#850D0D] pl-3 mb-4">
                <span className="uppercase tracking-widest text-xs font-semibold text-[#777570]">
                  OUR MISSION & PRACTICE
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#171717] tracking-tight leading-[1.1] mb-6">
                Clear guidance for important decisions.
              </h1>
              <p className="font-body text-base sm:text-lg text-[#777570] leading-relaxed max-w-xl">
                Relocating across borders for employment represents a defining professional milestone. ORSA was founded to provide ethical, methodical, and transparent navigation for candidates entering Europe’s labor market.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden border border-[#DAD8D3] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
                  alt="ORSA modern professional workspace"
                  width={1200}
                  height={900}
                  loading="eager"
                  className="w-full h-full object-cover grayscale-[10%]"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. About Section: 2-column layout */}
      <section className="py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="uppercase tracking-widest text-xs font-semibold text-[#850D0D] mb-3 block">
                ORGANIZATIONAL ETHOS
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#171717] leading-snug">
                Demystifying European immigration pathways through structured clarity.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-[#777570] text-base leading-relaxed font-body">
              <p>
                Navigating foreign ministry regulations, digital submission portals, and consulate requirements can be overwhelming. Too often, applicants are confronted with opaque guidance, misleading timelines, or unrealistic promises from unregulated agents.
              </p>
              <p>
                At ORSA, we operate with uncompromised integrity. We do not operate as an immigration law firm or government agency; instead, we serve as specialized process navigators and advisory specialists. We assist foreign candidates and their sponsoring employers in assembling compliant dossiers, understanding labor market test criteria, and tracking submissions accurately.
              </p>
              <p>
                By maintaining specialized focus on three key European destinations—Romania, Croatia, and Finland—we ensure our knowledge reflects current labor shortage lists, quota allocations, and statutory minimum wage thresholds.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Our Approach: 4 principles */}
      <section className="py-20 bg-[#F5F4F1] border-b border-[#DAD8D3]">
        <Container>
          <div className="mb-12">
            <span className="uppercase tracking-widest text-xs font-semibold text-[#850D0D] mb-2 block">
              OUR GUIDING STANDARDS
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#171717]">
              Four pillars of our advisory practice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((principle, idx) => {
              const Icon = principle.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#DAD8D3] p-8 transition-colors duration-200 hover:border-[#850D0D]/60"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 bg-[#F5F4F1] border border-[#DAD8D3]">
                      <Icon className="w-5 h-5 text-[#850D0D]" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-[#171717]">
                      {principle.title}
                    </h3>
                  </div>
                  <p className="font-body text-sm text-[#777570] leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. How We Work: 3-step description */}
      <section className="py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="mb-14">
            <span className="uppercase tracking-widest text-xs font-semibold text-[#850D0D] mb-2 block">
              ENGAGEMENT MODEL
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#171717]">
              How we work together
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workStages.map((stage) => (
              <div
                key={stage.step}
                className="pt-6 border-t border-[#DAD8D3] relative"
              >
                <span className="font-display italic text-4xl text-[#850D0D] font-bold block mb-4">
                  {stage.step}
                </span>
                <h3 className="font-heading font-semibold text-lg text-[#171717] mb-3">
                  {stage.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#777570] leading-relaxed">
                  {stage.detail}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Our Destinations: reuse DestinationGrid without oversized numbers */}
      <DestinationGrid showSectionHeader={true} showOversizedNumbers={false} />

      {/* 6. ConsultationCTA variant='dark' */}
      <ConsultationCTA variant="dark" />
    </div>
  );
};
