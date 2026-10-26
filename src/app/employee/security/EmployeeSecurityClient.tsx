'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, KeyRound, CheckCircle2, AlertTriangle } from 'lucide-react'
import { changePassword } from '@/app/actions/auth'

export default function EmployeeSecurityClient({ mustChange }: { mustChange: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)

    const payload = {
      current_password: formData.get('current_password') as string,
      new_password: formData.get('new_password') as string,
      confirm_password: formData.get('confirm_password') as string,
    }

    startTransition(async () => {
      const res = await changePassword(payload)
      if (!res.success) {
        setMessage({ type: 'error', text: res.error || 'Failed to update password.' })
      } else {
        setMessage({
          type: 'success',
          text: 'Password updated successfully! Your temporary password has been permanently retired.',
        })
        const form = e.target as HTMLFormElement
        form.reset()
        router.refresh()
      }
    })
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">Account Security</h1>
        <p className="text-sm text-[#A1A1AA]">
          Manage your login credentials and private access password.
        </p>
      </div>

      {mustChange && (
        <div className="p-4 rounded-xl border border-yellow-500/40 bg-yellow-950/30 text-yellow-300 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold">Mandatory First-Login Password Change</p>
            <p className="text-[11px] text-yellow-400 mt-0.5">
              You must set a new confidential password before navigating other modules.
            </p>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-950/40 border-green-500/40 text-green-400'
              : 'bg-red-950/40 border-red-500/40 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="rounded-xl border border-[#303036] bg-[#1D1D20] p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A1A1AA] mb-1.5 font-medium">Current (Temporary) Password</label>
            <input
              type="password"
              name="current_password"
              required
              placeholder="••••••••••••"
              className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <div>
            <label className="block text-[#A1A1AA] mb-1.5 font-medium">New Password</label>
            <input
              type="password"
              name="new_password"
              required
              placeholder="At least 8 chars, 1 uppercase, 1 number, 1 symbol"
              className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <div>
            <label className="block text-[#A1A1AA] mb-1.5 font-medium">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              required
              placeholder="Repeat new password"
              className="w-full rounded-lg bg-[#141416] border border-[#303036] px-3.5 py-2 text-[#FAFAFA] focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-lg bg-[#E50914] text-xs font-semibold text-white hover:bg-[#B91C1C] transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-[#E50914]/20"
            >
              {isPending ? 'Updating Password...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
