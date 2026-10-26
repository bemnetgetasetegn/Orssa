'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ArrowRight, LogIn } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { Button } from '../ui/Button';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close when path changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // Handle escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Focus close button on mount
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col bg-[#171717] text-white animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
        <Link
          href="/"
          onClick={onClose}
          className="font-heading font-bold text-lg tracking-widest uppercase text-white hover:text-white/80 transition-colors"
        >
          {SITE_CONFIG.name}
        </Link>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="p-2 text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#850D0D]"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav Content */}
      <div ref={navRef} className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
        <nav className="space-y-6">
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                onClick={onClose}
                className="block font-heading font-bold text-2xl text-white hover:text-[#850D0D] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={onClose}
                className="block font-heading font-bold text-2xl text-white hover:text-[#850D0D] transition-colors"
              >
                About Us
              </Link>
            </li>

            {/* Destinations Sub-block */}
            <li className="pt-2 pb-2 border-t border-b border-white/10">
              <span className="block text-xs uppercase tracking-widest text-[#777570] mb-3">
                Destinations
              </span>
              <ul className="space-y-3 pl-2">
                {SITE_CONFIG.destinations.map((dest) => (
                  <li key={dest.id}>
                    <Link
                      href={`/destinations/${dest.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between text-lg text-white/90 hover:text-white font-medium group"
                    >
                      <span>{dest.name}</span>
                      <ArrowRight className="w-4 h-4 text-[#777570] group-hover:text-white transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link
                href="/faq"
                onClick={onClose}
                className="block font-heading font-bold text-2xl text-white hover:text-[#850D0D] transition-colors"
              >
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={onClose}
                className="block font-heading font-bold text-2xl text-white hover:text-[#850D0D] transition-colors"
              >
                Contact
              </Link>
            </li>

            {/* Link to Recruitment Management Portal */}
            <li className="pt-2 border-t border-white/10">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-2 font-heading font-bold text-xl text-[#E50914] hover:text-white transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Portal Sign In</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom CTA */}
        <div className="pt-8 mt-6 border-t border-white/10 space-y-4">
          <Button
            variant="primary"
            size="lg"
            href="/contact"
            onClick={onClose}
            className="w-full text-center"
          >
            Book a Consultation
          </Button>
          <p className="text-xs text-[#777570] text-center">
            {SITE_CONFIG.tagline}
          </p>
        </div>
      </div>
    </div>
  );
};
