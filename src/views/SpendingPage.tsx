'use client'

import { useMemo, useState } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { getAccountsForUser } from '@/data'
import { formatCurrency, formatTooltipValue } from '@/lib/format'
import {
  filterTransactions,
  getUniqueCategories,
  monthOverMonthCategoryChange,
  spendingByCategory,
  spendingVsIncomeTrend,
  type SpendingFilters,
} from '@/lib/transactions'
import type { Transaction } from '@/types'
import { PlaidConnect } from '@/components/plaid/PlaidConnect'
import { StatementUpload } from '@/components/spending/StatementUpload'
import '@/components/shared/page.css'
import './SpendingPage.css'

const CHART_COLORS = [
  '#2a9d8f',
  '#1c2b6b',
  '#c43d3d',
  '#1a7a4a',
  '#d4922a',
  '#3d4f8f',
  '#5eb8aa',
]

export function SpendingPage() {
  const { user } = useAuth()
  const { transactions } = useFinance()
  const accounts = user ? getAccountsForUser(user.id) : []

  const [filters, setFilters] = useState<SpendingFilters>({
    accountId: 'all',
    period: 'month',
    category: 'all',
  })
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [alertMsg, setAlertMsg] = useState<string | null>(null)
  const [alertLoading, setAlertLoading] = useState(false)

  const filtered = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters],
  )

  const categories = useMemo(
    () => getUniqueCategories(transactions),
    [transactions],
  )

  const donutData = useMemo(() => spendingByCategory(filtered), [filtered])
  const trendData = useMemo(
    () => spendingVsIncomeTrend(filtered, 'month'),
    [filtered],
  )

  const foodChange = useMemo(
    () => monthOverMonthCategoryChange(transactions, 'Food & Dining'),
    [transactions],
  )

  async function runSpendingAlert() {
    if (!foodChange) {
      setAlertMsg('Not enough history yet for a month-over-month comparison.')
      return
    }
    setAlertLoading(true)
    try {
      const res = await fetch('/api/gemini/spending-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Food & Dining',
          pctChange: foodChange.pctChange,
          current: foodChange.current,
          previous: foodChange.previous,
        }),
      })
      const data = (await res.json()) as { message?: string }
      setAlertMsg(data.message ?? 'Spending looks steady this month.')
    } catch {
      setAlertMsg('Could not load alert. Try again.')
    } finally {
      setAlertLoading(false)
    }
  }

  if (!user) return null

  return (
    <section className="page spending-page">
      <h1 className="page__title">Spending</h1>
      <p className="page__subtitle">See where your money goes — tap a chart slice to filter.</p>

      <div className="filters">
        <select
          value={filters.accountId}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              accountId: e.target.value === 'all' ? 'all' : Number(e.target.value),
            }))
          }
        >
          <option value="all">All accounts</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          value={filters.period}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              period: e.target.value as SpendingFilters['period'],
            }))
          }
        >
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="lastMonth">Last month</option>
          <option value="threeMonths">Last 3 months</option>
        </select>
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value }))
          }
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {alertMsg ? <div className="alert-banner">{alertMsg}</div> : null}
      <button
        type="button"
        className="btn btn--secondary spending-page__alert-btn"
        disabled={alertLoading}
        onClick={() => void runSpendingAlert()}
      >
        {alertLoading ? 'Checking…' : 'Smart spending alert'}
      </button>

      <div className="spending-page__charts-row">
        <div className="page__section">
          <h2 className="page__section-title">By category</h2>
          <div className="chart-wrap card">
            {donutData.length === 0 ? (
              <p className="spending-page__empty">No spending in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    onClick={(_, index) => {
                      const slice = donutData[index]
                      if (slice) {
                        setFilters((f) => ({ ...f, category: slice.category }))
                      }
                    }}
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipValue} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="page__section">
          <h2 className="page__section-title">Spending vs income</h2>
          <div className="chart-wrap card">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Bar dataKey="spending" fill="var(--color-spend)" name="Spending" />
                <Bar dataKey="income" fill="var(--color-income)" name="Income" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="spending-page__bottom-row">
        <div className="page__section">
          <h2 className="page__section-title">Transactions ({filtered.length})</h2>
          <ul className="tx-list card">
            {filtered.slice(0, 50).map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="tx-list__item"
                  onClick={() => setSelectedTx(t)}
                >
                  <div>
                    <div className="tx-list__merchant">{t.merchant}</div>
                    <div className="tx-list__meta">
                      {t.category} · {t.date}
                    </div>
                  </div>
                  <span className={t.amount >= 0 ? 'amount--income' : 'amount--spend'}>
                    {t.amount >= 0 ? '+' : ''}
                    {formatCurrency(t.amount)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="spending-page__tools">
          <PlaidConnect maxRows={5} />
          <StatementUpload />
        </div>
      </div>

      {selectedTx ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-labelledby="tx-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="tx-modal-title" className="modal__title">
              {selectedTx.merchant}
            </h2>
            <p>{selectedTx.category}</p>
            <p>{selectedTx.date}</p>
            <p className={selectedTx.amount >= 0 ? 'amount--income' : 'amount--spend'}>
              {formatCurrency(selectedTx.amount)}
            </p>
            <button
              type="button"
              className="btn btn--secondary modal__close"
              onClick={() => setSelectedTx(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
