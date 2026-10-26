import { MarketingLayout } from '@/components/marketing/layout/MarketingLayout';
import { FAQPage } from '@/components/marketing/pages/FAQPage';

export const metadata = {
  title: 'FAQ | ORSA',
  description: 'Answers to frequently asked questions regarding European work authorization, employment permits in Romania, Croatia, and Finland, documentation, and advisory processes.',
};

export default function FAQ() {
  return (
    <MarketingLayout>
      <FAQPage />
    </MarketingLayout>
  );
}
