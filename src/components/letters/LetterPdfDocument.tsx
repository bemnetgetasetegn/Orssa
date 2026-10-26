import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { LetterContentJson } from '@/types/database'

const styles = StyleSheet.create({
  page: {
    paddingTop: 45,
    paddingBottom: 45,
    paddingHorizontal: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1F2937',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E50914',
    paddingBottom: 12,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#E50914',
    letterSpacing: 0.5,
  },
  companySub: {
    fontSize: 9,
    color: '#4B5563',
    marginTop: 2,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    fontSize: 9,
    color: '#4B5563',
  },
  recipientBox: {
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recipientName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  recipientDetails: {
    fontSize: 9,
    color: '#4B5563',
    marginTop: 2,
  },
  subject: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 12,
    textDecoration: 'underline',
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginTop: 10,
    marginBottom: 4,
  },
  termsTable: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableRowLast: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableLabel: {
    width: '35%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#374151',
  },
  tableValue: {
    width: '65%',
    fontSize: 9,
    color: '#1F2937',
  },
  signatureSection: {
    marginTop: 25,
    paddingTop: 10,
  },
  signatureLine: {
    width: 180,
    borderTopWidth: 1,
    borderTopColor: '#9CA3AF',
    marginTop: 35,
    marginBottom: 4,
  },
  signatoryName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#111827',
  },
  signatoryTitle: {
    fontSize: 9,
    color: '#4B5563',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
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
    ? new Date(issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  return (
    <Document title={`Employment Offer - ${employeeName}`} author="Orsa Recruitment Agency">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>
            {content.company_name || 'ORSA RECRUITMENT AGENCY'}
          </Text>
          <Text style={styles.companySub}>
            {content.company_address || 'Global Workforce Solutions & International Placements'}
          </Text>
          <Text style={styles.companySub}>
            Email: {content.company_email || 'contact@orsa.com'} | Tel:{' '}
            {content.company_phone || '+1 (555) 019-2834'}
          </Text>
        </View>

        {/* Date and Ref */}
        <View style={styles.metaSection}>
          <Text>Date: {formattedDate}</Text>
          <Text>Ref: ORSA-OFFER-{Math.random().toString(36).substring(2, 8).toUpperCase()}</Text>
        </View>

        {/* Recipient Box */}
        <View style={styles.recipientBox}>
          <Text style={styles.recipientName}>{employeeName}</Text>
          {passportNumber && (
            <Text style={styles.recipientDetails}>Passport No: {passportNumber}</Text>
          )}
          <Text style={styles.recipientDetails}>Position: {jobTitle}</Text>
        </View>

        {/* Subject */}
        <Text style={styles.subject}>
          SUBJECT: FORMAL OFFER OF EMPLOYMENT - {jobTitle.toUpperCase()}
        </Text>

        {/* Greeting */}
        <Text style={styles.paragraph}>
          {content.greeting || `Dear ${employeeName},`}
        </Text>

        {/* Introduction */}
        <Text style={styles.paragraph}>
          {content.introduction ||
            'We are pleased to extend this formal offer of international employment through Orsa Recruitment Agency. Following an exhaustive assessment of your skills and background, we are confident in your capabilities.'}
        </Text>

        {/* Body */}
        <Text style={styles.paragraph}>
          {content.offer_body ||
            `You are being offered the designated role of ${jobTitle}. This engagement represents an international placement opportunity with our authorized corporate sponsor.`}
        </Text>

        {/* Summary Table */}
        <View style={styles.termsTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Position:</Text>
            <Text style={styles.tableValue}>{jobTitle}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Location:</Text>
            <Text style={styles.tableValue}>{content.work_location || 'To Be Assigned'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Contract/Visa:</Text>
            <Text style={styles.tableValue}>{content.visa_duration || '2 Years (Renewable)'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Compensation:</Text>
            <Text style={styles.tableValue}>{content.salary || 'As specified in primary contract'}</Text>
          </View>
          <View style={styles.tableRowLast}>
            <Text style={styles.tableLabel}>Accommodations & Food:</Text>
            <Text style={styles.tableValue}>
              {content.accommodation || 'Provided by sponsor'} / {content.food_allowance || 'Covered'}
            </Text>
          </View>
        </View>

        {/* Responsibilities */}
        {content.responsibilities && (
          <View>
            <Text style={styles.sectionTitle}>Key Duties & Responsibilities:</Text>
            <Text style={styles.paragraph}>{content.responsibilities}</Text>
          </View>
        )}

        {/* Acceptance */}
        <Text style={styles.paragraph}>
          {content.acceptance_instructions ||
            'Please verify your acceptance of this appointment by counter-signing this offer and submitting the necessary travel and identification documents through your Orsa portal.'}
        </Text>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <Text style={styles.paragraph}>{content.closing || 'Sincerely,'}</Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatoryName}>
            {content.signatory_name || 'Authorized Recruitment Director'}
          </Text>
          <Text style={styles.signatoryTitle}>
            {content.signatory_title || 'Orsa Global Human Resources'}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          {content.footer ||
            'Orsa International Recruitment Agency • Confidential & Legally Binding Employment Offer'}
        </Text>
      </Page>
    </Document>
  )
}
export default LetterPdfDocument
