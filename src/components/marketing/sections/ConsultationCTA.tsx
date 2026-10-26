import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRight, MessageSquare } from 'lucide-react';

export interface ConsultationCTAProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const ConsultationCTA: React.FC<ConsultationCTAProps> = ({
  variant = 'light',
  className = '',
}) => {
  if (variant === 'dark') {
    return (
      <section className={`py-20 lg:py-28 bg-[#171717] text-white border-t border-white/10 ${className}`.trim()}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block uppercase tracking-widest text-xs font-semibold text-[#DAD8D3] border-b border-[#850D0D] pb-1 mb-4">
              TAKE THE FIRST STEP
            </span>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6">
              Let's talk about your next chapter.
            </h2>

            <p className="font-body text-base sm:text-lg text-[#DAD8D3]/80 leading-relaxed mb-8">
              Start with a structured, one-on-one preliminary assessment. We clarify visa criteria, employer obligations, and procedural timelines so you can plan with certainty.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button variant="primary" size="lg" href="/contact">
                Book a Consultation
              </Button>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm text-[#DAD8D3] hover:text-white uppercase tracking-wider py-3 px-6 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#850D0D]" />
                <span>Have a question first? Read FAQs</span>
              </Link>
            </div>

            <p className="text-xs text-[#777570]">
              Preliminary evaluations do not establish legal representation or guarantee visa issuance.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Light variant: Off-white background with large burgundy rectangular accent panel
  return (
    <section className={`py-20 lg:py-28 bg-[#F5F4F1] border-t border-[#DAD8D3] ${className}`.trim()}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-[#DAD8D3] overflow-hidden shadow-sm">
          {/* Burgundy Accent Side (5 cols) */}
          <div className="lg:col-span-5 bg-[#850D0D] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <span className="inline-block uppercase tracking-widest text-xs font-semibold text-white/70 mb-4">
                PROFESSIONAL ADVISORY
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-4">
                Structured. Compliant. Direct.
              </h3>
              <p className="text-sm text-white/85 leading-relaxed">
                Whether you have an existing employment offer in Romania or Croatia, or are evaluating technical pathways in Finland, we help you prepare accurate documentation from day one.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 text-xs text-white/70">
              Personalized evaluation across verified EU legal frameworks.
            </div>
          </div>

          {/* Light Side (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="uppercase tracking-widest text-xs font-semibold text-[#850D0D] mb-3">
              CONSULTATION INTAKE
            </span>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#171717] mb-4">
              Let's talk about your next chapter.
            </h2>

            <p className="font-body text-base text-[#777570] leading-relaxed mb-8">
              Start with a conversation about your professional goals. We outline clear timelines, necessary documentation, and regulatory requirements before you commit resources.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button variant="primary" size="lg" href="/contact">
                Book a Consultation
              </Button>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-[#171717] hover:text-[#850D0D] font-medium tracking-wide transition-colors py-2"
              >
                <span>Have a question first? Contact our team</span>
                <ArrowRight className="w-4 h-4 text-[#850D0D]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
