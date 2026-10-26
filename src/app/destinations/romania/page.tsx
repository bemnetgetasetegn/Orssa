import { MarketingLayout } from '@/components/marketing/layout/MarketingLayout';
import { RomaniaPage } from '@/components/marketing/pages/RomaniaPage';

export const metadata = {
  title: 'Work Visa Guidance — Romania | ORSA',
  description: 'Understand the general employment and work authorization process for Romania. Learn about permit types, key considerations, and official sources.',
};

export default function Romania() {
  return (
    <MarketingLayout>
      <RomaniaPage />
    </MarketingLayout>
  );
}
