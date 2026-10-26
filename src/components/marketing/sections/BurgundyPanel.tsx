import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';

const VALUE_PROPOSITIONS = [
  {
    number: '01',
    title: 'Clear Communication',
    description:
      'Immigration jargon and complex bureaucratic procedures translated into plain, actionable advice at every juncture.',
  },
  {
    number: '02',
    title: 'Destination-Specific Guidance',
    description:
      'Dedicated focus on Romania, Croatia, and Finland ensures deep, updated knowledge of respective national ministries and labor agencies.',
  },
  {
    number: '03',
    title: 'Transparent Expectations',
    description:
      'Honest assessments of documentation prerequisites, processing queues, and realistic timelines with zero misleading guarantees.',
  },
  {
    number: '04',
    title: 'A Personal Approach',
    description:
      'Direct, individualized roadmap tailored to your specific professional discipline, qualification history, and family status.',
  },
];

export const BurgundyPanel: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#850D0D] text-[#F5F4F1] relative overflow-hidden">
      {/* Background Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 relative z-10">
        <div className="mb-16">
          <SectionHeading
            eyebrow="WHY ORSA"
            number="04"
            heading="Guidance built around your next move."
            subheading="We replace regulatory uncertainty with structured clarity, providing responsible advisory built on institutional standards."
            dark={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {VALUE_PROPOSITIONS.map((prop) => (
            <div
              key={prop.number}
              className="pt-6 border-t border-white/20 flex flex-col justify-between"
            >
              <div>
                <span className="font-display italic text-3xl sm:text-4xl text-[#F5F4F1]/60 font-semibold block mb-4">
                  {prop.number}
                </span>

                <h3 className="font-heading font-semibold text-xl text-white mb-3">
                  {prop.title}
                </h3>

                <p className="font-body text-sm text-[#F5F4F1]/80 leading-relaxed">
                  {prop.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] uppercase tracking-widest text-white/50">
                Core Standard
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
