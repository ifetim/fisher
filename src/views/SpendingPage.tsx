'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets'
import { getAccountsForUser } from '@/data'
import {
  filterTransactions,
  spendingByCategory,
  spendingVsIncomeTrend,
} from '@/lib/transactions'
import { formatCurrency } from '@/lib/format'
import { categoryStyle } from '@/lib/categoryStyles'
import { PlaidConnect } from '@/components/plaid/PlaidConnect'
import { CategoryBreakdownChart } from '@/components/spending/CategoryBreakdownChart'
import { SpendingTrendChart } from '@/components/spending/SpendingTrendChart'
import { CategoryBudgetsPanel } from '@/components/spending/CategoryBudgetsPanel'
import '@/components/spending/spending-charts.css'

const PAGE_SIZE = 20

export function SpendingPage() {
  const { user } = useAuth()
  const { transactions, plaidConnected, plaidSnapshot } = useFinance()
  const { rows: budgetRows, setLimit } = useCategoryBudgets()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')

  const accountsCount = plaidConnected
    ? (plaidSnapshot?.accounts.length ?? 0)
    : user
      ? getAccountsForUser(user.id).length
      : 0

  const filtered = useMemo(
    () =>
      filterTransactions(transactions, {
        accountId: 'all',
        period: 'month',
        category: categoryFilter,
      }),
    [transactions, categoryFilter],
  )

  const monthAll = useMemo(
    () => filterTransactions(transactions, { accountId: 'all', period: 'month', category: 'all' }),
    [transactions],
  )

  const breakdown = useMemo(() => spendingByCategory(monthAll), [monthAll])
  const trend = useMemo(() => spendingVsIncomeTrend(monthAll, 'week'), [monthAll])

  const totalSpent = monthAll.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalIncome = monthAll.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const net = totalIncome - totalSpent

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const t of filtered.slice(0, visibleCount)) {
      const d = new Date(t.date + 'T00:00:00')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const yest = new Date(today)
      yest.setDate(yest.getDate() - 1)
      let label: string
      if (d.toDateString() === today.toDateString()) label = 'Today'
      else if (d.toDateString() === yest.toDateString()) label = 'Yesterday'
      else label = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })

      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(t)
    }
    return [...map.entries()]
  }, [filtered, visibleCount])

  const hasMore = filtered.length > visibleCount

  if (!user) return null

  const netColor = net >= 0 ? 'var(--green)' : 'var(--red)'

  return (
    <div>
      <div className="screen-header">
        <div className="greeting">
          <p>{new Date().toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}</p>
          <h1>Spending</h1>
        </div>
        {categoryFilter !== 'all' ? (
          <button type="button" className="eye-btn dark" onClick={() => setCategoryFilter('all')}>
            Clear filter · {categoryFilter}
          </button>
        ) : null}
      </div>

      <div className="summary-chips">
        <div className="chip red">
          <p className="chip-label">SPENT</p>
          <p className="chip-amount">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="chip green">
          <p className="chip-label">INCOME</p>
          <p className="chip-amount">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="chip purple">
          <p className="chip-label">NET</p>
          <p className="chip-amount" style={{ color: netColor }}>
            {net >= 0 ? '+' : ''}
            {formatCurrency(net)}
          </p>
        </div>
        <div className="chip neutral">
          <p className="chip-label">ACCOUNTS</p>
          <p className="chip-amount">{accountsCount}</p>
        </div>
      </div>

      <div className="spending-charts">
        <CategoryBreakdownChart
          data={breakdown}
          activeCategory={categoryFilter}
          onSelectCategory={setCategoryFilter}
        />
        <SpendingTrendChart data={trend} />
      </div>

      <PlaidConnect />

      <div className="grid cols-12">
        <div>
          <div className="section-label">
            <span>Recent transactions{categoryFilter !== 'all' ? ` · ${categoryFilter}` : ''}</span>
          </div>
          {grouped.map(([day, txs]) => (
            <div key={day}>
              <p className="day-label">{day}</p>
              <div className="card" style={{ marginBottom: 8 }}>
                {txs.map((tx) => {
                  const s = categoryStyle(tx.category)
                  const pos = tx.amount > 0
                  return (
                    <div className="card-row tx-row" key={tx.id}>
                      <div className="tx-icon" style={{ background: s.bg }}>
                        {s.icon}
                      </div>
                      <div className="tx-meta">
                        <p className="merchant">{tx.merchant}</p>
                        <p className="cat">{tx.category}</p>
                      </div>
                      <span className={'tx-amount' + (pos ? ' pos' : '')}>
                        {pos ? '+' : '−'}${Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {hasMore ? (
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
              <span style={{ color: 'var(--muted)', marginLeft: 6, fontWeight: 500 }}>
                ({filtered.length - visibleCount} remaining)
              </span>
            </button>
          ) : null}
        </div>

        <div>
          <div className="section-label">
            <span>Category budgets</span>
            <span className="action" style={{ cursor: 'default', opacity: 0.7 }}>
              Tap Edit to adjust
            </span>
          </div>
          <div className="card card-pad">
            <CategoryBudgetsPanel rows={budgetRows} onSetLimit={setLimit} />
          </div>
        </div>
      </div>
    </div>
  )
}
