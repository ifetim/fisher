import type { Transaction } from '@/types'

export type PaydayBudget = {
  /** Income received so far this month (positive amounts, excluding transfers). */
  monthIncome: number
  /** Spending so far this month (positive number). */
  monthSpent: number
  /** Money still available for the rest of the month (income − spent). */
  remaining: number
  /** Days left in the current month (today not counted). */
  daysLeft: number
  /** Suggested daily spend until the 1st of next month. */
  perDay: number
  /** Human-readable end date, e.g. "June 1". */
  nextMonthLabel: string
  /** True when income exists this month — otherwise the card hides. */
  hasIncome: boolean
}

function isInMonth(dateStr: string, year: number, month: number): boolean {
  const [y, m] = dateStr.split('-').map(Number)
  return y === year && m === month
}

/**
 * Compute a "money-left-this-month" view that's actually useful for students:
 * how much you've earned this month, what you've spent, and what's left
 * spread evenly across the days remaining.
 */
export function paydayBudget(
  transactions: Transaction[],
  now: Date = new Date(),
): PaydayBudget {
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  let monthIncome = 0
  let monthSpent = 0

  for (const t of transactions) {
    if (!isInMonth(t.date, year, month)) continue
    if (t.amount > 0) monthIncome += t.amount
    else monthSpent += Math.abs(t.amount)
  }

  const lastDay = new Date(year, month, 0).getDate()
  // "days left" counts today, so the per-day figure includes today's spending.
  const daysLeft = Math.max(1, lastDay - now.getDate() + 1)

  const remaining = Math.max(0, monthIncome - monthSpent)
  const perDay = remaining / daysLeft

  const nextMonthDate = new Date(year, month, 1)
  const nextMonthLabel = nextMonthDate.toLocaleDateString('en-CA', {
    month: 'long',
    day: 'numeric',
  })

  return {
    monthIncome,
    monthSpent,
    remaining,
    daysLeft,
    perDay,
    nextMonthLabel,
    hasIncome: monthIncome > 0,
  }
}
