'use client';

import React from 'react';
import { useDocumentTitle } from '@/utils/useDocumentTitle';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Container } from '../ui/Container';
import { FAQAccordion } from '../ui/FAQAccordion';
import { ConsultationCTA } from '../sections/ConsultationCTA';
import { Disclaimer } from '../ui/Disclaimer';

export const FAQPage: React.FC = () => {
  useDocumentTitle(
    'FAQ | ORSA',
    'Answers to frequently asked questions regarding European work authorization, employment permits in Romania, Croatia, and Finland, documentation, and advisory processes.'
  );

  const faqItems = [
    {
      question: 'What does a work visa consultancy do?',
      answer:
        'A work visa consultancy provides specialized informational, procedural, and administrative guidance to candidates and employers navigating complex immigration regulations. We assist with document preparation, eligibility review, timeline planning, and compliance verification. ORSA does not function as an immigration law firm or government agency; our role is educational and advisory.',
    },
    {
      question: 'Can you guarantee that my visa or permit will be approved?',
      answer:
        'Clearly: No. Under European and national legislation, the sole authority to approve, grant, or refuse work authorizations and visas rests exclusively with relevant government bodies—such as the General Inspectorate for Immigration (IGI) in Romania, the Ministry of the Interior (MUP) in Croatia, and the Finnish Immigration Service (Migri) in Finland. Any consultant guaranteeing approval is acting unethically and contrary to the law.',
    },
    {
      question: 'Do I need a job offer before I can apply for a work permit?',
      answer:
        'For the vast majority of standard employed worker pathways in Romania, Croatia, and Finland, a formal job offer or signed employment contract from a legally registered employer within that country is an essential prerequisite. The employer is typically required to initiate the authorization process or prove compliance (such as passing a labor market test). Very specific self-employed or startup routes exist under distinct frameworks, but standard work permits require confirmed employment.',
    },
    {
      question: 'What is the fundamental difference between a work permit and a visa?',
      answer:
        'A visa (typically a category D long-stay visa) is an entry document that grants permission to enter and travel to a country for a specific purpose. A work permit (or residence permit for work) is the legal authorization allowing a foreign national to perform labor and legally reside in the host nation. In Croatia and Finland, these are integrated into unified permits (Single Permit in Croatia, Residence Permit for an Employed Person in Finland). In Romania, the employer first secures a work permit from IGI, after which the applicant obtains a D/AM long-stay visa to enter, followed by registering for a residence card upon arrival.',
    },
    {
      question: 'Can I choose between Romania, Croatia, and Finland?',
      answer:
        'Yes, and we assist you in evaluating which system aligns best with your professional qualifications, industry demands, and language abilities. Romania and Croatia have high demand across logistics, manufacturing, construction, and hospitality, while Finland emphasizes technology, healthcare, specialized engineering, and skilled technical trades alongside minimum statutory income thresholds.',
    },
    {
      question: 'Which documents might typically be required for a work permit application?',
      answer:
        'While exact requirements depend heavily on the specific destination and profession, typical documentation includes: a valid international passport (with at least 6–12 months validity), a signed employment contract or binding offer, verified educational diplomas and vocational certifications (often apostilled or consular-legalized), clean police clearance certificates from your country of origin/residence, proof of suitable accommodation, and comprehensive health insurance. Detailed, personalized checklists are provided during advisory sessions.',
    },
    {
      question: 'How long does the permit and visa process typically take?',
      answer:
        'Processing timelines vary significantly by country, occupation, and seasonal consular volume. In Romania, employer work permit approval and subsequent D-visa processing generally spans between 2 to 4 months. In Croatia, Single Permit processing through MUP and HZZ typically takes 6 to 12 weeks. In Finland, electronic processing via Enter Finland ranges between 1 to 3 months for employed persons, with fast-track options available for specialists (approx. 2 weeks). Always refer to current indicative timelines on official government portals.',
    },
    {
      question: 'Can requirements and processes differ depending on my nationality?',
      answer:
        'Substantially. Citizens of European Union (EU) and European Economic Area (EEA) member states, as well as Switzerland, benefit from freedom of movement and do not require work permits to take up employment in Romania, Croatia, or Finland (they complete simple local EU citizen registration). Non-EU/EEA third-country nationals must fulfill formal immigration clearance, quota allocations, and labor market tests under national immigration law.',
    },
    {
      question: 'How can I book a preliminary consultation with your team?',
      answer:
        'You can submit an initial inquiry via our online Consultation Intake Form on the Contact page. Our team reviews your background, target country, and current employment status, and responds within two business days to schedule a structured preliminary consultation.',
    },
    {
      question: 'Where can I independently verify official immigration requirements?',
      answer: (
        <div className="space-y-3">
          <p>
            We actively encourage all applicants to review published government regulations directly on official portals:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>
              <strong>Romania:</strong>{' '}
              <a href="https://workinromania.gov.ro" target="_blank" rel="noopener noreferrer" className="underline text-[#850D0D]">
                WorkinRomania.gov.ro
              </a>{' '}
              and the General Inspectorate for Immigration at{' '}
              <a href="https://igi.mai.gov.ro" target="_blank" rel="noopener noreferrer" className="underline text-[#850D0D]">
                igi.mai.gov.ro
              </a>.
            </li>
            <li>
              <strong>Croatia:</strong> Ministry of the Interior at{' '}
              <a href="https://mup.gov.hr" target="_blank" rel="noopener noreferrer" className="underline text-[#850D0D]">
                mup.gov.hr
              </a>{' '}
              and the Employment Service at{' '}
              <a href="https://www.hzz.hr" target="_blank" rel="noopener noreferrer" className="underline text-[#850D0D]">
                hzz.hr
              </a>.
            </li>
            <li>
              <strong>Finland:</strong> Finnish Immigration Service at{' '}
              <a href="https://migri.fi" target="_blank" rel="noopener noreferrer" className="underline text-[#850D0D]">
                migri.fi
              </a>{' '}
              and electronic application service at{' '}
              <a href="https://enterfinland.fi" target="_blank" rel="noopener noreferrer" className="underline text-[#850D0D]">
                enterfinland.fi
              </a>.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header Banner */}
      <section className="bg-cream pb-12 lg:pb-16 border-b border-[#DAD8D3]">
        <Container>
          <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

          <div className="mt-6 max-w-3xl">
            <div className="inline-flex items-center border-l-2 border-[#850D0D] pl-3 mb-4">
              <span className="uppercase tracking-widest text-xs font-semibold text-[#777570]">
                TRANSPARENCY & CLARIFICATIONS
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#171717] tracking-tight leading-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="font-body text-base sm:text-lg text-[#777570] leading-relaxed">
              Clear, transparent answers to core questions concerning European labor migration regulations, official authorities, timeline expectations, and our advisory scope.
            </p>
          </div>
        </Container>
      </section>

      {/* Accordion Section */}
      <section className="py-20 bg-white border-b border-[#DAD8D3]">
        <Container>
          <div className="max-w-4xl mx-auto">
            <FAQAccordion items={faqItems} allowMultiple={true} />

            <div className="mt-12">
              <Disclaimer />
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <ConsultationCTA variant="dark" />
    </div>
  );
};
