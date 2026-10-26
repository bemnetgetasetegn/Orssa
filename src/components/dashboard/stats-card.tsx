import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  change?: {
    value: number  // positive = up, negative = down
    label?: string // e.g. "vs last month"
  }
  description?: string
  loading?: boolean
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = '#E50914',
  change,
  description,
  loading = false,
  className,
}: StatsCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'rounded-xl border border-[#303036] p-5 animate-pulse',
          className,
        )}
        style={{ backgroundColor: '#1D1D20' }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 rounded bg-[#303036]" />
            <div className="h-8 w-16 rounded bg-[#303036]" />
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#303036]" />
        </div>
        <div className="mt-4 h-3 w-32 rounded bg-[#303036]" />
      </div>
    )
  }

  const isPositiveChange = change && change.value >= 0

  return (
    <div
      className={cn(
        'rounded-xl border border-[#303036] p-5 transition-colors hover:border-[#E50914]/30',
        className,
      )}
      style={{ backgroundColor: '#1D1D20' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#A1A1AA] truncate">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-[#FAFAFA]">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>

        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
      </div>

      {(change || description) && (
        <div className="mt-4 flex items-center gap-2">
          {change && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                isPositiveChange ? 'text-green-400' : 'text-[#E50914]',
              )}
            >
              {isPositiveChange ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>
                {isPositiveChange ? '+' : ''}
                {change.value}%
              </span>
            </div>
          )}

          {description && (
            <p className="text-xs text-[#A1A1AA] truncate">{description}</p>
          )}

          {change?.label && (
            <p className="text-xs text-[#A1A1AA] truncate">{change.label}</p>
          )}
        </div>
      )}
    </div>
  )
}
