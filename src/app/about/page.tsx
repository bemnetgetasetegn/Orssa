import { MarketingLayout } from '@/components/marketing/layout/MarketingLayout';
import { AboutPage } from '@/components/marketing/pages/AboutPage';

export const metadata = {
  title: 'About | ORSA',
  description: 'Learn about ORSA, our professional approach to European labor migration guidance, and our commitment to transparent advisory.',
};

export default function About() {
  return (
    <MarketingLayout>
      <AboutPage />
    </MarketingLayout>
  );
}
