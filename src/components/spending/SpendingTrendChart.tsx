'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/format'
import type { TrendBucket } from '@/lib/transactions'
import './spending-charts.css'

type Props = {
  data: TrendBucket[]
}

export function SpendingTrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="spending-chart-card">
        <h3>Spending vs income</h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>Not enough data yet.</p>
      </div>
    )
  }

  return (
    <div className="spending-chart-card">
      <h3>Spending vs income</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="spending" name="Spending" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
