import { MarketingLayout } from '@/components/marketing/layout/MarketingLayout';
import { HomePage } from '@/components/marketing/pages/HomePage';

export const metadata = {
  title: 'ORSA — European Work Visa Guidance',
  description: 'Professional guidance for individuals exploring employment and work visa pathways in Romania, Croatia, and Finland.',
};

export default function Home() {
  return (
    <MarketingLayout>
      <HomePage />
    </MarketingLayout>
  );
}
