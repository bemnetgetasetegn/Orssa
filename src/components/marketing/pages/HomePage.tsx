'use client';

import React from 'react';
import { useDocumentTitle } from '@/utils/useDocumentTitle';
import { HeroSection } from '../sections/HeroSection';
import { DestinationGrid } from '../sections/DestinationGrid';
import { ProcessTimeline } from '../sections/ProcessTimeline';
import { BurgundyPanel } from '../sections/BurgundyPanel';
import { DestinationComparison } from '../sections/DestinationComparison';
import { ConsultationCTA } from '../sections/ConsultationCTA';

export const HomePage: React.FC = () => {
  useDocumentTitle(
    'ORSA — European Work Visa Guidance',
    'Professional guidance for individuals exploring employment and work visa pathways in Romania, Croatia, and Finland.'
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Destination Grid (Section B) */}
      <DestinationGrid showSectionHeader={true} showOversizedNumbers={true} />

      {/* 3. Process Timeline (Section C) */}
      <ProcessTimeline />

      {/* 4. Burgundy Panel (Section D - Why Choose Us) */}
      <BurgundyPanel />

      {/* 5. Destination Comparison (Section E) */}
      <DestinationComparison />

      {/* 6. Consultation CTA */}
      <ConsultationCTA variant="light" />
    </div>
  );
};
