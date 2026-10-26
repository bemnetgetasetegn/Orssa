'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, LogIn } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { Button } from '../ui/Button';
import { MobileNav } from './MobileNav';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDestDropdownOpen(false);
  }, [pathname]);

  const isDestinationsActive = pathname?.startsWith('/destinations');

  return (
    <>
      {/* Skip to Main Content Link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#850D0D] focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#DAD8D3] shadow-sm py-3.5'
            : 'bg-cream/90 backdrop-blur-sm border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#850D0D]"
          >
            <span className="font-heading font-bold text-lg sm:text-xl tracking-wider text-[#171717] group-hover:text-[#850D0D] transition-colors uppercase">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#777570] -mt-0.5">
              Work Visa Guidance
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <Link
              href="/"
              className={`transition-colors py-1 relative ${
                pathname === '/'
                  ? 'text-[#850D0D] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#850D0D]'
                  : 'text-[#171717] hover:text-[#850D0D]'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`transition-colors py-1 relative ${
                pathname === '/about'
                  ? 'text-[#850D0D] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#850D0D]'
                  : 'text-[#171717] hover:text-[#850D0D]'
              }`}
            >
              About
            </Link>

            {/* Destinations Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDestDropdownOpen(!isDestDropdownOpen)}
                onMouseEnter={() => setIsDestDropdownOpen(true)}
                aria-expanded={isDestDropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#850D0D] ${
                  isDestinationsActive
                    ? 'text-[#850D0D] font-semibold'
                    : 'text-[#171717] hover:text-[#850D0D]'
                }`}
              >
                <span>Destinations</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDestDropdownOpen ? 'rotate-180 text-[#850D0D]' : 'text-[#777570]'
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isDestDropdownOpen && (
                <div
                  onMouseLeave={() => setIsDestDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-64 bg-white border border-[#DAD8D3] shadow-lg py-2 z-50 animate-in fade-in duration-150"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-[#DAD8D3]/50 text-[11px] font-semibold uppercase tracking-wider text-[#777570]">
                    Select Destination
                  </div>
                  {SITE_CONFIG.destinations.map((dest) => (
                    <Link
                      key={dest.id}
                      href={`/destinations/${dest.slug}`}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm text-[#171717] hover:bg-[#F5F4F1] hover:text-[#850D0D] transition-colors"
                      onClick={() => setIsDestDropdownOpen(false)}
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>{dest.name}</span>
                        <span className="text-[10px] text-[#777570] font-normal border border-[#DAD8D3] px-1 py-0.2">
                          {dest.code}
                        </span>
                      </div>
                      <p className="text-xs text-[#777570] truncate mt-0.5">
                        {dest.tagline}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#process"
              onClick={() => {
                const el = document.getElementById('process');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#171717] hover:text-[#850D0D] transition-colors py-1"
            >
              Our Process
            </Link>

            <Link
              href="/faq"
              className={`transition-colors py-1 relative ${
                pathname === '/faq'
                  ? 'text-[#850D0D] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#850D0D]'
                  : 'text-[#171717] hover:text-[#850D0D]'
              }`}
            >
              FAQ
            </Link>

            <Link
              href="/contact"
              className={`transition-colors py-1 relative ${
                pathname === '/contact'
                  ? 'text-[#850D0D] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#850D0D]'
                  : 'text-[#171717] hover:text-[#850D0D]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 border border-[#850D0D] text-[#850D0D] hover:bg-[#850D0D] hover:text-white uppercase tracking-wider text-xs font-semibold transition-colors duration-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Portal Sign In</span>
            </Link>

            <div className="hidden sm:block">
              <Button variant="primary" size="sm" href="/contact">
                Book a Consultation
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 text-[#171717] hover:text-[#850D0D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#850D0D]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Nav */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
};
