import type { Account, Transaction } from '../types'
import { mapToBudgetCategory } from './mapBudgetCategory'

export function getTimeGreeting(firstName: string): string {
  const hour = new Date().getHours()
  const period =
    hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  return `Good ${period}, ${firstName}`
}

export function computeNetWorth(accounts: Account[]): number {
  return accounts.reduce((sum, account) => sum + account.balance, 0)
}

function isInMonth(dateStr: string, year: number, month: number): boolean {
  const [y, m] = dateStr.split('-').map(Number)
  return y === year && m === month
}

/** Sum of spending (negative amounts) for a calendar month. */
export function computeMonthSpending(
  transactions: Transaction[],
  year: number,
  month: number,
): number {
  return transactions
    .filter(
      (t) => isInMonth(t.date, year, month) && t.amount < 0,
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

function categorySpend(
  transactions: Transaction[],
  year: number,
  month: number,
  category: string,
): number {
  return transactions
    .filter(
      (t) =>
        isInMonth(t.date, year, month) &&
        t.amount < 0 &&
        mapToBudgetCategory(t.category) === category,
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

function topSpendingCategory(
  transactions: Transaction[],
  year: number,
  month: number,
): { category: string; total: number } | null {
  const totals = new Map<string, number>()
  for (const t of transactions) {
    if (!isInMonth(t.date, year, month) || t.amount >= 0 || t.category === 'Income') {
      continue
    }
    const budgetCat = mapToBudgetCategory(t.category)
    if (!budgetCat) continue
    totals.set(budgetCat, (totals.get(budgetCat) ?? 0) + Math.abs(t.amount))
  }
  let best: { category: string; total: number } | null = null
  for (const [category, total] of totals) {
    if (!best || total > best.total) best = { category, total }
  }
  return best
}

/** Static insight lines from JSON — no Gemini on load. */
export function buildQuickInsights(transactions: Transaction[]): string[] {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  const insights: string[] = []

  const foodNow = categorySpend(transactions, year, month, 'Food & Dining')
  const foodPrev = categorySpend(transactions, prevYear, prevMonth, 'Food & Dining')
  if (foodPrev > 0 && foodNow > 0) {
    const pct = Math.round(((foodNow - foodPrev) / foodPrev) * 100)
    if (pct > 5) {
      insights.push(`You spent ${pct}% more on food this month.`)
    } else if (pct < -5) {
      insights.push(`Food spending is down ${Math.abs(pct)}% vs last month.`)
    }
  }

  const top = topSpendingCategory(transactions, year, month)
  if (top) {
    insights.push(`${top.category} is your biggest category this month.`)
  }

  const monthSpend = computeMonthSpending(transactions, year, month)
  if (monthSpend > 0) {
    insights.push(
      `You've tracked $${monthSpend.toFixed(0)} in spending so far this month.`,
    )
  }

  const fallbacks = [
    'Upload a statement on Spending to refresh your picture.',
    'Small cuts to recurring charges add up over time.',
    'Check Savings to see progress toward your goals.',
  ]

  while (insights.length < 3) {
    const next = fallbacks[insights.length]
    if (!next || insights.includes(next)) break
    insights.push(next)
  }

  return insights.slice(0, 3)
}
