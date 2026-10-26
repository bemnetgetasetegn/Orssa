import { MarketingLayout } from '@/components/marketing/layout/MarketingLayout';
import { FinlandPage } from '@/components/marketing/pages/FinlandPage';

export const metadata = {
  title: 'Work Visa Guidance — Finland | ORSA',
  description: 'Understand the Residence Permit for an Employed Person in Finland. Learn about Enter Finland electronic applications, statutory wage thresholds, and Migri requirements.',
};

export default function Finland() {
  return (
    <MarketingLayout>
      <FinlandPage />
    </MarketingLayout>
  );
}
