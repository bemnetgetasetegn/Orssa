'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { RegistrationTrendPoint, JobOfferDistribution } from '@/types/database'

const DONUT_COLORS = ['#E50914', '#B91C1C', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899']

interface Props {
  trend: RegistrationTrendPoint[]
  distribution: JobOfferDistribution[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm shadow-xl"
      style={{ backgroundColor: '#1D1D20', border: '1px solid #303036', color: '#FAFAFA' }}
    >
      <p style={{ color: '#A1A1AA' }}>{label}</p>
      <p className="font-bold">{payload[0].value} registrations</p>
    </div>
  )
}

export default function DashboardCharts({ trend, distribution }: Props) {
  // Format dates for display
  const trendData = trend.map((p) => ({
    ...p,
    displayDate: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Registration Trend — Line chart */}
      <div
        className="xl:col-span-2 rounded-xl p-5"
        style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
      >
        <h2 className="font-semibold mb-4" style={{ color: '#FAFAFA' }}>
          Registration Trend (Last 90 Days)
        </h2>
        {trendData.length === 0 ? (
          <p className="text-sm py-16 text-center" style={{ color: '#A1A1AA' }}>
            No registration data yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#303036" />
              <XAxis
                dataKey="displayDate"
                tick={{ fill: '#A1A1AA', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#303036' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#A1A1AA', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#E50914"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#E50914' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Job Offer Distribution — Donut */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: '#1D1D20', border: '1px solid #303036' }}
      >
        <h2 className="font-semibold mb-4" style={{ color: '#FAFAFA' }}>
          Job Offer Distribution
        </h2>
        {distribution.length === 0 ? (
          <p className="text-sm py-16 text-center" style={{ color: '#A1A1AA' }}>
            No data yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={distribution}
                dataKey="count"
                nameKey="job_offer"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {distribution.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: '#A1A1AA', fontSize: 11 }}>{value}</span>
                )}
              />
              <Tooltip
                formatter={(value: any, name: any) => [value, name]}
                contentStyle={{
                  backgroundColor: '#1D1D20',
                  border: '1px solid #303036',
                  borderRadius: 8,
                  color: '#FAFAFA',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
