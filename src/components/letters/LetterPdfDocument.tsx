import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import path from 'path'
import fs from 'fs'
import type { LetterContentJson } from '@/types/database'

function getAssetPath(filename: string): string | null {
  try {
    const fullPath = path.join(process.cwd(), 'public', 'letter-assets', filename)
    if (fs.existsSync(fullPath)) {
      return fullPath
    }
  } catch {}
  return null
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingLeft: 46,
    paddingRight: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1E293B',
    lineHeight: 1.45,
    position: 'relative',
  },
  leftRibbon: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#E50914',
  },
  watermark: {
    position: 'absolute',
    top: 240,
    left: 110,
    width: 380,
    height: 320,
    opacity: 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E50914',
    paddingBottom: 10,
    marginBottom: 12,
  },
  logoContainer: {
    width: '45%',
  },
  logo: {
    width: 150,
    height: 42,
    objectFit: 'contain',
  },
  companyTagline: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#E50914',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  headerDetails: {
    width: '50%',
    textAlign: 'right',
    fontSize: 7.5,
    color: '#64748B',
    lineHeight: 1.35,
  },
  companyNameRight: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#991B1B',
    marginBottom: 1,
  },
  websiteLink: {
    fontSize: 7.5,
    color: '#E50914',
    fontFamily: 'Helvetica-Bold',
    marginTop: 1,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recipientBox: {
    width: '52%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 3,
    padding: 8,
  },
  recipientHeader: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#DC2626',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  recipientName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  recipientDetail: {
    fontSize: 8,
    color: '#334155',
  },
  docMetaBox: {
    width: '44%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 3,
    padding: 8,
    justifyContent: 'space-between',
  },
  metaRow: {
    fontSize: 8,
    color: '#475569',
    marginBottom: 2,
  },
  metaLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
  },
  officialBadge: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  subjectBanner: {
    backgroundColor: '#991B1B',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 10,
  },
  subjectText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  salutation: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 8,
    textAlign: 'justify',
    color: '#334155',
    fontSize: 8.5,
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#991B1B',
    marginTop: 4,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  table: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 3,
  },
  tableHeader: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#991B1B',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
  },
  tableRowLast: {
    flexDirection: 'row',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
  },
  tableColLabel: {
    width: '36%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: '#475569',
  },
  tableColValue: {
    width: '64%',
    fontSize: 8,
    color: '#0F172A',
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  benefitCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 3,
    padding: 5,
    marginBottom: 5,
  },
  benefitTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  benefitDesc: {
    fontSize: 7,
    color: '#64748B',
    marginTop: 1,
  },
  acceptanceBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 3,
    padding: 6,
    marginVertical: 6,
  },
  acceptanceTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#991B1B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  acceptanceText: {
    fontSize: 7.5,
    color: '#1E293B',
    lineHeight: 1.35,
    textAlign: 'justify',
  },
  authSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
  },
  signatureCol: {
    width: '50%',
  },
  signatureImg: {
    width: 105,
    height: 38,
    objectFit: 'contain',
    marginBottom: 2,
  },
  sigLine: {
    width: 160,
    borderTopWidth: 1.5,
    borderTopColor: '#94A3B8',
    marginBottom: 3,
  },
  signatoryName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: '#0F172A',
  },
  signatoryTitle: {
    fontSize: 7.5,
    color: '#64748B',
  },
  signatoryCompany: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#E50914',
  },
  stampCol: {
    width: '40%',
    alignItems: 'center',
  },
  stampImg: {
    width: 78,
    height: 78,
    objectFit: 'contain',
  },
  stampLabel: {
    fontSize: 6.5,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 46,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 5,
  },
})

interface LetterPdfDocumentProps {
  content: LetterContentJson
  employeeName: string
  jobTitle: string
  issueDate?: string
  passportNumber?: string
}

