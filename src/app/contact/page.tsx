import { MarketingLayout } from '@/components/marketing/layout/MarketingLayout';
import { ContactPage } from '@/components/marketing/pages/ContactPage';

export const metadata = {
  title: 'Book a Consultation | ORSA',
  description: 'Submit an inquiry for European work visa guidance in Romania, Croatia, or Finland. Initial evaluation and process clarification.',
};

export default function Contact() {
  return (
    <MarketingLayout>
      <ContactPage />
    </MarketingLayout>
  );
}
