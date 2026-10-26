export interface DestinationInfo {
  id: string;
  name: string;
  slug: string;
  code: string;
  tagline: string;
  description: string;
  image: string;
  heroImage: string;
  officialUrl: string;
  officialName: string;
  workAuth: string;
  keyConsiderations: string;
  officialSources: {
    name: string;
    url: string;
    description: string;
  }[];
}

export const SITE_CONFIG = {
  name: 'ORSA',
  tagline: 'Your next chapter starts in Europe.',
  description: 'Professional guidance for people exploring employment and work visa pathways in Romania, Croatia, and Finland.',
  contact: {
    email: '[contact@orsaconsultancy.com]',
    phone: '[Contact details to be configured]',
    address: '[Office address to be configured]',
  },
  socials: {},
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Destinations', href: '/#destinations', hasDropdown: true },
    { label: 'Our Process', href: '/#process' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  destinations: [
    {
      id: 'romania',
      name: 'Romania',
      slug: 'romania',
      code: 'RO',
      tagline: 'Growing economy with expanding sectors in technology, manufacturing, and services.',
      description: 'Romania offers vibrant career pathways across major metropolitan hubs like Bucharest, Cluj-Napoca, and Timișoara, with a formalized dual-phase work authorization system.',
      image: 'https://images.unsplash.com/photo-1562625964-ffe9b2d3c3b0?w=700&q=80',
      heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      officialUrl: 'https://workinromania.gov.ro',
      officialName: 'Work in Romania / IGI',
      workAuth: 'Employment authorization (Work Permit) followed by Long-Stay Work Visa (D/AM) and Residence Permit',
      keyConsiderations: 'Employer initiates work permit via WorkinRomania portal; labor market test required unless quota or shortage applies.',
      officialSources: [
        {
          name: 'Work in Romania Digital Portal',
          url: 'https://workinromania.gov.ro',
          description: 'Official digital platform for Romanian employment authorization and labor migration processing.',
        },
        {
          name: 'General Inspectorate for Immigration (IGI)',
          url: 'https://igi.mai.gov.ro',
          description: 'Romanian Ministry of Internal Affairs agency regulating residence permits, visas, and legal stay.',
        },
      ],
    },
    {
      id: 'croatia',
      name: 'Croatia',
      slug: 'croatia',
      code: 'HR',
      tagline: 'Schengen zone destination combining high quality of life with demand in key industries.',
      description: 'Croatia features a unified Single Permit model for third-country nationals, offering work and residency rights in construction, tourism, logistics, and IT.',
      image: 'https://images.unsplash.com/photo-1555990538-5d1aba862dfc?w=700&q=80',
      heroImage: 'https://images.unsplash.com/photo-1595450547833-95af46bcb0d5?w=1200&q=80',
      officialUrl: 'https://mup.gov.hr',
      officialName: 'Ministry of the Interior (MUP)',
      workAuth: 'Single Permit (Jedinstvena dozvola za boravak i rad) combining residence and work authorization',
      keyConsiderations: 'Mandatory labor market testing by Croatian Employment Service (HZZ) unless occupation is on official shortage list.',
      officialSources: [
        {
          name: 'Ministry of the Interior (MUP)',
          url: 'https://mup.gov.hr',
          description: 'Central authority responsible for issuing Single Residence and Work Permits in the Republic of Croatia.',
        },
        {
          name: 'Croatian Employment Service (HZZ)',
          url: 'https://www.hzz.hr',
          description: 'National labor office conducting labor market tests and maintaining the occupational shortage register.',
        },
        {
          name: 'Official Government Information Portal (GOV.HR)',
          url: 'https://gov.hr',
          description: 'Official portal providing public administrative guidelines for foreign citizens entering Croatia.',
        },
      ],
    },
    {
      id: 'finland',
      name: 'Finland',
      slug: 'finland',
      code: 'FI',
      tagline: 'World-renowned innovation, workplace transparency, and progressive living standards.',
      description: 'Finland provides structured, digital-first residence permit tracks for employed professionals, specialists, and skilled workers with strong social infrastructure.',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=700&q=80',
      heroImage: 'https://images.unsplash.com/photo-1518982380512-5a3c6ade4561?w=1200&q=80',
      officialUrl: 'https://migri.fi',
      officialName: 'Finnish Immigration Service (Migri)',
      workAuth: 'Residence Permit for an Employed Person (TTOL) or Specialist Permit applied via Enter Finland',
      keyConsiderations: 'Requires electronic employment details submitted by employer; statutory minimum gross income requirement applies (€1,600/mo base threshold).',
      officialSources: [
        {
          name: 'Finnish Immigration Service (Migri)',
          url: 'https://migri.fi',
          description: 'Government agency processing residence permits, citizenship declarations, and international protection.',
        },
        {
          name: 'Enter Finland Digital Service',
          url: 'https://enterfinland.fi',
          description: 'Official digital self-service portal for submitting and monitoring Finnish residence permit applications.',
        },
      ],
    },
  ] as DestinationInfo[],
  disclaimer:
    'ORSA provides guidance and informational services only. Immigration requirements vary by nationality, employment circumstances, and the applicable legal framework. Visa and permit approvals are determined solely by the relevant government authorities. No outcome is guaranteed. Information on this website is for general informational purposes and may change. Always verify requirements with official government sources.',
};
