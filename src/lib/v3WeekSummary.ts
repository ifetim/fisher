import type { Transaction } from '@/types'

export type WeekSummary = {
  income: number
  spending: number
  net: number
}

/** Totals for the last 7 calendar days (inclusive). */
export function weekSummary(transactions: Transaction[]): WeekSummary {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  start.setHours(0, 0, 0, 0)

  let income = 0
  let spending = 0

  for (const t of transactions) {
    const d = new Date(t.date + 'T12:00:00')
    if (d < start || d > end) continue
    if (t.amount > 0) income += t.amount
    else spending += Math.abs(t.amount)
  }

  return { income, spending, net: income - spending }
}
