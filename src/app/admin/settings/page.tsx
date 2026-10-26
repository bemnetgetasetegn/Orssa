import { requireSuperAdmin } from '@/lib/auth/helpers'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Shield, Key, Bell, Database, Server, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  await requireSuperAdmin()

  return (
    <AdminLayout title="System Settings">
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Security & System Settings</h1>
          <p className="text-sm text-[#A1A1AA]">
            Administrative infrastructure controls, storage bucket policies, and security configurations.
          </p>
        </div>

        {/* Security Policies Info */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#FAFAFA] flex items-center gap-2 border-b border-[#303036] pb-3">
            <Shield className="h-4 w-4 text-[#E50914]" />
            Row Level Security (RLS) Status
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#141416] border border-[#303036] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#FAFAFA]">Database Table Protection</p>
                <p className="text-[#A1A1AA] text-[11px] mt-0.5">
                  Enforced on profiles, employees, application_letters, letter_versions, audit_logs.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-green-950/50 border border-green-800 text-green-400 font-mono text-[11px]">
                Active & Enforced
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#141416] border border-[#303036] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#FAFAFA]">Private Storage Isolation</p>
                <p className="text-[#A1A1AA] text-[11px] mt-0.5">
                  employee-photos and employee-documents are private buckets accessible exclusively via short-lived signed URLs.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-green-950/50 border border-green-800 text-green-400 font-mono text-[11px]">
                Private / Signed Only
              </span>
            </div>
          </div>
        </div>

        {/* Passwords & Entropy */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#FAFAFA] flex items-center gap-2 border-b border-[#303036] pb-3">
            <Key className="h-4 w-4 text-[#E50914]" />
            Credential Generation Standard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#141416] border border-[#303036]">
              <p className="text-[#A1A1AA]">Entropy Length</p>
              <p className="font-semibold text-sm text-[#FAFAFA] mt-1">16 Characters (Crypto-Random)</p>
            </div>
            <div className="p-3 rounded-lg bg-[#141416] border border-[#303036]">
              <p className="text-[#A1A1AA]">First-Login Requirement</p>
              <p className="font-semibold text-sm text-[#FAFAFA] mt-1">Forced Password Rotation</p>
            </div>
            <div className="p-3 rounded-lg bg-[#141416] border border-[#303036]">
              <p className="text-[#A1A1AA]">Session Revocation</p>
              <p className="font-semibold text-sm text-[#FAFAFA] mt-1">Immediate on Suspension</p>
            </div>
            <div className="p-3 rounded-lg bg-[#141416] border border-[#303036]">
              <p className="text-[#A1A1AA]">Database Password Storage</p>
              <p className="font-semibold text-sm text-[#FAFAFA] mt-1">Zero Plaintext (Supabase Auth Hash)</p>
            </div>
          </div>
        </div>

        {/* Agency Branding Details */}
        <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#FAFAFA] flex items-center gap-2 border-b border-[#303036] pb-3">
            <Server className="h-4 w-4 text-[#E50914]" />
            Agency Corporate Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[#A1A1AA]">Agency Brand</p>
              <p className="font-bold text-sm text-[#E50914] mt-1">ORSA</p>
            </div>
            <div>
              <p className="text-[#A1A1AA]">Primary Palette</p>
              <p className="font-mono text-sm text-[#FAFAFA] mt-1">#09090B (Black) / #E50914 (Red)</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
