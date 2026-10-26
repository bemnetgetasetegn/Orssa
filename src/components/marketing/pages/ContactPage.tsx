'use client';

import React from 'react';
import { useDocumentTitle } from '@/utils/useDocumentTitle';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Container } from '../ui/Container';
import { ContactForm } from '../sections/ContactForm';
import { Disclaimer } from '../ui/Disclaimer';
import { SITE_CONFIG } from '@/config/site';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  useDocumentTitle(
    'Book a Consultation | ORSA',
    'Submit an inquiry for European work visa guidance in Romania, Croatia, or Finland. Initial evaluation and process clarification.'
  );

  return (
    <div className="pt-24 lg:pt-28 pb-20 bg-cream">
      <Container>
        <Breadcrumbs items={[{ label: 'Book a Consultation' }]} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (50% -> 6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center border-l-2 border-[#850D0D] pl-3 mb-4">
                <span className="uppercase tracking-widest text-xs font-semibold text-[#777570]">
                  INITIAL INTAKE & ADVISORY
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#171717] tracking-tight leading-tight mb-4">
                Let's discuss your next chapter.
              </h1>
              <p className="font-body text-base text-[#777570] leading-relaxed">
                Connect directly with our advisory specialists. Whether you need clarification on Romania's D/AM permit, Croatia's Single Permit labor test exemptions, or Finland's Enter Finland employer certifications, we are here to support your pathway.
              </p>
            </div>

            {/* Workplace Image Feature */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#DAD8D3] shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80"
                alt="Modern corporate workspace"
                width={1200}
                height={675}
                loading="eager"
                className="w-full h-full object-cover grayscale-[10%]"
              />
            </div>

            {/* Contact Information Blocks */}
            <div className="bg-white border border-[#DAD8D3] p-6 sm:p-8 space-y-6">
              <h2 className="font-heading font-bold text-lg text-[#171717] pb-3 border-b border-[#DAD8D3]">
                Direct Advisory Channels
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#F5F4F1] border border-[#DAD8D3] text-[#850D0D] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider font-semibold text-[#777570]">
                      Advisory Desk Email
                    </span>
                    <span className="font-medium text-sm text-[#171717] break-all">
                      {SITE_CONFIG.contact.email}{' '}
                      <span className="text-[10px] text-[#777570] uppercase bg-[#EAE8E3] px-1.5 py-0.5 ml-1">
                        Placeholder
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#F5F4F1] border border-[#DAD8D3] text-[#850D0D] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider font-semibold text-[#777570]">
                      Direct Telephone
                    </span>
                    <span className="font-medium text-sm text-[#171717]">
                      {SITE_CONFIG.contact.phone}{' '}
                      <span className="text-[10px] text-[#777570] uppercase bg-[#EAE8E3] px-1.5 py-0.5 ml-1">
                        Placeholder
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#F5F4F1] border border-[#DAD8D3] text-[#850D0D] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider font-semibold text-[#777570]">
                      Registered Consultancy Address
                    </span>
                    <span className="font-medium text-sm text-[#171717]">
                      {SITE_CONFIG.contact.address}{' '}
                      <span className="text-[10px] text-[#777570] uppercase bg-[#EAE8E3] px-1.5 py-0.5 ml-1">
                        Placeholder
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#F5F4F1] border border-[#DAD8D3] text-[#850D0D] flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider font-semibold text-[#777570]">
                      Working Hours & Intake Times
                    </span>
                    <span className="font-medium text-sm text-[#171717]">
                      Monday – Friday: 09:00 – 18:00 CET
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory Disclaimer */}
            <Disclaimer condensed={true} />
          </div>

          {/* Right Column (50% -> 6 cols): Contact Form */}
          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
};
