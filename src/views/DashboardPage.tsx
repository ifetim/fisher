'use client'

import { useRouter } from 'next/navigation'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency } from '@/lib/format'
import { AccountGroupTile } from '@/components/dashboard/AccountGroupTile'
import { DashboardCategoryBudgets } from '@/components/dashboard/DashboardCategoryBudgets'
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets'
import { groupTotal } from '@/lib/accountGrouping'

const ACCOUNT_COLORS: Record<string, string> = {
  chequing: '#3b82f6',
  savings:  '#22c55e',
  credit:   '#ef4444',
}

export function DashboardPage() {
  const router = useRouter()
  const {
    greeting,
    accounts,
    groupedAccounts,
    netWorth,
    spendingThisMonth,
    quickInsights,
    institutionName,
    balancesVisible,
    toggleBalances,
  } = useDashboard()
  const { rows: budgetRows, totalSpent: budgetSpent, totalLimit: budgetLimit } = useCategoryBudgets()

  if (!greeting || !accounts) return null

  // ── Survive until payday ──────────────────────────────────────────────────
  const chequingBalance = accounts.find((a) => a.type === 'chequing')?.balance ?? 0
  const today = new Date()
  const daysElapsed = today.getDate()
  const avgDailySpend =
    daysElapsed > 0 && spendingThisMonth
      ? Math.abs(spendingThisMonth) / daysElapsed
      : 0
  const daysLeft = avgDailySpend > 0 ? Math.floor(chequingBalance / avgDailySpend) : null
  // Next payday: 15th of current month, or 1st of next month
  const daysToPayday =
    today.getDate() < 15
      ? 15 - today.getDate()
      : Math.ceil(
          (new Date(today.getFullYear(), today.getMonth() + 1, 1).getTime() - today.getTime()) /
            86_400_000,
        )
  const paydayOk = daysLeft !== null && daysLeft >= daysToPayday
  // ─────────────────────────────────────────────────────────────────────────

  const firstName = greeting.replace(/^Good \w+, /, '')
  const timeOfDay = greeting.split(',')[0] ?? 'Good day'

  const insightIcons = [
    { icon: '📊', bg: 'rgba(59,130,246,0.12)' },
    { icon: '⚡', bg: 'rgba(245,158,11,0.12)' },
    { icon: '🎯', bg: 'rgba(134,59,255,0.12)' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="screen-header">
        <div className="greeting">
          <p>{timeOfDay}</p>
          <h1>Welcome back, {firstName} 👋</h1>
        </div>
        <div className="avatar">{firstName[0]?.toUpperCase()}</div>
      </div>

      <div className="grid cols-12">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Net worth hero */}
          <div className="hero">
            <div className="hero-label">
              <span>Net Worth</span>
              <button className="eye-btn" onClick={toggleBalances}>
                {balancesVisible ? (
                  <>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/>
                    </svg>
                    Hide
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="#fff" strokeWidth="2"/>
                    </svg>
                    Show
                  </>
                )}
              </button>
            </div>
            <div className="hero-amount">
              {balancesVisible ? formatCurrency(netWorth ?? 0) : '••••••••'}
            </div>
            <div className="hero-tags">
              <span className="hero-tag">Across {accounts.length} accounts</span>
              {institutionName ? (
                <span className="hero-tag" style={{ background: 'rgba(34,197,94,0.18)' }}>
                  🔗 {institutionName}
                </span>
              ) : null}
            </div>
          </div>

          {/* Survive until payday */}
          {daysLeft !== null && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: paydayOk ? 'rgba(34,197,94,0.08)' : daysLeft >= daysToPayday * 0.7 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1.5px solid ${paydayOk ? 'rgba(34,197,94,0.2)' : daysLeft >= daysToPayday * 0.7 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.22)'}`,
              borderRadius: 12, padding: '11px 14px', marginTop: 12,
            }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>
                {paydayOk ? '✅' : daysLeft >= daysToPayday * 0.7 ? '⚠️' : '🚨'}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  {balancesVisible ? `${daysLeft} days of spending left` : '•• days of spending left'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--muted)' }}>
                  {paydayOk
                    ? `On track — payday in ${daysToPayday}d`
                    : `Payday in ${daysToPayday}d — watch your spending`}
                </p>
              </div>
            </div>
          )}

          {/* Primary accounts — chequing / savings / credit card individually */}
          <div>
            <div className="section-label">
              <span>Accounts</span>
            </div>
            <div className="accounts">
              {accounts.map((a) => (
                <div className="account-card" key={a.id}>
                  <div className="dot" style={{ background: (ACCOUNT_COLORS[a.type] ?? '#64748b') + '22' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: ACCOUNT_COLORS[a.type] ?? '#64748b' }} />
                  </div>
                  <p className="name">{a.name}</p>
                  <p className="bank">{a.bank}</p>
                  <p className={'balance' + (a.balance < 0 ? ' neg' : '')}>
                    {balancesVisible
                      ? (a.balance < 0 ? '−' : '') + formatCurrency(Math.abs(a.balance))
                      : '••••'}
                  </p>
                </div>
              ))}
            </div>

            {/* Grouped tiles — collapsed by default to avoid clutter */}
            {groupedAccounts ? (
              <div className="account-groups">
                <AccountGroupTile
                  title="Investments"
                  emoji="📈"
                  accentBg="rgba(134,59,255,0.15)"
                  accounts={groupedAccounts.investments}
                  groupTotal={groupTotal(groupedAccounts.investments)}
                  balancesVisible={balancesVisible}
                />
                <AccountGroupTile
                  title="Loans"
                  emoji="🏛️"
                  accentBg="rgba(239,68,68,0.12)"
                  accounts={groupedAccounts.loans}
                  groupTotal={groupTotal(groupedAccounts.loans, true)}
                  isDebt
                  balancesVisible={balancesVisible}
                />
                <AccountGroupTile
                  title="Other accounts"
                  emoji="🏦"
                  accentBg="rgba(59,130,246,0.12)"
                  accounts={groupedAccounts.otherDeposits}
                  groupTotal={groupTotal(groupedAccounts.otherDeposits)}
                  balancesVisible={balancesVisible}
                />
              </div>
            ) : null}
          </div>

          {/* Category budgets this month */}
          <div style={{ marginTop: 16 }}>
            <div className="section-label">
              <span>Category budgets</span>
            </div>
            <div className="card card-pad">
              <DashboardCategoryBudgets
                rows={budgetRows}
                totalSpent={budgetSpent}
                totalLimit={budgetLimit}
                balancesVisible={balancesVisible}
              />
            </div>
          </div>
        </div>

        {/* Right column: insights */}
        <div>
          <div className="section-label">
            <span>Quick insights</span>
          </div>
          <div className="card">
            {(quickInsights ?? []).map((text, i) => (
              <div className="card-row insight-row" key={i}>
                <div className="insight-icon" style={{ background: insightIcons[i % insightIcons.length]?.bg }}>
                  {insightIcons[i % insightIcons.length]?.icon}
                </div>
                <p className="insight-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dev only — reset onboarding */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button
          style={{ background: 'none', border: '1px dashed var(--border)', borderRadius: 8, padding: '6px 14px', fontSize: '0.75rem', color: 'var(--muted)', cursor: 'pointer' }}
          onClick={() => { localStorage.removeItem('clearmint-onboarded'); router.push('/onboarding') }}
        >
          ↩ Preview onboarding
        </button>
      </div>
    </div>
  )
}
