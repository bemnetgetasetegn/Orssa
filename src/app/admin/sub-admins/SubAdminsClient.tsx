'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  UserCheck,
  UserX,
  KeyRound,
  UserPlus,
  Shield,
  Users,
  AlertTriangle,
  Check,
  X,
  Search,
} from 'lucide-react'
import {
  createSubAdmin,
  toggleSubAdminStatus,
  resetSubAdminPassword,
  assignEmployeesToSubAdmin,
  removeEmployeeFromSubAdmin,
  type SubAdminWithCounts,
} from '@/app/actions/sub-admins'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatusBadge } from '@/components/employees/status-badge'
import type { Employee } from '@/types/database'

interface SubAdminsClientProps {
  subAdmins: SubAdminWithCounts[]
  allEmployees: Employee[]
}

export default function SubAdminsClient({ subAdmins, allEmployees }: SubAdminsClientProps) {
  const router = useRouter()
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdminWithCounts | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)
  const [activeSubAdminId, setActiveSubAdminId] = useState<string | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [employeeSearch, setEmployeeSearch] = useState('')

  const handleCreateSubAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    const payload = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      account_status: (formData.get('account_status') as any) || 'active',
    }

    startTransition(async () => {
      const res = await createSubAdmin(payload)
      if (!res.success) {
        setError(res.error || 'Failed to create sub-admin.')
      } else if (res.data) {
        setGeneratedPassword(res.data.temporary_password)
        setCreateModalOpen(false)
        router.refresh()
      }
    })
  }

  const handleToggleStatus = (subAdmin: SubAdminWithCounts) => {
    setActiveSubAdminId(subAdmin.id)
    setStatusConfirmOpen(true)
  }

  const confirmToggleStatus = async () => {
    if (!activeSubAdminId) return
    const current = subAdmins.find((s) => s.id === activeSubAdminId)
    const nextStatus = current?.account_status === 'suspended' ? 'active' : 'suspended'
    await toggleSubAdminStatus(activeSubAdminId, nextStatus)
    setStatusConfirmOpen(false)
    setActiveSubAdminId(null)
    router.refresh()
  }

  const handleResetPassword = (subAdmin: SubAdminWithCounts) => {
    setActiveSubAdminId(subAdmin.id)
    setResetConfirmOpen(true)
  }

  const confirmResetPassword = async () => {
    if (!activeSubAdminId) return
    const res = await resetSubAdminPassword(activeSubAdminId)
    if (res.success && res.data) {
      setGeneratedPassword(res.data.temporary_password)
    }
    setResetConfirmOpen(false)
    setActiveSubAdminId(null)
  }

  const handleToggleAssignment = async (employeeId: string, isCurrentlyAssigned: boolean) => {
    if (!selectedSubAdmin) return
    if (isCurrentlyAssigned) {
      await removeEmployeeFromSubAdmin(selectedSubAdmin.id, employeeId)
    } else {
      await assignEmployeesToSubAdmin(selectedSubAdmin.id, [employeeId])
    }
    router.refresh()
  }

  const filteredEmployees = allEmployees.filter(
    (emp) =>
      emp.full_name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.passport_number.toLowerCase().includes(employeeSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Sub-Administrator Management</h1>
          <p className="text-sm text-[#A1A1AA]">
            Delegate scoped recruitment responsibilities without exposing template authorization or system settings.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-xs font-semibold text-[#FAFAFA] hover:bg-[#B91C1C] transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add Sub-Administrator
        </button>
      </div>

      {/* Generated Password Announcement Banner */}
      {generatedPassword && (
        <div className="p-4 rounded-xl border border-green-500/40 bg-green-950/30 text-green-300 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Sub-Administrator Account Initialized</p>
            <p className="text-xs text-green-400 mt-0.5">
              Secure Temporary Password: <span className="font-mono font-bold select-all">{generatedPassword}</span>
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(generatedPassword)
              setGeneratedPassword(null)
            }}
            className="px-3 py-1.5 rounded-lg bg-green-800 text-xs text-white font-medium hover:bg-green-700"
          >
            Copy & Dismiss
          </button>
        </div>
      )}

      {/* Table of Sub-Admins */}
      <div className="rounded-xl border border-[#303036] bg-[#1D1D20] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#303036] bg-[#141416]/50 text-[#A1A1AA]">
              <th className="py-3 px-4 font-semibold">Sub-Admin Name</th>
              <th className="py-3 px-4 font-semibold">Email Address</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Assigned Candidates</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#303036]/50">
            {subAdmins.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#A1A1AA]">
                  No sub-administrators configured yet. Click above to invite an agent.
                </td>
              </tr>
            ) : (
              subAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-[#141416]/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#FAFAFA] flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#E50914]/20 text-[#E50914] flex items-center justify-center font-bold text-xs">
                      {admin.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    {admin.full_name}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA]">{admin.email}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge type="account" status={admin.account_status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        setSelectedSubAdmin(admin)
                        setAssignModalOpen(true)
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141416] border border-[#303036] text-[#FAFAFA] hover:border-[#E50914] transition-colors"
                    >
                      <Users className="h-3 w-3 text-[#E50914]" />
                      <span>{admin.assigned_employee_count} Candidates</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleResetPassword(admin)}
                      className="px-2.5 py-1 rounded bg-[#141416] border border-[#303036] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleToggleStatus(admin)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        admin.account_status === 'suspended'
                          ? 'bg-green-950 text-green-400 border border-green-800'
                          : 'bg-red-950/40 text-red-400 border border-red-900/50'
                      }`}
                    >
                      {admin.account_status === 'suspended' ? 'Reactivate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Sub-Admin Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#303036] bg-[#1D1D20] p-6 text-[#FAFAFA] shadow-2xl">
            <h2 className="text-lg font-bold mb-1">Create Sub-Administrator</h2>
            <p className="text-xs text-[#A1A1AA] mb-4">
              Authorized to manage permitted employee candidates only.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded bg-red-950/40 border border-red-500/40 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateSubAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="Officer Name"
                  className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-xs text-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Official Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="officer@orsa.com"
                  className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-xs text-[#FAFAFA]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#303036] text-xs text-[#A1A1AA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-[#E50914] text-xs font-semibold text-white hover:bg-[#B91C1C]"
                >
                  {isPending ? 'Creating Account...' : 'Generate Sub-Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Assignment Modal */}
      {assignModalOpen && selectedSubAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-[#303036] bg-[#1D1D20] p-6 text-[#FAFAFA] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#303036] pb-3">
              <div>
                <h2 className="text-base font-bold">Assign Candidates to {selectedSubAdmin.full_name}</h2>
                <p className="text-xs text-[#A1A1AA]">Manage candidate visibility scope for this sub-admin.</p>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded text-[#A1A1AA] hover:text-[#FAFAFA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A1A1AA]" />
              <input
                type="text"
                placeholder="Filter candidates by name, email, or passport..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="w-full rounded-lg bg-[#141416] border border-[#303036] pl-9 pr-3.5 py-2 text-xs text-[#FAFAFA]"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#303036]/40">
              {filteredEmployees.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#A1A1AA]">No matching candidate records.</p>
              ) : (
                filteredEmployees.map((emp) => {
                  const isAssigned = emp.assigned_sub_admin_id === selectedSubAdmin.id
                  return (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between py-2 px-2 hover:bg-[#141416] rounded transition-colors text-xs"
                    >
                      <div>
                        <p className="font-medium text-[#FAFAFA]">{emp.full_name}</p>
                        <p className="text-[#A1A1AA] text-[11px]">
                          {emp.email} • {emp.passport_number}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleAssignment(emp.id, isAssigned)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 ${
                          isAssigned
                            ? 'bg-green-950 text-green-300 border border-green-700'
                            : 'bg-[#141416] border border-[#303036] text-[#A1A1AA] hover:text-[#FAFAFA]'
                        }`}
                      >
                        {isAssigned ? (
                          <>
                            <Check className="h-3 w-3" /> Assigned
                          </>
                        ) : (
                          'Assign'
                        )}
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#303036]">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#E50914] text-xs font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={statusConfirmOpen}
        onClose={() => setStatusConfirmOpen(false)}
        onConfirm={confirmToggleStatus}
        title="Change Sub-Admin Status?"
        description="Suspended sub-admins will instantly be ejected from administrative sessions."
        type="destructive"
      />

      <ConfirmDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={confirmResetPassword}
        title="Reset Sub-Admin Password?"
        description="A new temporary credential will be generated and the existing session will be revoked."
        confirmLabel="Generate New Password"
        type="destructive"
      />
    </div>
  )
}
