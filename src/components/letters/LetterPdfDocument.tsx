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
    backgroundColor: '#1E88B5',
  },
  watermark: {
    position: 'absolute',
    top: 240,
    left: 100,
    width: 400,
    height: 320,
    opacity: 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1E88B5',
    paddingBottom: 10,
    marginBottom: 12,
  },
  logoContainer: {
    width: '45%',
  },
  logo: {
    width: 170,
    height: 38,
    objectFit: 'contain',
  },
  companyTagline: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1E88B5',
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
    color: '#0F3A5D',
    marginBottom: 1,
  },
  websiteLink: {
    fontSize: 7.5,
    color: '#1E88B5',
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
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 3,
    padding: 8,
  },
  recipientHeader: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0369A1',
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
    color: '#047857',
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  subjectBanner: {
    backgroundColor: '#0F3A5D',
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
    color: '#0F3A5D',
    marginTop: 4,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  table: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 3,
  },
  tableHeader: {
    backgroundColor: '#F0F9FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0369A1',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
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
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 3,
    padding: 6,
    marginVertical: 6,
  },
  acceptanceTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0369A1',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  acceptanceText: {
    fontSize: 7.5,
    color: '#334155',
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
    width: 95,
    height: 32,
    objectFit: 'contain',
    marginBottom: 2,
  },
  sigLine: {
    width: 150,
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
    color: '#1E88B5',
  },
  stampCol: {
    width: '40%',
    alignItems: 'center',
  },
  stampImg: {
    width: 75,
    height: 75,
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

  const logoPath = getAssetPath('logo.png')
  const watermarkPath = getAssetPath('watermark.png')
  const stampPath = getAssetPath('stamp.png')
  const signaturePath = getAssetPath('signature.png')

  const companyName = content.company_name || 'Gilbertin Kansainvälinen Työagentti'
  const companyAddress = content.company_address || 'Hämeenkatu 10, 33100 Tampere, Finland'
  const companyEmail = content.company_email || 'info@kansainvalinentyo.com'
  const companyPhone = content.company_phone || '+358 9 876 5432'
  const website = 'www.kansainvalinentyo.com'

  return (
    <Document title={`Employment Offer - ${employeeName}`} author={companyName}>
      <Page size="A4" style={styles.page}>
        {/* Left Vertical Ribbon */}
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
              <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1E88B5' }}>
                {companyName}
              </Text>
            )}
            <Text style={styles.companyTagline}>
              Your International Employment Partner
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
              Proposed Role: {jobTitle}
            </Text>
          </View>

          {/* Document Meta */}
          <View style={styles.docMetaBox}>
            <View>
              <Text style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date: </Text>{formattedDate}
              </Text>
              <Text style={styles.metaRow}>
                <Text style={styles.metaLabel}>Ref: </Text>REF-{employeeName.slice(0, 3).toUpperCase()}-2026-FI
              </Text>
            </View>
            <Text style={styles.officialBadge}>Official Employment Offer</Text>
          </View>
        </View>

        {/* Subject Header */}
        <View style={styles.subjectBanner}>
          <Text style={styles.subjectText}>
            Subject: Formal Offer of Employment — {jobTitle}
          </Text>
        </View>

        {/* Salutation */}
        <Text style={styles.salutation}>
          {content.greeting || `Dear Mr. ${employeeName},`}
        </Text>

        {/* Introduction */}
        <Text style={styles.paragraph}>
          {content.introduction ||
            `On behalf of ${companyName}, it is with immense pleasure and excitement that we extend this official offer of employment for the position of ${jobTitle}. We have been thoroughly impressed with your qualifications and believe your skills and dedication will be a significant asset to our projects in Finland. This opportunity represents a gateway to a rewarding career, offering a stable environment and substantial growth prospects in one of Europe's most dynamic and innovative construction landscapes.`}
        </Text>

        {/* Offer Body */}
        <Text style={styles.paragraph}>
          {content.offer_body ||
            'Finland is renowned for its high standards of living, robust economy, and commitment to worker welfare. Joining our team means becoming part of a community dedicated to excellence, safety, and mutual respect. We are confident that you will find this new chapter both professionally fulfilling and personally enriching.'}
        </Text>

        {/* Responsibilities / Position Details */}
        <Text style={styles.sectionTitle}>Position Details & Location</Text>
        <Text style={styles.paragraph}>
          {content.responsibilities ||
            `You are being offered the role of ${jobTitle}, where you will be instrumental in building the future of ongoing projects in Finland. Responsibilities encompass site preparation, trade duties, adherence to Finnish occupational safety regulations, and maintaining high craftsmanship standards.`}
        </Text>

        {/* Summary Table */}
        <View style={styles.table}>
          <Text style={styles.tableHeader}>Contract & Employment Specifications</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Position Offered:</Text>
            <Text style={styles.tableColValue}>{jobTitle}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Primary Worksite:</Text>
            <Text style={styles.tableColValue}>
              {content.work_location || 'Finland Project Sites (Tampere / Helsinki)'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Contract & Visa Validity:</Text>
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
            <Text style={styles.tableColLabel}>Accommodations & Food:</Text>
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
              Meal allowances provided to support your daily living in Finland.
            </Text>
          </View>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>Medical & Healthcare Coverage</Text>
            <Text style={styles.benefitDesc}>
              Comprehensive health insurance coverage under Finnish standards.
            </Text>
          </View>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>Paid Annual Vacation</Text>
            <Text style={styles.benefitDesc}>
              2 (Two) weeks paid time off per year for rest and recreation.
            </Text>
          </View>
        </View>

        {/* Acceptance Box */}
        <View style={styles.acceptanceBox}>
          <Text style={styles.acceptanceTitle}>Acceptance & Next Steps</Text>
          <Text style={styles.acceptanceText}>
            {content.acceptance_instructions ||
              'Please review this offer carefully. Should you accept this opportunity, submit your confirmation and requisite travel documents through the candidate portal. Upon confirmation, our team will proceed with your formal visa application.'}
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
              {content.signatory_name || 'Mikael Virtanen'}
            </Text>
            <Text style={styles.signatoryTitle}>
              {content.signatory_title || 'The Recruitment Team'}
            </Text>
            <Text style={styles.signatoryCompany}>{companyName}</Text>
          </View>

          {/* Official Stamp */}
          <View style={styles.stampCol}>
            {stampPath && (
              <Image src={stampPath} style={styles.stampImg} />
            )}
            <Text style={styles.stampLabel}>Official Seal & Verification</Text>
          </View>
        </View>

        {/* Running Footer */}
        <View style={styles.footer} fixed>
          <Text>{companyName} • Confidential & Legally Binding Employment Offer</Text>
          <Text>{website}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default LetterPdfDocument
