'use client'

import { formatCurrency } from '@/lib/format'
import { categoryStyle } from '@/lib/categoryStyles'
import type { CategoryBudgetRow } from '@/lib/categoryBudgets'
import '@/components/spending/spending-charts.css'

type Props = {
  rows: CategoryBudgetRow[]
  totalSpent: number
  totalLimit: number
  balancesVisible: boolean
}

export function DashboardCategoryBudgets({ rows, totalSpent, totalLimit, balancesVisible }: Props) {
  const pct = totalLimit > 0 ? Math.min(100, Math.round((totalSpent / totalLimit) * 100)) : 0
  const top = rows.filter((r) => r.limit > 0).slice(0, 3)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>Category budgets</p>
          <p style={{ margin: '2px 0 0', fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>
            {balancesVisible ? formatCurrency(totalSpent) : '••••••'}
            <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500, marginLeft: 6 }}>
              / {balancesVisible ? formatCurrency(totalLimit) : '••••'} budgeted
            </span>
          </p>
        </div>
        <div className="tx-icon" style={{ background: 'var(--red-light)' }}>📊</div>
      </div>
      <div className="goal-bar" style={{ background: '#fde2df', height: 8 }}>
        <div className="goal-bar-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ef4444, #f87171)' }} />
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--muted)' }}>
        {pct}% of category budgets used this month
      </p>
      {balancesVisible && top.length > 0 ? (
        <div className="dashboard-budget-strip">
          {top.map((row) => {
            const style = categoryStyle(row.category)
            return (
              <div key={row.category} className="dashboard-budget-row">
                <span className="label">{row.category}</span>
                <div className="category-budget-bar">
                  <div
                    className={'category-budget-bar-fill' + (row.over ? ' over' : '')}
                    style={{
                      width: `${row.limit > 0 ? Math.min(100, Math.round((row.spent / row.limit) * 100)) : 0}%`,
                      background: row.over ? undefined : style.color,
                    }}
                  />
                </div>
                <span className="amt">{formatCurrency(row.spent)}</span>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
