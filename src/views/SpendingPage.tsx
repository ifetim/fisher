'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import {
  filterTransactions,
  getUniqueCategories,
  spendingByCategory,
  type PeriodPreset,
} from '@/lib/transactions'
import { formatAmountWhole } from '@/lib/v3Format'
import { V3Icons, V3StatusBar } from '@/components/v3/V3Icons'
import { PlaidBanner } from '@/components/v3/PlaidBanner'
import { txV3Icon, categoryBarTone } from '@/lib/txV3Icon'
import { currentMonthLabel, priorMonthName, spendingVsPriorMonth } from '@/lib/v3MonthStats'
import './SpendingPage.css'

const CAT_COLORS = ['#d4922a', '#2a9d8f', '#c9472a', '#1c2b6b', '#6b7387', '#e8a83a', '#4a7c59', '#8b5cf6']

const PAGE_SIZE = 20

type Period = PeriodPreset | 'all'

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'threeMonths', label: 'Last 3 months' },
  { value: 'month', label: 'This month' },
  { value: 'lastMonth', label: 'Last month' },
  { value: 'week', label: 'Last 7 days' },
]

function periodLabel(p: Period): string {
  return PERIOD_OPTIONS.find((o) => o.value === p)?.label ?? 'This month'
}

export function SpendingPage() {
  const { user } = useAuth()
  const { transactions } = useFinance()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [period, setPeriod] = useState<Period>('month')
  const [category, setCategory] = useState<string>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filterOpen) return
    function onClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [filterOpen])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [period, category])

  const filtered = useMemo(() => {
    if (period === 'all') {
      return transactions
        .filter((t) => category === 'all' || t.category === category)
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
    }
    return filterTransactions(transactions, {
      accountId: 'all',
      period,
      category,
    }).slice().sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, period, category])

  const categoryOptions = useMemo(() => getUniqueCategories(transactions), [transactions])

  const breakdown = useMemo(() => spendingByCategory(filtered), [filtered])
  const maxCat = breakdown[0]?.total ?? 1

  const totalSpent = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalIncome = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const net = totalIncome - totalSpent
  const vsPrior = spendingVsPriorMonth(transactions)

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
      else label = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })

      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(t)
    }
    return [...map.entries()]
  }, [filtered, visibleCount])

  const hasMore = filtered.length > visibleCount

  const cats = breakdown.map((c) => ({
    name: c.category,
    val: Math.round(c.total),
    pct: Math.round((c.total / maxCat) * 100),
    tone: categoryBarTone(c.category),
  }))

  const filtersActive = period !== 'month' || category !== 'all'
  const headerSubtitle =
    period === 'month' ? currentMonthLabel() : periodLabel(period)

  if (!user) return null

  return (
    <div>
      <V3StatusBar />
      <div className="screen-head">
        <div>
          <p className="greet">{headerSubtitle}</p>
          <h1>Spending</h1>
        </div>

        <div className="spending-filter" ref={filterRef}>
          <button
            type="button"
            className={`btn ghost${filtersActive ? ' spending-filter__btn--active' : ''}`}
            onClick={() => setFilterOpen((o) => !o)}
            aria-expanded={filterOpen}
          >
            {V3Icons.filter} Filter
            {filtersActive ? <span className="spending-filter__dot" aria-hidden /> : null}
          </button>

          {filterOpen ? (
            <div className="spending-filter__panel" role="dialog" aria-label="Filter transactions">
              <div className="spending-filter__group">
                <p className="spending-filter__label">Time period</p>
                <div className="spending-filter__chips">
                  {PERIOD_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`spending-filter__chip${period === opt.value ? ' is-on' : ''}`}
                      onClick={() => setPeriod(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="spending-filter__group">
                <p className="spending-filter__label">Category</p>
                <select
                  className="spending-filter__select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All categories</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="spending-filter__footer">
                <button
                  type="button"
                  className="spending-filter__reset"
                  onClick={() => {
                    setPeriod('month')
                    setCategory('all')
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="spending-filter__done"
                  onClick={() => setFilterOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="hero">
        <div className="label-row">
          <span className="label">Total Spent · {headerSubtitle}</span>
        </div>
        <div className="amount">
          ${formatAmountWhole(totalSpent)}
          <span className="cents">.00</span>
        </div>
        <div>
          <span className="delta">
            {V3Icons.up} +${formatAmountWhole(totalIncome)} income
          </span>
          <span className="delta">
            {net >= 0 ? V3Icons.up : V3Icons.down}{' '}
            {net >= 0 ? '+' : '−'}${formatAmountWhole(Math.abs(net))} net
          </span>
          {vsPrior !== null && (
            <span className="delta">
              {vsPrior <= 0 ? V3Icons.up : V3Icons.down} {Math.abs(vsPrior)}% vs {priorMonthName()}
            </span>
          )}
        </div>
      </div>

      <PlaidBanner />

      <div className="grid cols-12">
        <div>
          <div className="sec">
            <span className="lbl">
              {period === 'all' ? 'All transactions' : 'Transactions'}
              {filtered.length > 0 ? ` · ${filtered.length}` : ''}
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="spending-page__empty">
              No transactions for {periodLabel(period).toLowerCase()}
              {category !== 'all' ? ` in ${category}` : ''}.
            </p>
          ) : null}

          {grouped.map(([day, txs]) => (
            <div key={day}>
              <p className="tx-day">{day}</p>
              <div className="card" style={{ marginBottom: 8 }}>
                {txs.map((tx) => {
                  const { ico, svg } = txV3Icon(tx.category, tx.amount)
                  const pos = tx.amount > 0
                  return (
                    <div className="tx" key={tx.id}>
                      <div className={`ico ${ico}`.trim()}>{svg}</div>
                      <div className="meta">
                        <p className="merch">{tx.merchant}</p>
                        <p className="cat">{tx.category}</p>
                      </div>
                      <span className={`amt${pos ? ' pos' : ''}`}>
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
              className="btn ghost block"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              Show more ({filtered.length - visibleCount} left)
            </button>
          ) : null}
        </div>

        <div>
          <div className="sec">
            <span className="lbl">By category</span>
          </div>
          <div className="card pad">
            {cats.length === 0 ? (
              <p className="spending-page__empty" style={{ padding: '2rem 0' }}>No spending in this period.</p>
            ) : (
              <>
                {/* Donut chart */}
                <div style={{ position: 'relative', width: '100%', height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cats}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={2}
                        dataKey="val"
                        strokeWidth={0}
                      >
                        {cats.map((_, i) => (
                          <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: number) => [`$${formatAmountWhole(val)}`, '']}
                        contentStyle={{ borderRadius: 12, border: '1px solid rgba(28,43,107,0.1)', fontSize: 12, fontWeight: 600 }}
                        itemStyle={{ color: 'var(--text)' }}
                        labelStyle={{ display: 'none' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Centre label */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <span style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                      ${formatAmountWhole(totalSpent)}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 2 }}>
                      spent
                    </span>
                  </div>
                </div>

                {/* Legend bars */}
                <div className="cats" style={{ padding: '12px 0 0' }}>
                  {cats.map((c, i) => (
                    <div className="cat" key={c.name}>
                      <div className="top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: CAT_COLORS[i % CAT_COLORS.length], flexShrink: 0, display: 'inline-block' }} />
                          <span className="name">{c.name}</span>
                        </div>
                        <span className="val">${c.val}</span>
                      </div>
                      <div className={`bar ${c.tone}`.trim()} style={{ background: `${CAT_COLORS[i % CAT_COLORS.length]}22` }}>
                        <div className="fill" style={{ width: `${c.pct}%`, background: CAT_COLORS[i % CAT_COLORS.length] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
