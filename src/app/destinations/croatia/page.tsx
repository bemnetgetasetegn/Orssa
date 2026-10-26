import { MarketingLayout } from '@/components/marketing/layout/MarketingLayout';
import { CroatiaPage } from '@/components/marketing/pages/CroatiaPage';

export const metadata = {
  title: 'Work Visa Guidance — Croatia | ORSA',
  description: 'Understand the Single Permit and work authorization framework for Croatia. Learn about HZZ labor market tests, shortage occupations, and official MUP sources.',
};

export default function Croatia() {
  return (
    <MarketingLayout>
      <CroatiaPage />
    </MarketingLayout>
  );
}
