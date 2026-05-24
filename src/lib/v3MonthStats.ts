import type { Transaction } from '@/types'
import { computeMonthSpending } from '@/lib/dashboard'

export function currentMonthLabel(now = new Date()): string {
  return now.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })
}

export function spendingMonthName(now = new Date()): string {
  return now.toLocaleDateString('en-CA', { month: 'long' })
}

export function daysLeftInMonth(now = new Date()): number {
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return last.getDate() - now.getDate()
}

/** Month-over-month spending change % (negative = spent less). */
export function spendingVsPriorMonth(transactions: Transaction[]): number | null {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  const current = computeMonthSpending(transactions, year, month)
  const previous = computeMonthSpending(transactions, prevYear, prevMonth)
  if (previous <= 0) return null
  return Math.round(((current - previous) / previous) * 100)
}

export function priorMonthName(now = new Date()): string {
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return d.toLocaleDateString('en-CA', { month: 'long' })
}
