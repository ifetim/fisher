'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/format'
import { categoryStyle } from '@/lib/categoryStyles'
import type { CategoryBudgetRow } from '@/lib/categoryBudgets'
import './spending-charts.css'

type Props = {
  rows: CategoryBudgetRow[]
  onSetLimit: (category: string, limit: number) => void
}

export function CategoryBudgetsPanel({ rows, onSetLimit }: Props) {
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const visible = rows.filter((r) => r.limit > 0 || r.spent > 0)

  function startEdit(category: string, limit: number) {
    setEditing(category)
    setDraft(String(limit))
  }

  function commitEdit(category: string) {
    const n = parseFloat(draft)
    if (!Number.isNaN(n)) onSetLimit(category, n)
    setEditing(null)
  }

  return (
    <div className="category-budgets-panel">
      {visible.map((row) => {
        const style = categoryStyle(row.category)
        const barColor = row.over ? undefined : style.color
        return (
          <div key={row.category} className={'category-budget-row' + (row.over ? ' is-over' : '')}>
            <div className="category-budget-meta">
              <span className="name">{row.category}</span>
              {row.over ? <span className="category-budget-pill">Over</span> : null}
            </div>
            <span className="category-budget-spent">
              {formatCurrency(row.spent)}
              {row.limit > 0 ? ` / ${formatCurrency(row.limit)}` : ''}
            </span>
            <div className="category-budget-limit">
              <div className="category-budget-bar">
                <div
                  className={'category-budget-bar-fill' + (row.over ? ' over' : '')}
                  style={{
                    width: `${row.limit > 0 ? Math.min(100, Math.round((row.spent / row.limit) * 100)) : 0}%`,
                    background: barColor,
                  }}
                />
              </div>
              {editing === row.category ? (
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={draft}
                  autoFocus
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => commitEdit(row.category)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit(row.category)
                    if (e.key === 'Escape') setEditing(null)
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="eye-btn dark"
                  style={{ fontSize: 11, padding: '2px 8px' }}
                  onClick={() => startEdit(row.category, row.limit)}
                  title="Edit monthly budget"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
