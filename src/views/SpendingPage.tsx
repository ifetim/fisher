'use client'

import { useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { getAccountsForUser } from '@/data'
import { filterTransactions, spendingByCategory } from '@/lib/transactions'
import { formatCurrency } from '@/lib/format'
import { PlaidConnect } from '@/components/plaid/PlaidConnect'

const CAT_STYLE: Record<string, { icon: string; bg: string; color: string }> = {
  'Food & Dining': { icon: '🍔', bg: 'rgba(249,115,22,0.15)', color: '#f97316' },
  Groceries:       { icon: '🛒', bg: 'rgba(34,197,94,0.15)',  color: '#22c55e' },
  Transport:       { icon: '🚇', bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  Shopping:        { icon: '🛍️', bg: 'rgba(134,59,255,0.15)', color: '#863bff' },
  Entertainment:   { icon: '🎵', bg: 'rgba(236,72,153,0.15)', color: '#ec4899' },
  Income:          { icon: '💰', bg: 'rgba(34,197,94,0.15)',  color: '#22c55e' },
  Bills:           { icon: '⚡', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  Health:          { icon: '💊', bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' },
}

const DEFAULT_STYLE = { icon: '💳', bg: 'rgba(100,116,139,0.12)', color: '#64748b' }

function catStyle(category: string) {
  return CAT_STYLE[category] ?? DEFAULT_STYLE
}

export function SpendingPage() {
  const { user } = useAuth()
  const { transactions, plaidConnected, plaidSyncing } = useFinance()
  const accounts = user ? getAccountsForUser(user.id) : []

  const filtered = useMemo(
    () => filterTransactions(transactions, { accountId: 'all', period: 'month', category: 'all' }),
    [transactions],
  )

  const breakdown = useMemo(() => spendingByCategory(filtered), [filtered])
  const maxSpend = Math.max(...breakdown.map((b) => b.total), 1)

  const totalSpent  = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalIncome = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const net = totalIncome - totalSpent

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const t of filtered.slice(0, 30)) {
      const d = new Date(t.date + 'T00:00:00')
      const today = new Date(); today.setHours(0,0,0,0)
      const yest  = new Date(today); yest.setDate(yest.getDate() - 1)
      let label: string
      if (d.toDateString() === today.toDateString()) label = 'Today'
      else if (d.toDateString() === yest.toDateString()) label = 'Yesterday'
      else label = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })

      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(t)
    }
    return [...map.entries()]
  }, [filtered])

  if (!user) return null

  const netColor = net >= 0 ? 'var(--green)' : 'var(--red)'

  return (
    <div>
      <div className="screen-header">
        <div className="greeting">
          <p>{new Date().toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}</p>
          <h1>Spending</h1>
        </div>
        <button className="eye-btn dark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
          Filter
        </button>
      </div>

      {/* Summary chips */}
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
          <p className="chip-amount" style={{ color: netColor }}>{net >= 0 ? '+' : ''}{formatCurrency(net)}</p>
        </div>
        <div className="chip neutral">
          <p className="chip-label">ACCOUNTS</p>
          <p className="chip-amount">{accounts.length}</p>
        </div>
      </div>

      {/* Plaid connect — after linking, FinanceContext auto-syncs transactions */}
      <PlaidConnect />

      <div className="grid cols-12">
        {/* Transaction list */}
        <div>
          <div className="section-label">
            <span>Recent transactions</span>
          </div>
          {grouped.map(([day, txs]) => (
            <div key={day}>
              <p className="day-label">{day}</p>
              <div className="card" style={{ marginBottom: 8 }}>
                {txs.map((tx) => {
                  const s = catStyle(tx.category)
                  const pos = tx.amount > 0
                  return (
                    <div className="card-row tx-row" key={tx.id}>
                      <div className="tx-icon" style={{ background: s.bg }}>{s.icon}</div>
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
        </div>

        {/* Category breakdown */}
        <div>
          <div className="section-label"><span>By category</span></div>
          <div className="card card-pad">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {breakdown.map((b) => {
                const s = catStyle(b.category)
                return (
                  <div key={b.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{b.category}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(b.total)}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(b.total / maxSpend) * 100}%`, background: s.color, borderRadius: 3 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
