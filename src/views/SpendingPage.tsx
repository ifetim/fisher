'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import {
  filterTransactions,
  spendingByCategory,
} from '@/lib/transactions'
import { formatAmountWhole } from '@/lib/v3Format'
import { V3Icons, V3StatusBar } from '@/components/v3/V3Icons'
import { PlaidBanner } from '@/components/v3/PlaidBanner'
import { txV3Icon, categoryBarTone } from '@/lib/txV3Icon'
import { currentMonthLabel, priorMonthName, spendingVsPriorMonth } from '@/lib/v3MonthStats'

const PAGE_SIZE = 20

export function SpendingPage() {
  const { user } = useAuth()
  const { transactions } = useFinance()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const monthAll = useMemo(
    () => filterTransactions(transactions, { accountId: 'all', period: 'month', category: 'all' }),
    [transactions],
  )

  const filtered = monthAll

  const breakdown = useMemo(() => spendingByCategory(monthAll), [monthAll])
  const maxCat = breakdown[0]?.total ?? 1

  const totalSpent = monthAll.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalIncome = monthAll.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
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
      else label = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })

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

  if (!user) return null

  return (
    <div>
      <V3StatusBar />
      <div className="screen-head">
        <div>
          <p className="greet">{currentMonthLabel()}</p>
          <h1>Spending</h1>
        </div>
        <button type="button" className="btn ghost">
          {V3Icons.filter} Filter
        </button>
      </div>

      <div className="stats">
        <div className="stat rose">
          <p className="lbl">Spent</p>
          <p className="num">${formatAmountWhole(totalSpent)}</p>
        </div>
        <div className="stat mint">
          <p className="lbl">Income</p>
          <p className="num">${formatAmountWhole(totalIncome)}</p>
        </div>
        <div className="stat orange">
          <p className="lbl">Net</p>
          <p className="num">
            {net >= 0 ? '+' : '−'}${formatAmountWhole(Math.abs(net))}
          </p>
        </div>
        <div className="stat">
          <p className="lbl">vs {priorMonthName()}</p>
          <p className="num">{vsPrior === null ? '—' : `${vsPrior > 0 ? '+' : ''}${vsPrior}%`}</p>
        </div>
      </div>

      <PlaidBanner />

      <div className="grid cols-12">
        <div>
          <div className="sec">
            <span className="lbl">Recent transactions</span>
            <span className="act">Export</span>
          </div>
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
              Show more
            </button>
          ) : null}
        </div>

        <div>
          <div className="sec">
            <span className="lbl">By category</span>
          </div>
          <div className="card">
            <div className="cats">
              {cats.map((c) => (
                <div className="cat" key={c.name}>
                  <div className="top">
                    <span className="name">{c.name}</span>
                    <span className="val">${c.val}</span>
                  </div>
                  <div className={`bar ${c.tone}`.trim()}>
                    <div className="fill" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
