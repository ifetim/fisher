import type { Transaction } from '../types'

export type PeriodPreset =
  | 'week'
  | 'month'
  | 'lastMonth'
  | 'threeMonths'
  | 'custom'

export type SpendingFilters = {
  accountId: number | 'all'
  period: PeriodPreset
  customStart?: string
  customEnd?: string
  category: string | 'all'
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getPeriodRange(
  preset: PeriodPreset,
  customStart?: string,
  customEnd?: string,
  now = new Date(),
): { start: Date; end: Date } {
  const end = startOfDay(now)
  const start = new Date(end)

  switch (preset) {
    case 'week':
      start.setDate(end.getDate() - 6)
      break
    case 'month':
      start.setDate(1)
      break
    case 'lastMonth': {
      start.setMonth(end.getMonth() - 1, 1)
      const lastDay = new Date(end.getFullYear(), end.getMonth(), 0)
      return { start, end: lastDay }
    }
    case 'threeMonths':
      start.setMonth(end.getMonth() - 2, 1)
      break
    case 'custom': {
      const cs = customStart ? parseDate(customStart) : start
      const ce = customEnd ? parseDate(customEnd) : end
      return { start: startOfDay(cs), end: startOfDay(ce) }
    }
  }

  return { start, end }
}

export function filterTransactions(
  transactions: Transaction[],
  filters: SpendingFilters,
): Transaction[] {
  const { start, end } = getPeriodRange(
    filters.period,
    filters.customStart,
    filters.customEnd,
  )

  return transactions.filter((t) => {
    if (filters.accountId !== 'all' && t.accountId !== filters.accountId) {
      return false
    }
    if (filters.category !== 'all' && t.category !== filters.category) {
      return false
    }
    const d = parseDate(t.date)
    return d >= start && d <= end
  })
}

export function getUniqueCategories(transactions: Transaction[]): string[] {
  const set = new Set<string>()
  for (const t of transactions) {
    if (t.category !== 'Income') set.add(t.category)
  }
  return [...set].sort()
}

export type CategorySlice = { category: string; total: number }

export function spendingByCategory(
  transactions: Transaction[],
): CategorySlice[] {
  const totals = new Map<string, number>()
  for (const t of transactions) {
    if (t.amount >= 0 || t.category === 'Income') continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + Math.abs(t.amount))
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export type TrendBucket = {
  label: string
  spending: number
  income: number
}

export function spendingVsIncomeTrend(
  transactions: Transaction[],
  bucket: 'week' | 'month' = 'month',
): TrendBucket[] {
  const map = new Map<string, TrendBucket>()

  for (const t of transactions) {
    const d = parseDate(t.date)
    const key =
      bucket === 'week'
        ? t.date
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label =
      bucket === 'week'
        ? d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
        : d.toLocaleDateString('en-CA', { month: 'short', year: '2-digit' })

    if (!map.has(key)) {
      map.set(key, { label, spending: 0, income: 0 })
    }
    const row = map.get(key)!
    if (t.amount < 0) row.spending += Math.abs(t.amount)
    else row.income += t.amount
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
}

export function monthOverMonthCategoryChange(
  transactions: Transaction[],
  category: string,
): { current: number; previous: number; pctChange: number } | null {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  const sum = (y: number, m: number) =>
    transactions
      .filter((t) => {
        const [ty, tm] = t.date.split('-').map(Number)
        return (
          ty === y &&
          tm === m &&
          t.amount < 0 &&
          t.category === category
        )
      })
      .reduce((s, t) => s + Math.abs(t.amount), 0)

  const current = sum(year, month)
  const previous = sum(prevYear, prevMonth)
  if (previous <= 0 && current <= 0) return null

  const pctChange =
    previous > 0 ? Math.round(((current - previous) / previous) * 100) : 100

  return { current, previous, pctChange }
}
