import { cn } from '@/lib/utils'
import type { AccountStatus, ApplicationStatus, LetterStatus } from '@/types/database'

// ─── Application Status ─────────────────────────────────────────────────────

const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/40',
  },
  under_review: {
    label: 'Under Review',
    className: 'bg-blue-900/30 text-blue-400 border border-blue-800/40',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-900/30 text-green-400 border border-green-800/40',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-900/30 text-[#E50914] border border-red-800/40',
  },
  withdrawn: {
    label: 'Withdrawn',
    className: 'bg-zinc-800/60 text-[#A1A1AA] border border-[#303036]',
  },
}

// ─── Account Status ──────────────────────────────────────────────────────────

const ACCOUNT_STATUS_CONFIG: Record<
  AccountStatus,
  { label: string; className: string }
> = {
  active: {
    label: 'Active',
    className: 'bg-green-900/30 text-green-400 border border-green-800/40',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/40',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-red-900/30 text-[#E50914] border border-red-800/40',
  },
}

// ─── Letter Status ───────────────────────────────────────────────────────────

const LETTER_STATUS_CONFIG: Record<
  LetterStatus,
  { label: string; className: string }
> = {
  not_created: {
    label: 'Not Created',
    className: 'bg-zinc-800/60 text-[#A1A1AA] border border-[#303036]',
  },
  draft: {
    label: 'Draft',
    className: 'bg-blue-900/30 text-blue-400 border border-blue-800/40',
  },
  ready_for_review: {
    label: 'Ready for Review',
    className: 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/40',
  },
  issued: {
    label: 'Issued',
    className: 'bg-green-900/30 text-green-400 border border-green-800/40',
  },
  superseded: {
    label: 'Superseded',
    className: 'bg-zinc-800/60 text-[#A1A1AA] border border-[#303036]',
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function ApplicationStatusBadge({
  status,
  className,
}: ApplicationStatusBadgeProps) {
  const config = APPLICATION_STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-zinc-800/60 text-[#A1A1AA] border border-[#303036]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

interface AccountStatusBadgeProps {
  status: AccountStatus
  className?: string
}

export function AccountStatusBadge({ status, className }: AccountStatusBadgeProps) {
  const config = ACCOUNT_STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-zinc-800/60 text-[#A1A1AA] border border-[#303036]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

interface LetterStatusBadgeProps {
  status: LetterStatus
  className?: string
}

export function LetterStatusBadge({ status, className }: LetterStatusBadgeProps) {
  const config = LETTER_STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-zinc-800/60 text-[#A1A1AA] border border-[#303036]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

export function StatusBadge({
  type,
  status,
  className,
}: {
  type: 'application' | 'account' | 'letter'
  status: any
  className?: string
}) {
  if (type === 'application') {
    return <ApplicationStatusBadge status={status as ApplicationStatus} className={className} />
  }
  if (type === 'account') {
    return <AccountStatusBadge status={status as AccountStatus} className={className} />
  }
  return <LetterStatusBadge status={status as LetterStatus} className={className} />
}
