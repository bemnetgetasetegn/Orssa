import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { SectionHeading } from '../ui/SectionHeading';
import { OfficialSourceLink } from '../ui/OfficialSourceLink';

export const DestinationComparison: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#F5F4F1] border-t border-[#DAD8D3]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20">
        <div className="mb-16">
          <SectionHeading
            eyebrow="COMPARATIVE FRAMEWORK"
            number="05"
            heading="Which destination fits your plans?"
            subheading="Side-by-side overview of regulatory models, immigration authorities, and administrative structures across our three primary jurisdictions."
          />
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[780px] grid grid-cols-3 gap-6 lg:gap-8">
            {SITE_CONFIG.destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white border border-[#DAD8D3] p-6 lg:p-8 flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#DAD8D3] mb-6">
                    <div>
                      <span className="inline-block px-2 py-0.5 text-xs font-bold tracking-wider bg-[#850D0D] text-white uppercase mb-2">
                        {dest.code}
                      </span>
                      <h3 className="font-heading font-bold text-2xl text-[#171717]">
                        {dest.name}
                      </h3>
                    </div>
                  </div>

                  {/* Feature Rows */}
                  <div className="space-y-6 text-sm">
                    {/* Row 1: Legal Status */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777570] mb-1">
                        Schengen & European Status
                      </h4>
                      <p className="text-[#171717] font-medium">
                        {dest.id === 'romania' && 'EU Member State (Air & Sea Schengen member)'}
                        {dest.id === 'croatia' && 'Full EU & Schengen Zone Member'}
                        {dest.id === 'finland' && 'EU, Schengen & Nordic Council Member'}
                      </p>
                    </div>

                    {/* Row 2: Work Auth Type */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777570] mb-1">
                        Work Authorization Model
                      </h4>
                      <p className="text-[#171717] leading-relaxed">
                        {dest.workAuth}
                      </p>
                    </div>

                    {/* Row 3: Key Considerations */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777570] mb-1">
                        Key Administrative Conditions
                      </h4>
                      <p className="text-[#777570] text-xs leading-relaxed">
                        {dest.keyConsiderations}
                      </p>
                    </div>

                    {/* Official Authority Block */}
                    <div className="pt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777570] mb-2">
                        Primary Regulatory Body
                      </h4>
                      {dest.officialSources[0] && (
                        <OfficialSourceLink
                          country={dest.name}
                          name={dest.officialSources[0].name}
                          url={dest.officialSources[0].url}
                          description={dest.officialSources[0].description}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-8 pt-6 border-t border-[#DAD8D3]">
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="inline-flex items-center justify-between w-full py-3 px-4 bg-[#F5F4F1] hover:bg-[#850D0D] text-[#171717] hover:text-white font-medium text-xs uppercase tracking-wider transition-colors duration-200"
                  >
                    <span>View {dest.name} Guidelines</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
