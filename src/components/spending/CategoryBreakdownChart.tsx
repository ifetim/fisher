'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/format'
import { categoryChartColor } from '@/lib/categoryStyles'
import type { CategorySlice } from '@/lib/transactions'
import './spending-charts.css'

type Props = {
  data: CategorySlice[]
  activeCategory: string | 'all'
  onSelectCategory: (category: string | 'all') => void
}

export function CategoryBreakdownChart({ data, activeCategory, onSelectCategory }: Props) {
  const total = data.reduce((s, d) => s + d.total, 0)

  if (data.length === 0) {
    return (
      <div className="spending-chart-card">
        <h3>Spending breakdown</h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>No spending this period yet.</p>
      </div>
    )
  }

  return (
    <div className="spending-chart-card">
      <h3>Spending breakdown</h3>
      <div style={{ position: 'relative', width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              onClick={(_, index) => {
                const cat = data[index]?.category
                if (cat) onSelectCategory(activeCategory === cat ? 'all' : cat)
              }}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.category}
                  fill={categoryChartColor(entry.category, i)}
                  opacity={activeCategory === 'all' || activeCategory === entry.category ? 1 : 0.35}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: 10,
                border: '1px solid var(--border)',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          className="spending-donut-center"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p>Total spent</p>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
        {data.slice(0, 5).map((d, i) => (
          <button
            key={d.category}
            type="button"
            className={'chart-legend-item' + (activeCategory === d.category ? ' is-active' : '')}
            onClick={() => onSelectCategory(activeCategory === d.category ? 'all' : d.category)}
          >
            <span className="chart-legend-dot" style={{ background: categoryChartColor(d.category, i) }} />
            {d.category} · {formatCurrency(d.total)}
          </button>
        ))}
      </div>
    </div>
  )
}
