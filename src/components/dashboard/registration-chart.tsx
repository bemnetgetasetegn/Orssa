'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import type { RegistrationTrendPoint } from '@/types/database'

type Period = 'week' | 'month' | 'year'

interface RegistrationChartProps {
  data: RegistrationTrendPoint[]
  loading?: boolean
}

const PERIOD_LABELS: Record<Period, string> = {
  week: 'Week',
  month: 'Month',
  year: 'Year',
}

function formatDate(dateStr: string, period: Period): string {
  const date = new Date(dateStr)
  if (period === 'week') {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }
  if (period === 'month') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border border-[#303036] px-3 py-2 text-sm shadow-xl"
      style={{ backgroundColor: '#1D1D20' }}
    >
      <p className="text-[#A1A1AA] mb-1">{label}</p>
      <p className="font-semibold text-[#FAFAFA]">
        {payload[0].value} registrations
      </p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-7 w-16 rounded-md bg-[#303036]" />
        ))}
      </div>
      <div className="h-[220px] rounded-lg bg-[#303036]/40" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#303036]">
      <p className="text-sm font-medium text-[#A1A1AA]">No registration data</p>
      <p className="text-xs text-[#A1A1AA]/60">
        Data will appear once employees are registered
      </p>
    </div>
  )
}

export function RegistrationChart({ data, loading = false }: RegistrationChartProps) {
  const [period, setPeriod] = useState<Period>('month')
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  const formattedData = data.map((point) => ({
    ...point,
    label: formatDate(point.date, period),
  }))

  const hasData = data.length > 0

  return (
    <div
      className="rounded-xl border border-[#303036] p-5"
      style={{ backgroundColor: '#1D1D20' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#FAFAFA]">
            Employee Registrations
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-0.5">New registrations over time</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart type toggle */}
          <div className="flex rounded-lg border border-[#303036] overflow-hidden">
            {(['line', 'bar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  chartType === type
                    ? 'bg-[#E50914] text-white'
                    : 'text-[#A1A1AA] hover:bg-[#303036]/40 hover:text-[#FAFAFA]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Period toggle */}
          <div className="flex rounded-lg border border-[#303036] overflow-hidden">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  period === p
                    ? 'bg-[#E50914] text-white'
                    : 'text-[#A1A1AA] hover:bg-[#303036]/40 hover:text-[#FAFAFA]'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <LoadingSkeleton />
      ) : !hasData ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          {chartType === 'line' ? (
            <LineChart data={formattedData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#303036" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#A1A1AA', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#A1A1AA', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#E50914"
                strokeWidth={2}
                dot={{ fill: '#E50914', strokeWidth: 0, r: 3 }}
                activeDot={{ fill: '#E50914', stroke: '#E50914', strokeWidth: 4, r: 5 }}
              />
            </LineChart>
          ) : (
            <BarChart data={formattedData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#303036" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#A1A1AA', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#A1A1AA', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="#E50914"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  )
}
