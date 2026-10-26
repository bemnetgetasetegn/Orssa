'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#171717] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Wordmark & Brand Narrative */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading font-bold text-xl tracking-wider text-white uppercase block">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[11px] tracking-widest uppercase text-[#777570]">
                European Work Visa Consultancy
              </span>
            </Link>
            <p className="text-sm text-[#DAD8D3]/80 leading-relaxed max-w-sm">
              Providing clear, structured guidance for professionals and skilled workers navigating employment pathways in Romania, Croatia, and Finland.
            </p>
            <p className="text-xs text-[#777570] italic">
              Non-legal advisory and process guidance.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="font-heading font-semibold text-xs uppercase tracking-widest text-white/50 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-[#DAD8D3] hover:text-white transition-colors"
                >
                  Home Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#DAD8D3] hover:text-white transition-colors"
                >
                  About Our Practice
                </Link>
              </li>
              <li>
                <Link
                  href="/#process"
                  className="text-[#DAD8D3] hover:text-white transition-colors"
                >
                  Four-Step Process
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[#DAD8D3] hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#DAD8D3] hover:text-white transition-colors"
                >
                  Book a Consultation
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10">
                <Link
                  href="/login"
                  className="text-[#E50914] hover:text-white transition-colors font-medium flex items-center gap-1"
                >
                  <span>Candidate & Staff Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Destinations */}
          <div>
            <h3 className="font-heading font-semibold text-xs uppercase tracking-widest text-white/50 mb-4">
              Key Destinations
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SITE_CONFIG.destinations.map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="group inline-flex items-center gap-1.5 text-[#DAD8D3] hover:text-white transition-colors"
                  >
                    <span>{dest.name} Pathway</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#777570] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Placeholder Information */}
          <div>
            <h3 className="font-heading font-semibold text-xs uppercase tracking-widest text-white/50 mb-4">
              Contact & Advisory
            </h3>
            <ul className="space-y-3 text-sm text-[#DAD8D3]">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#850D0D] flex-shrink-0 mt-0.5" />
                <span className="text-xs break-all text-[#DAD8D3]">
                  {SITE_CONFIG.contact.email}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#850D0D] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#DAD8D3]/80">
                  {SITE_CONFIG.contact.phone}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#850D0D] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#DAD8D3]/80">
                  {SITE_CONFIG.contact.address}
                </span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="inline-block px-2.5 py-1 text-[11px] uppercase tracking-wider bg-white/5 text-[#DAD8D3] border border-white/10">
                Official Inquiries Only
              </span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="py-8 border-b border-white/10 text-xs text-[#777570] leading-relaxed">
          <p className="font-medium text-[#DAD8D3] mb-1">
            General Informational Disclaimer
          </p>
          <p>{SITE_CONFIG.disclaimer}</p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777570]">
          <p>
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Terms of Guidance
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Regulatory Information
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
