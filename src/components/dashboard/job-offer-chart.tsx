'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, type TooltipProps } from 'recharts'
import type { JobOfferDistribution } from '@/types/database'

interface JobOfferChartProps {
  data: JobOfferDistribution[]
  loading?: boolean
}

// Red-family palette for slices
const COLORS = [
  '#E50914',
  '#B91C1C',
  '#7F1D1D',
  '#991B1B',
  '#DC2626',
  '#EF4444',
  '#F87171',
]

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div
      className="rounded-lg border border-[#303036] px-3 py-2 text-sm shadow-xl"
      style={{ backgroundColor: '#1D1D20' }}
    >
      <p className="font-medium text-[#FAFAFA]">{entry.name}</p>
      <p className="text-[#A1A1AA]">
        {entry.value} employees ({(entry.payload as JobOfferDistribution).percentage}%)
      </p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="h-[200px] w-[200px] rounded-full bg-[#303036]/40" />
      <div className="space-y-2 w-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#303036]" />
            <div className="h-3 flex-1 rounded bg-[#303036]" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#303036]">
      <p className="text-sm font-medium text-[#A1A1AA]">No distribution data</p>
      <p className="text-xs text-[#A1A1AA]/60">
        Assign job offers to employees to see distribution
      </p>
    </div>
  )
}

// Custom label rendered in center of donut
function CenterLabel({ total }: { total: number }) {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
      <tspan x="50%" dy="-0.4em" className="fill-[#FAFAFA]" style={{ fill: '#FAFAFA', fontSize: 28, fontWeight: 700 }}>
        {total}
      </tspan>
      <tspan x="50%" dy="1.5em" style={{ fill: '#A1A1AA', fontSize: 11 }}>
        employees
      </tspan>
    </text>
  )
}

export function JobOfferChart({ data, loading = false }: JobOfferChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const hasData = data.length > 0

  return (
    <div
      className="rounded-xl border border-[#303036] p-5"
      style={{ backgroundColor: '#1D1D20' }}
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#FAFAFA]">
          Job Offer Distribution
        </h2>
        <p className="text-xs text-[#A1A1AA] mt-0.5">Employees by job offer type</p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : !hasData ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col items-center gap-5">
          {/* Donut chart */}
          <div className="relative w-full" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="job_offer"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {/* Center label injected via foreignObject equivalent using SVG text */}
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
                  <tspan
                    x="50%"
                    dy="-0.4em"
                    style={{ fill: '#FAFAFA', fontSize: 28, fontWeight: 700 }}
                  >
                    {total.toLocaleString()}
                  </tspan>
                  <tspan
                    x="50%"
                    dy="1.6em"
                    style={{ fill: '#A1A1AA', fontSize: 11 }}
                  >
                    total
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2">
            {data.map((item, idx) => (
              <div key={item.job_offer} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-xs text-[#A1A1AA] truncate">{item.job_offer}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-medium text-[#FAFAFA]">{item.count}</span>
                  <span className="text-xs text-[#A1A1AA]">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
