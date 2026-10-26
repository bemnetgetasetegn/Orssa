import React from 'react';
import { SectionNumber } from '../ui/SectionNumber';
import { Button } from '../ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 min-h-[90vh] flex items-center overflow-hidden bg-cream">
      {/* Decorative Oversized Section Number in Background */}
      <div className="absolute top-12 right-10 lg:right-1/3 z-0 pointer-events-none opacity-40">
        <SectionNumber number="01" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Mobile: Image comes first on small screens; Desktop: Left Side (55% -> 7 cols) */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center border-l-2 border-[#850D0D] pl-3 mb-6">
              <span className="uppercase tracking-widest text-xs sm:text-sm font-semibold text-[#777570]">
                EUROPEAN WORK VISA CONSULTANCY
              </span>
            </div>

            {/* H1 Heading */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[64px] xl:text-[72px] leading-[1.08] tracking-tight text-[#171717] mb-6">
              Your next chapter <br className="hidden sm:inline" />
              starts in Europe.
            </h1>

            {/* Supporting Paragraph */}
            <p className="font-body text-base sm:text-lg lg:text-xl text-[#777570] leading-relaxed max-w-xl mb-8">
              Expert advisory and structured navigational support for professionals, technical specialists, and skilled workers seeking employment authorization in Romania, Croatia, and Finland.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <Button variant="primary" size="lg" href="/contact">
                Book a Consultation
              </Button>
              <Button variant="secondary" size="lg" href="#destinations">
                Explore Destinations
              </Button>
            </div>

            {/* Trust Note */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#777570] pt-4 border-t border-[#DAD8D3]/80">
              <CheckCircle2 className="w-4 h-4 text-[#850D0D] flex-shrink-0" />
              <span className="font-medium">
                Clear guidance. Transparent processes. Informed decisions.
              </span>
            </div>
          </div>

          {/* Desktop: Right Side (45% -> 5 cols); Mobile: Order 1 (image first) */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden shadow-xl border border-[#DAD8D3]">
              <img
                src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&q=80"
                alt="Contemporary European city architecture"
                width={900}
                height={1125}
                loading="eager"
                className="w-full h-full object-cover grayscale-[15%] contrast-105 hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Overlay editorial panel */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-xs bg-[#171717]/90 backdrop-blur-md text-white p-5 border-l-2 border-[#850D0D]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#DAD8D3] mb-3">
                  Focus Territories & Labor Frameworks
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="font-heading font-bold text-sm tracking-wide">ROMANIA</span>
                    <span className="text-[10px] text-[#DAD8D3]/70 uppercase">EU Member · Dual Phase</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="font-heading font-bold text-sm tracking-wide">CROATIA</span>
                    <span className="text-[10px] text-[#DAD8D3]/70 uppercase">Schengen · Single Permit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm tracking-wide">FINLAND</span>
                    <span className="text-[10px] text-[#DAD8D3]/70 uppercase">Nordic · Enter Finland</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#DAD8D3]">
                  <span>Explore permit criteria</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#850D0D]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