export const LetterPdfDocument: React.FC<LetterPdfDocumentProps> = ({
  content,
  employeeName,
  jobTitle,
  issueDate,
  passportNumber,
}) => {
  const formattedDate = issueDate
    ? new Date(issueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

  // Dynamic job role resolution: prevent fallback "Worker" from masking real role
  const resolvedJobTitle =
    jobTitle && jobTitle.trim().toLowerCase() !== 'worker'
      ? jobTitle.trim()
      : (content as any)?.job_title || (content as any)?.position || 'Construction Worker'

  // Dynamic location resolution: replace {{work_location}} placeholder or empty value
  const resolvedWorkLocation =
    content.work_location &&
    content.work_location.trim() !== '{{work_location}}' &&
    content.work_location.trim().toLowerCase() !== 'to be determined'
      ? content.work_location.trim()
      : 'European Project Sites (Romania / Finland)'

  const logoPath = getAssetPath('logo.png')
  const watermarkPath = getAssetPath('watermark.png')
  const stampPath = getAssetPath('stamp.png')
  const signaturePath = getAssetPath('signature.png')

  const companyName = 'Orsa Recruitment Agency'
  const companyAddress = content.company_address || '123 Business District, International Plaza'
  const companyEmail = 'contact@orssa.net'
  const companyPhone = content.company_phone || '+1 (555) 019-2834'
  const website = 'www.orssa.net'

  const sanitizeText = (text: string | undefined): string => {
    if (!text) return ''
    return text
      .replace(/\{\{work_location\}\}/g, resolvedWorkLocation)
      .replace(/\{\{job_title\}\}/g, resolvedJobTitle)
      .replace(/\{\{employee_name\}\}/g, employeeName)
      .replace(/\bthe role of Worker\b/gi, `the role of ${resolvedJobTitle}`)
      .replace(/\bposition of Worker\b/gi, `position of ${resolvedJobTitle}`)
  }

  const rawOfferBody = content.offer_body || ''
  const sanitizedOfferBody = sanitizeText(rawOfferBody)

  return (
    <Document title={`Employment Offer - ${employeeName}`} author={companyName}>
      <Page size="A4" style={styles.page}>
        {/* Left Vertical Ribbon - RED */}
        <View style={styles.leftRibbon} />

        {/* Watermark */}
        {watermarkPath && (
          <Image src={watermarkPath} style={styles.watermark} />
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {logoPath ? (
              <Image src={logoPath} style={styles.logo} />
            ) : (
              <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#E50914' }}>
                {companyName}
              </Text>
            )}
            <Text style={styles.companyTagline}>
              Your Future. Our Priority.
            </Text>
          </View>
          <View style={styles.headerDetails}>
            <Text style={styles.companyNameRight}>{companyName}</Text>
            <Text>{companyAddress}</Text>
            <Text>Tel: {companyPhone}</Text>
            <Text>Email: {companyEmail}</Text>
            <Text style={styles.websiteLink}>{website}</Text>
          </View>
        </View>

        {/* Meta & Recipient Grid */}
        <View style={styles.metaGrid}>
          {/* Recipient Details */}
          <View style={styles.recipientBox}>
            <Text style={styles.recipientHeader}>Candidate Information</Text>
            <Text style={styles.recipientName}>{employeeName}</Text>
            {passportNumber && (
              <Text style={styles.recipientDetail}>
                Passport Number: {passportNumber}
              </Text>
            )}
            <Text style={styles.recipientDetail}>
              Proposed Role: {resolvedJobTitle}
            </Text>
          </View>

          {/* Document Meta */}
          <View style={styles.docMetaBox}>
            <View>
              <Text style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date: </Text>{formattedDate}
              </Text>
              <Text style={styles.metaRow}>
                <Text style={styles.metaLabel}>Ref: </Text>REF-{employeeName.slice(0, 3).toUpperCase()}-2026-ORSA
              </Text>
            </View>
            <Text style={styles.officialBadge}>Official Employment Offer</Text>
          </View>
        </View>

        {/* Subject Header */}
        <View style={styles.subjectBanner}>
          <Text style={styles.subjectText}>
            Subject: Formal Offer of Employment — {resolvedJobTitle}
          </Text>
        </View>

        {/* Salutation */}
        <Text style={styles.salutation}>
          {content.greeting || `Dear Mr. ${employeeName},`}
        </Text>

        {/* Introduction */}
        <Text style={styles.paragraph}>
          {sanitizeText(content.introduction) ||
            `On behalf of ${companyName}, it is with immense pleasure and excitement that we extend this official offer of employment for the position of ${resolvedJobTitle}. We have been thoroughly impressed with your qualifications and believe your skills and dedication will be a significant asset to our international projects. This opportunity represents a gateway to a rewarding career, offering a stable environment and substantial growth prospects.`}
        </Text>

        {/* Offer Body */}
        <Text style={styles.paragraph}>
          {sanitizedOfferBody ||
            `We are offering you the position of ${resolvedJobTitle} based at ${resolvedWorkLocation}. This opportunity has been secured through our international recruitment network and represents an excellent career development prospect. Joining our team means becoming part of a community dedicated to excellence, safety, and mutual respect.`}
        </Text>

        {/* Responsibilities / Position Details */}
        <Text style={styles.sectionTitle}>Position Details &amp; Designated Worksite</Text>
        <Text style={styles.paragraph}>
          {sanitizeText(content.responsibilities) ||
            `You are being offered the role of ${resolvedJobTitle}, where you will be instrumental in ongoing operations. Your primary worksite will be located at ${resolvedWorkLocation}, specifically tailored to projects that require skilled and dedicated individuals. Your duties encompass site preparation, execution of designated trade tasks, and rigorous adherence to occupational safety standards.`}
        </Text>

        {/* Summary Table - RED THEME */}
        <View style={styles.table}>
          <Text style={styles.tableHeader}>Contract &amp; Employment Specifications</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Designated Position:</Text>
            <Text style={[styles.tableColValue, { fontFamily: 'Helvetica-Bold', color: '#DC2626' }]}>
              {resolvedJobTitle}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Primary Worksite:</Text>
            <Text style={styles.tableColValue}>
              {resolvedWorkLocation}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Contract &amp; Visa Validity:</Text>
            <Text style={styles.tableColValue}>
              {content.visa_duration || '2 (Two) Years Initial Validity (Renewable)'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Gross Monthly Salary:</Text>
            <Text style={styles.tableColValue}>
              {content.salary || '1600€ (One Thousand Six Hundred Euros)'}
            </Text>
          </View>
          <View style={styles.tableRowLast}>
            <Text style={styles.tableColLabel}>Accommodations &amp; Food:</Text>
            <Text style={styles.tableColValue}>
              {content.accommodation || 'Company Provided Housing'} &amp;{' '}
              {content.food_allowance || 'Daily Meal Provision / Allowance'}
            </Text>
          </View>
        </View>

        {/* Benefits Highlights */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>Accommodation Provided</Text>
            <Text style={styles.benefitDesc}>
              Comfortable, verified housing provided for employment duration.
            </Text>
          </View>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>Daily Sustenance Support</Text>
            <Text style={styles.benefitDesc}>
              Meal allowances provided to support your daily living.
            </Text>
          </View>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>Medical &amp; Healthcare Coverage</Text>
            <Text style={styles.benefitDesc}>
              Comprehensive health insurance coverage under international standards.
            </Text>
          </View>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>Paid Annual Vacation</Text>
            <Text style={styles.benefitDesc}>
              2 (Two) weeks paid time off per year for rest and recreation.
            </Text>
          </View>
        </View>

        {/* Acceptance Box - CONTACTING YOUR AGENCY Wording */}
        <View style={styles.acceptanceBox}>
          <Text style={styles.acceptanceTitle}>Acceptance &amp; Next Steps</Text>
          <Text style={styles.acceptanceText}>
            To accept this offer, please confirm your acceptance by contacting your agency. Further
            instructions regarding documentation and pre-departure procedures will follow upon your
            acceptance.
          </Text>
        </View>

        {/* Authentication & Signature Block */}
        <View style={styles.authSection}>
          {/* Signature & Signatory */}
          <View style={styles.signatureCol}>
            <Text style={{ fontSize: 8, color: '#475569', marginBottom: 2 }}>
              {content.closing || 'Sincerely,'}
            </Text>
            {signaturePath && (
              <Image src={signaturePath} style={styles.signatureImg} />
            )}
            <View style={styles.sigLine} />
            <Text style={styles.signatoryName}>
              {content.signatory_name || 'Ville Oskari'}
            </Text>
            <Text style={styles.signatoryTitle}>
              {content.signatory_title || 'Recruitment Director'}
            </Text>
            <Text style={styles.signatoryCompany}>{companyName}</Text>
          </View>

          {/* Official Stamp */}
          <View style={styles.stampCol}>
            {stampPath && (
              <Image src={stampPath} style={styles.stampImg} />
            )}
            <Text style={styles.stampLabel}>Official Seal &amp; Verification</Text>
          </View>
        </View>

        {/* Running Footer */}
        <View style={styles.footer} fixed>
          <Text>{companyName} • Confidential &amp; Legally Binding Employment Offer</Text>
          <Text>{website}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default LetterPdfDocument
