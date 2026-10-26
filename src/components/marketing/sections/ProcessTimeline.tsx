import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';

interface Step {
  number: string;
  title: string;
  description: string;
  details: string;
}

const PROCESS_STEPS: Step[] = [
  {
    number: '01',
    title: 'Initial Consultation',
    description: 'A comprehensive review of your educational credentials, professional employment history, and targeted destination.',
    details: 'We clarify eligibility boundaries, identify prospective visa classifications, and set expectations regarding processing constraints.',
  },
  {
    number: '02',
    title: 'Eligibility & Pathway Review',
    description: 'Detailed analysis of country-specific requirements, employer sponsorship conditions, and quota thresholds.',
    details: 'Assessment of whether your role aligns with shortage lists (e.g., Romania shortage codes or Croatia HZZ exempt lists) or standard labor testing.',
  },
  {
    number: '03',
    title: 'Documentation Guidance',
    description: 'Systematic compilation of statutory documents, verified translations, apostilles, and police clearances.',
    details: 'Precise checklists covering notarizations, biometric photograph standards, and certified consular requirements.',
  },
  {
    number: '04',
    title: 'Application Preparation',
    description: 'Rigorous pre-submission validation of forms, portals (Enter Finland, WorkinRomania, MUP), and interview readiness.',
    details: 'Coordination of appointment bookings, consular filing schedules, and post-arrival compliance milestones.',
  },
];

export const ProcessTimeline: React.FC = () => {
  return (
    <section id="process" className="py-20 lg:py-28 bg-white border-t border-[#DAD8D3]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20">
        <div className="mb-20">
          <SectionHeading
            eyebrow="A CLEARER PATH FORWARD"
            number="03"
            heading="Understand the process. Take the next step."
            subheading="Navigating European employment authorization requires meticulous stage-by-stage execution. Here is how our advisory structured process works."
          />
        </div>

        {/* Timeline Grid (4 columns on desktop, 1 column on mobile) */}
        <div className="relative">
          {/* Horizontal Connecting Line on desktop */}
          <div
            className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[1px] bg-[#DAD8D3] z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.number}
                className="flex flex-col relative group"
              >
                {/* Step Number with visual marker */}
                <div className="flex items-baseline justify-between mb-4 border-b border-[#DAD8D3] lg:border-b-0 pb-3 lg:pb-0">
                  <span className="font-display italic text-5xl lg:text-6xl text-[#850D0D] font-bold">
                    {step.number}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#777570] font-semibold lg:hidden">
                    Step {idx + 1} of 4
                  </span>
                </div>

                {/* Desktop indicator dot */}
                <div className="hidden lg:flex items-center mb-6">
                  <div className="w-3 h-3 bg-[#850D0D] rounded-none ring-4 ring-white" />
                </div>

                <h3 className="font-heading font-semibold text-xl text-[#171717] mb-3 group-hover:text-[#850D0D] transition-colors">
                  {step.title}
                </h3>

                <p className="font-body text-sm text-[#171717] leading-relaxed mb-3">
                  {step.description}
                </p>

                <p className="font-body text-xs text-[#777570] leading-relaxed">
                  {step.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
