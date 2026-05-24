'use client'

import { useRouter } from 'next/navigation'
import { useDashboard } from '@/hooks/useDashboard'
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { V3Icons, V3StatusBar } from '@/components/v3/V3Icons'
import { accountTone, bankCode, formatAmountWhole } from '@/lib/v3Format'
import { buildV3Insights } from '@/lib/v3Insights'
import { weekSummary } from '@/lib/v3WeekSummary'
import {
  daysLeftInMonth,
  priorMonthName,
  spendingMonthName,
  spendingVsPriorMonth,
} from '@/lib/v3MonthStats'

export function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { transactions, savingsPlans } = useFinance()
  const {
    greeting,
    accounts,
    netWorth,
    balancesVisible,
    toggleBalances,
  } = useDashboard()
  const { totalSpent: budgetSpent, totalLimit: budgetLimit } = useCategoryBudgets()

  if (!greeting || !accounts || !user) return null

  const firstName = user.name.split(' ')[0] ?? user.name
  const timeOfDay = greeting.split(',')[0] ?? 'Good morning'
  const net = netWorth ?? 0
  const budgetPct =
    budgetLimit > 0 ? Math.min(100, Math.round((budgetSpent / budgetLimit) * 100)) : 0

  const show = (n: number) => (balancesVisible ? `$${formatAmountWhole(n)}` : '••••')

  const insights = buildV3Insights(transactions, savingsPlans)
  const insightIcons = [V3Icons.down, V3Icons.alert, V3Icons.bullseye]
  const week = weekSummary(transactions)
  const vsPrior = spendingVsPriorMonth(transactions)
  const monthName = spendingMonthName()
  const daysLeft = daysLeftInMonth()

  return (
    <div>
      <V3StatusBar />
      <div className="screen-head">
        <div>
          <p className="greet">{timeOfDay}</p>
          <h1>Hi, {firstName}.</h1>
        </div>
        <div className="head-avatar">{firstName[0]?.toUpperCase()}</div>
      </div>

      <div className="grid cols-12">
        <div className="stack">
          <div className="hero">
            <div className="label-row">
              <span className="label">Net worth · CAD</span>
              <button type="button" className="eye" onClick={toggleBalances}>
                {balancesVisible ? V3Icons.eye : V3Icons.eyeOff}{' '}
                {balancesVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="amount">
              {balancesVisible ? (
                <>
                  ${formatAmountWhole(net)}
                  <span className="cents">.00</span>
                </>
              ) : (
                '••••••'
              )}
            </div>
            <div>
              {vsPrior !== null ? (
                <span className="delta">
                  {vsPrior <= 0 ? V3Icons.up : V3Icons.down}{' '}
                  {Math.abs(vsPrior)}% vs {priorMonthName()}
                </span>
              ) : (
                <span className="delta">{V3Icons.up} Tracking {accounts.length} accounts</span>
              )}
              <span className="delta">
                {week.net >= 0 ? '+' : '−'}${formatAmountWhole(Math.abs(week.net))} this week
              </span>
            </div>
          </div>

          <div>
            <div className="sec">
              <span className="lbl">Accounts</span>
              <span className="act">See all</span>
            </div>
            <div className="card">
              {accounts.map((a) => {
                const tone = accountTone(a.type)
                const mask = String(1000 + Math.abs(a.id)).slice(-4)
                return (
                  <div className="account" key={a.id}>
                    <div className={`icon ${tone}`.trim()}>{bankCode(a.bank)}</div>
                    <div className="meta">
                      <p className="name">{a.name}</p>
                      <p className="sub">
                        {a.bank} · ··{mask}
                      </p>
                    </div>
                    <p className={`bal${a.balance < 0 ? ' neg' : ''}`}>
                      {balancesVisible
                        ? (a.balance < 0 ? '−' : '') +
                          '$' +
                          formatAmountWhole(Math.abs(a.balance))
                        : '••••'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="sec">
              <span className="lbl">{monthName} spending</span>
              <span className="act" onClick={() => router.push('/spending')} role="button" tabIndex={0}>
                Details
              </span>
            </div>
            <div className="card pad budget">
              <div className="top-row">
                <div>
                  <p className="lbl">Spent</p>
                  <p className="num">
                    {show(budgetSpent)}
                    <span className="of">/ ${formatAmountWhole(budgetLimit)}</span>
                  </p>
                </div>
                <span className="pct-tag">{budgetPct}%</span>
              </div>
              <div className="bar">
                <div className="fill" style={{ width: `${budgetPct}%` }} />
              </div>
              <p className="foot">
                {daysLeft} days left in {monthName} · pacing on budget
              </p>
            </div>
          </div>
        </div>

        <div className="stack">
          <div>
            <div className="sec">
              <span className="lbl">Quick insights</span>
            </div>
            <div className="card">
              {insights.map((row, i) => (
                <div className={`insight ${row.kind}`} key={i}>
                  <div className="ico">{insightIcons[i] ?? V3Icons.bullseye}</div>
                  <p className="txt">{row.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="sec">
              <span className="lbl">This week</span>
            </div>
            <div className="card pad">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>Income</span>
                <span
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--mint)',
                  }}
                >
                  +${formatAmountWhole(week.income)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>Spending</span>
                <span
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--rose)',
                  }}
                >
                  −${formatAmountWhole(week.spending)}
                </span>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>Net</span>
                <span
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 18,
                    fontWeight: 600,
                    color: 'var(--orange)',
                  }}
                >
                  {week.net >= 0 ? '+' : '−'}${formatAmountWhole(Math.abs(week.net))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
