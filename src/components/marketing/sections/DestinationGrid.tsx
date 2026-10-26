import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionNumber } from '../ui/SectionNumber';

export interface DestinationGridProps {
  showSectionHeader?: boolean;
  showOversizedNumbers?: boolean;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  showSectionHeader = true,
  showOversizedNumbers = true,
}) => {
  return (
    <section id="destinations" className="py-20 lg:py-28 bg-[#F5F4F1] border-t border-[#DAD8D3]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20">
        {showSectionHeader && (
          <div className="mb-16">
            <SectionHeading
              eyebrow="EXPLORE YOUR OPTIONS"
              number="02"
              heading="Three destinations. New possibilities."
              subheading="Each jurisdiction maintains distinct legal frameworks, employer qualification quotas, and labor market prerequisites. Understand where your profile aligns best."
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          {SITE_CONFIG.destinations.map((dest, idx) => {
            const cardHeightVariants = ['lg:mt-0', 'lg:mt-8', 'lg:mt-4'];
            const stepNumberStr = `0${idx + 1}`;

            return (
              <div
                key={dest.id}
                className={`group flex flex-col bg-white border border-[#DAD8D3] hover:border-[#850D0D]/50 transition-all duration-300 ${cardHeightVariants[idx]}`}
              >
                {/* Image Container with Oversized Number */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE8E3]">
                  {showOversizedNumbers && (
                    <div className="absolute top-2 left-4 z-10 pointer-events-none drop-shadow-sm">
                      <SectionNumber
                        number={stepNumberStr}
                        className="text-white/80 !text-[80px] lg:!text-[100px]"
                      />
                    </div>
                  )}

                  <img
                    src={dest.image}
                    alt={`${dest.name} architectural view`}
                    width={700}
                    height={525}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <div className="absolute bottom-3 right-3 bg-[#171717]/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white tracking-widest uppercase">
                    {dest.code}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-[#171717] group-hover:text-[#850D0D] transition-colors mb-2">
                      {dest.name}
                    </h3>

                    <p className="font-body text-xs font-semibold uppercase tracking-wider text-[#850D0D] mb-3">
                      {dest.tagline}
                    </p>

                    <p className="font-body text-sm text-[#777570] leading-relaxed mb-6">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#DAD8D3]/70">
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-[#171717] group-hover:text-[#850D0D] transition-colors"
                    >
                      <span>Discover {dest.name}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-[#850D0D]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
