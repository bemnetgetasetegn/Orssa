'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F4F1] text-[#171717] font-body selection:bg-[#850D0D] selection:text-white">
      <Header />
      <main id="main-content" className="flex-grow focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
