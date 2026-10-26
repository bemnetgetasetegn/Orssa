'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Edit3,
  FileText,
  KeyRound,
  ShieldAlert,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Clock,
  Briefcase,
  Calendar,
  Globe,
  Phone,
  Mail,
  Shield,
  FileCode,
} from 'lucide-react'
import { toggleEmployeeStatus, resetEmployeePassword } from '@/app/actions/employees'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatusBadge } from '@/components/employees/status-badge'
import type { Employee, JobOffer, Profile, ApplicationLetter, AuditLog } from '@/types/database'

interface EmployeeDetailClientProps {
  employee: Employee & {
    job_offer: JobOffer | null
    assigned_sub_admin: Profile | null
    application_letter: ApplicationLetter | null
  }
  photoUrl: string | null
  auditLogs: AuditLog[]
  isSuperAdmin: boolean
  baseUrl: string
  loginRef?: string | null
}

export default function EmployeeDetailClient({
  employee,
  photoUrl,
  auditLogs,
  isSuperAdmin,
  baseUrl,
  loginRef,
}: EmployeeDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'passport' | 'letter' | 'security' | 'history'>('overview')
  const [showPassport, setShowPassport] = useState(false)
  const [isPending, usePending] = useTransition()
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [newTempPassword, setNewTempPassword] = useState<string | null>(null)

  const isSuspended = employee.account_status === 'suspended'

  const handleCopyLink = () => {
    let empOrigin = baseUrl
    if (typeof window !== 'undefined') {
      const host = window.location.host
      const proto = window.location.protocol
      if (host.startsWith('admin.')) {
        empOrigin = `${proto}//${host.replace(/^admin\./, 'employee.')}`
      } else if (host.startsWith('admin.localhost')) {
        empOrigin = `${proto}//${host.replace(/^admin\./, 'employee.')}`
      } else if (host === 'localhost' || host.startsWith('localhost:')) {
        const port = window.location.port ? `:${window.location.port}` : ''
        empOrigin = `${proto}//employee.localhost${port}`
      }
    }
    const link = loginRef ? `${empOrigin}/login?ref=${loginRef}` : `${empOrigin}/login`
    navigator.clipboard.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleToggleStatus = async () => {
    const nextStatus = isSuspended ? 'active' : 'suspended'
    await toggleEmployeeStatus(employee.id, nextStatus)
    setStatusConfirmOpen(false)
    router.refresh()
  }

  const handleResetPassword = async () => {
    const res = await resetEmployeePassword(employee.id)
    if (res.success && res.data) {
      setNewTempPassword(res.data.temporary_password)
    }
    setResetConfirmOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/employees"
            className="p-2 rounded-lg bg-[#1D1D20] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#303036] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">{employee.full_name}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#141416] border border-[#303036] text-[#A1A1AA]">
                {employee.employee_code || 'EMP-TEMP'}
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5">Enrolled on {employee.registration_date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#303036] bg-[#1D1D20] text-xs font-medium text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedLink ? 'Copied Link' : 'Copy Access Link'}
          </button>

          <Link
            href={`/admin/employees/${employee.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#303036] bg-[#1D1D20] text-xs font-medium text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Profile
          </Link>

          {isSuperAdmin && (
            <Link
              href={`/admin/letters/${employee.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E50914] text-xs font-semibold text-[#FAFAFA] hover:bg-[#B91C1C] transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              Manage Letter
            </Link>
          )}
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#141416] border-2 border-[#303036] flex-shrink-0">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={employee.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-[#E50914]">
                {employee.full_name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-[#FAFAFA]">{employee.full_name}</span>
              <StatusBadge type="account" status={employee.account_status} />
              <StatusBadge type="application" status={employee.application_status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#52525B]" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#52525B]" />
                <span className="text-[#FAFAFA] font-medium">{employee.job_offer?.title || 'Unassigned'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#52525B]" />
                <span>Registered: {employee.registration_date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Temporary Password Alert banner if just generated */}
      {newTempPassword && (
        <div className="p-4 rounded-xl border border-green-500/40 bg-green-950/30 text-green-300 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">New Temporary Password Generated</p>
            <p className="text-xs text-green-400 mt-0.5 font-mono select-all">{newTempPassword}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(newTempPassword)
              setNewTempPassword(null)
            }}
            className="px-3 py-1.5 rounded-lg bg-green-800 text-xs text-white font-medium hover:bg-green-700"
          >
            Copy & Dismiss
          </button>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-[#303036] space-x-2 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'personal', label: 'Personal Information' },
          { id: 'passport', label: 'Passport Information' },
          { id: 'letter', label: 'Employment Letter' },
          { id: 'security', label: 'Account Security' },
          { id: 'history', label: 'Activity History' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#E50914] text-[#E50914]'
                : 'border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#FAFAFA] border-b border-[#303036] pb-2">Position & Placement</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#303036]/50">
                  <span className="text-[#A1A1AA]">Job Offer Category</span>
                  <span className="font-medium text-[#FAFAFA]">{employee.job_offer?.title ?? 'Not Assigned'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#303036]/50">
                  <span className="text-[#A1A1AA]">Application Status</span>
                  <StatusBadge type="application" status={employee.application_status} />
                </div>
                <div className="flex justify-between py-1 border-b border-[#303036]/50">
                  <span className="text-[#A1A1AA]">Assigned Sub-Admin</span>
                  <span className="text-[#FAFAFA]">{employee.assigned_sub_admin?.full_name ?? 'None (Direct Admin)'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#FAFAFA] border-b border-[#303036] pb-2">Employment Offer Letter</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#303036]/50">
                  <span className="text-[#A1A1AA]">Letter Status</span>
                  <StatusBadge type="letter" status={employee.application_letter?.status ?? 'not_created'} />
                </div>
                <div className="flex justify-between py-1 border-b border-[#303036]/50">
                  <span className="text-[#A1A1AA]">Current Version</span>
                  <span className="text-[#FAFAFA]">v{employee.application_letter?.current_version ?? 1}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#303036]/50">
                  <span className="text-[#A1A1AA]">Issued Date</span>
                  <span className="text-[#FAFAFA]">{employee.application_letter?.issued_at ? new Date(employee.application_letter.issued_at).toLocaleDateString() : 'Not Issued'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
            <div>
              <p className="text-[#A1A1AA] mb-1">Full Legal Name</p>
              <p className="text-sm font-medium text-[#FAFAFA]">{employee.full_name}</p>
            </div>
            <div>
              <p className="text-[#A1A1AA] mb-1">Email Address</p>
              <p className="text-sm font-medium text-[#FAFAFA]">{employee.email}</p>
            </div>
            <div>
              <p className="text-[#A1A1AA] mb-1">Phone Number</p>
              <p className="text-sm font-medium text-[#FAFAFA]">{employee.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-[#A1A1AA] mb-1">Nationality</p>
              <p className="text-sm font-medium text-[#FAFAFA]">{employee.nationality || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-[#A1A1AA] mb-1">Date of Birth</p>
              <p className="text-sm font-medium text-[#FAFAFA]">{employee.date_of_birth || 'Not recorded'}</p>
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <p className="text-[#A1A1AA] mb-1">Administrative Notes</p>
              <p className="text-sm text-[#FAFAFA] bg-[#141416] p-3 rounded-lg border border-[#303036]">
                {employee.internal_notes || 'No internal administrative remarks recorded for this candidate.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'passport' && (
          <div className="max-w-xl space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#141416] border border-[#303036]">
              <div>
                <p className="text-xs text-[#A1A1AA]">Government Passport Document Number</p>
                <p className="text-lg font-mono font-bold text-[#FAFAFA] mt-1 tracking-wider">
                  {showPassport
                    ? employee.passport_number
                    : '••••••••' + employee.passport_number.slice(-4)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPassport(!showPassport)}
                className="px-3 py-1.5 rounded-lg border border-[#303036] text-xs font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors flex items-center gap-1.5"
              >
                {showPassport ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPassport ? 'Hide Number' : 'Reveal Number'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-[#141416] border border-[#303036]">
                <p className="text-[#A1A1AA]">Passport Expiry</p>
                <p className="font-medium text-[#FAFAFA] mt-1">{employee.passport_expiry_date || 'No Expiry Set'}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#141416] border border-[#303036]">
                <p className="text-[#A1A1AA]">Nationality Status</p>
                <p className="font-medium text-[#FAFAFA] mt-1">{employee.nationality || 'Verified'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'letter' && (
          <div className="space-y-4">
            {employee.application_letter?.status === 'issued' ? (
              <div className="p-6 rounded-xl bg-green-950/20 border border-green-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-400">Formal Employment Offer Issued</h4>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Version {employee.application_letter.current_version} authorized and released to candidate.
                  </p>
                </div>
                {isSuperAdmin && (
                  <Link
                    href={`/admin/letters/${employee.id}`}
                    className="px-4 py-2 rounded-lg bg-[#E50914] text-xs font-semibold text-white hover:bg-[#B91C1C]"
                  >
                    View / Revise Offer Letter
                  </Link>
                )}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-[#303036] rounded-xl">
                <FileText className="h-10 w-10 text-[#52525B] mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-[#FAFAFA]">No Issued Letter Available</h4>
                <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto mt-1 mb-4">
                  The employment offer has either not been drafted or is pending executive issuance.
                </p>
                {isSuperAdmin && (
                  <Link
                    href={`/admin/letters/${employee.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-xs font-semibold text-white hover:bg-[#B91C1C]"
                  >
                    Compose Employment Letter
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl">
            <div className="p-4 rounded-xl bg-[#141416] border border-[#303036] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#FAFAFA]">Authentication Account Status</h4>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  {isSuspended
                    ? 'Candidate access is currently blocked from the portal.'
                    : 'Candidate can log into their private dashboard.'}
                </p>
              </div>
              <button
                onClick={() => setStatusConfirmOpen(true)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isSuspended
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-950 border border-red-500/50 text-red-400 hover:bg-red-900/50'
                }`}
              >
                {isSuspended ? 'Reactivate Account' : 'Suspend Account'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#141416] border border-[#303036] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#FAFAFA]">Temporary Password Reset</h4>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Generate a new high-entropy temporary password and invalidate previous sessions.
                </p>
              </div>
              <button
                onClick={() => setResetConfirmOpen(true)}
                className="px-3.5 py-1.5 rounded-lg border border-[#303036] bg-[#1D1D20] text-xs font-semibold text-[#FAFAFA] hover:bg-[#27272A]"
              >
                Reset Password
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-[#A1A1AA]">No administrative actions recorded yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#141416] border border-[#303036] text-xs">
                  <Clock className="h-4 w-4 text-[#A1A1AA] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#FAFAFA]">{log.action}</p>
                    <p className="text-[#A1A1AA] text-[11px] mt-0.5">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={statusConfirmOpen}
        onClose={() => setStatusConfirmOpen(false)}
        onConfirm={handleToggleStatus}
        title={isSuspended ? 'Reactivate Employee Account?' : 'Suspend Employee Account?'}
        description={`Are you sure you want to ${isSuspended ? 'reactivate' : 'suspend'} ${employee.full_name}'s access? Suspended employees will immediately be refused entry.`}
        confirmLabel={isSuspended ? 'Reactivate' : 'Suspend Account'}
        type={isSuspended ? 'info' : 'destructive'}
      />

      <ConfirmDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetPassword}
        title="Reset Employee Password?"
        description="This will issue a brand new secure temporary password. The candidate will be forced to change it on their next login."
        confirmLabel="Generate New Password"
        type="destructive"
      />
    </div>
  )
}
