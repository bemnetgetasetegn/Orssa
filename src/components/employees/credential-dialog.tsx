'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react'
import type { CredentialResponse } from '@/types/database'
import { cn } from '@/lib/utils'

interface CredentialDialogProps {
  open: boolean
  onClose: () => void
  credentials: CredentialResponse
}

type CopiedField = 'email' | 'password' | 'url' | 'all' | null

function CopyableField({
  label,
  value,
  fieldKey,
  copiedField,
  onCopy,
  masked,
  showMask,
  onToggleMask,
}: {
  label: string
  value: string
  fieldKey: CopiedField
  copiedField: CopiedField
  onCopy: (field: CopiedField, value: string) => void
  masked?: boolean
  showMask?: boolean
  onToggleMask?: () => void
}) {
  const isCopied = copiedField === fieldKey
  const displayValue = masked && showMask ? '••••••••••••' : value

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-[#303036] bg-[#09090B] px-3 py-2">
        <span className="flex-1 text-sm font-mono text-[#FAFAFA] truncate">
          {displayValue}
        </span>
        {masked && onToggleMask && (
          <button
            onClick={onToggleMask}
            className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors flex-shrink-0"
            aria-label={showMask ? 'Show password' : 'Hide password'}
          >
            {showMask ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
        <button
          onClick={() => onCopy(fieldKey, value)}
          className={cn(
            'flex-shrink-0 transition-colors',
            isCopied ? 'text-green-400' : 'text-[#A1A1AA] hover:text-[#FAFAFA]',
          )}
          aria-label={`Copy ${label}`}
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

export function CredentialDialog({
  open,
  onClose,
  credentials,
}: CredentialDialogProps) {
  const [copiedField, setCopiedField] = useState<CopiedField>(null)
  const [passwordHidden, setPasswordHidden] = useState(false)

  // Ensure the login URL dynamically matches the exact origin and port of the active browser
  const activeLoginUrl = useMemo(() => {
    if (typeof window !== 'undefined' && credentials?.login_url) {
      try {
        const url = new URL(credentials.login_url)
        // If it's a localhost/dev URL, align with the active browser port (e.g. 3000, 3001)
        if (url.hostname.includes('localhost') || url.hostname === '127.0.0.1') {
          const port = window.location.port ? `:${window.location.port}` : ''
          const proto = window.location.protocol
          // Determine target subdomain: employee or admin
          const isCandidate = credentials.employee_code && credentials.employee_code !== 'N/A'
          const targetHost = isCandidate ? `employee.localhost${port}` : `admin.localhost${port}`
          return `${proto}//${targetHost}${url.pathname}${url.search}`
        }
      } catch {}
    }
    return credentials?.login_url || ''
  }, [credentials?.login_url, credentials?.employee_code])

  const copyToClipboard = async (field: CopiedField, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = value
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const copyAll = async () => {
    const allText = [
      `Employee: ${credentials.employee_name}`,
      `Employee Code: ${credentials.employee_code}`,
      `Email: ${credentials.email}`,
      `Password: ${credentials.temporary_password}`,
      `Login URL: ${activeLoginUrl}`,
    ].join('\n')
    await copyToClipboard('all', allText)
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md border border-[#303036]"
        style={{ backgroundColor: '#1D1D20', color: '#FAFAFA' }}
      >
        {/* Warning banner */}
        <div className="flex items-start gap-3 rounded-lg border border-[#E50914]/40 bg-[#E50914]/10 px-4 py-3 -mx-1">
          <AlertTriangle className="h-5 w-5 text-[#E50914] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#E50914]">
              Save these credentials now
            </p>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              The password will <strong className="text-[#FAFAFA]">not</strong> be shown
              again after you close this dialog.
            </p>
          </div>
        </div>

        <DialogHeader className="mt-2">
          <DialogTitle className="text-[#FAFAFA]">
            Employee Credentials Created
          </DialogTitle>
          <p className="text-sm text-[#A1A1AA]">
            Account created for{' '}
            <span className="font-medium text-[#FAFAFA]">
              {credentials.employee_name}
            </span>{' '}
            <span className="text-[#A1A1AA]">({credentials.employee_code})</span>
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <CopyableField
            label="Email"
            value={credentials.email}
            fieldKey="email"
            copiedField={copiedField}
            onCopy={copyToClipboard}
          />

          <CopyableField
            label="Temporary Password"
            value={credentials.temporary_password}
            fieldKey="password"
            copiedField={copiedField}
            onCopy={copyToClipboard}
            masked
            showMask={passwordHidden}
            onToggleMask={() => setPasswordHidden((v) => !v)}
          />

          <CopyableField
            label="Login URL"
            value={activeLoginUrl}
            fieldKey="url"
            copiedField={copiedField}
            onCopy={copyToClipboard}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            <Button
              onClick={copyAll}
              variant="outline"
              className={cn(
                'flex-1 border-[#303036] bg-transparent transition-colors',
                copiedField === 'all'
                  ? 'border-green-600 text-green-400'
                  : 'text-[#A1A1AA] hover:bg-[#303036]/40 hover:text-[#FAFAFA]',
              )}
            >
              {copiedField === 'all' ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copy All Credentials
                </>
              )}
            </Button>

            <Button
              onClick={() => window.open(activeLoginUrl, '_blank')}
              variant="outline"
              className="border-[#303036] bg-transparent text-[#A1A1AA] hover:bg-[#303036]/40 hover:text-[#FAFAFA]"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-[#E50914] hover:bg-[#B91C1C] text-white"
          >
            Done — I've saved the credentials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
