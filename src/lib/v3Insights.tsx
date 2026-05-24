import type { ReactNode } from 'react'
import type { Transaction } from '@/types'
import type { SavingsPlan } from '@/types'
import { categorySpend } from '@/lib/dashboardInsightHelpers'

export type V3Insight = {
  kind: 'up' | 'warn' | 'aim'
  text: ReactNode
}

function diningInsight(transactions: Transaction[]): V3Insight | null {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  const nowSpend = categorySpend(transactions, year, month, 'Food & Dining')
  const prevSpend = categorySpend(transactions, prevYear, prevMonth, 'Food & Dining')
  if (prevSpend <= 0 || nowSpend <= 0) return null

  const pct = Math.round(((nowSpend - prevSpend) / prevSpend) * 100)
  if (pct < -3) {
    return {
      kind: 'up',
      text: (
        <>
          Dining is <strong>down {Math.abs(pct)}%</strong> vs last month — nice work.
        </>
      ),
    }
  }
  if (pct > 3) {
    return {
      kind: 'warn',
      text: (
        <>
          Dining is <strong>up {pct}%</strong> vs last month — worth a look on Spending.
        </>
      ),
    }
  }
  return null
}

function subscriptionInsight(transactions: Transaction[]): V3Insight | null {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  let total = 0
  for (const t of transactions) {
    const [y, m] = t.date.split('-').map(Number)
    if (y !== year || m !== month || t.amount >= 0) continue
    const c = t.category.toLowerCase()
    if (c.includes('subscription') || c.includes('entertainment')) {
      total += Math.abs(t.amount)
    }
  }
  if (total < 10) return null
  return {
    kind: 'warn',
    text: (
      <>
        Subscriptions cost <strong>${Math.round(total)}/mo</strong>. Review on Spending.
      </>
    ),
  }
}

function emergencyFundInsight(plans: SavingsPlan[]): V3Insight | null {
  const fund = plans.find((p) => /emergency/i.test(p.goal))
  if (!fund || fund.targetAmount <= 0) return null
  const pct = Math.round((fund.savedAmount / fund.targetAmount) * 100)
  return {
    kind: 'aim',
    text: (
      <>
        Emergency fund <strong>{pct}% funded</strong>. Keep going.
      </>
    ),
  }
}

const FALLBACKS: V3Insight[] = [
  {
    kind: 'up',
    text: (
      <>
        You&apos;re tracking spending — <strong>keep checking in</strong> each week.
      </>
    ),
  },
  {
    kind: 'warn',
    text: (
      <>
        Connect Plaid on Spending for <strong>automatic</strong> transaction sync.
      </>
    ),
  },
  {
    kind: 'aim',
    text: (
      <>
        Set a savings goal to see <strong>progress</strong> toward what matters.
      </>
    ),
  },
]

export function buildV3Insights(
  transactions: Transaction[],
  savingsPlans: SavingsPlan[],
): V3Insight[] {
  const out: V3Insight[] = []
  const d = diningInsight(transactions)
  if (d) out.push(d)
  const s = subscriptionInsight(transactions)
  if (s) out.push(s)
  const e = emergencyFundInsight(savingsPlans)
  if (e) out.push(e)

  for (const f of FALLBACKS) {
    if (out.length >= 3) break
    out.push(f)
  }
  return out.slice(0, 3)
}
