import type { Transaction } from '@/types'
import { mapToBudgetCategory } from '@/lib/mapBudgetCategory'

function isInMonth(dateStr: string, year: number, month: number): boolean {
  const [y, m] = dateStr.split('-').map(Number)
  return y === year && m === month
}

export function categorySpend(
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
