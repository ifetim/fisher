import { DEFAULT_CATEGORY_BUDGETS, BUDGET_STORAGE_KEY } from '@/constants/categoryBudgets'
import type { Transaction } from '@/types'
import { mapToBudgetCategory } from '@/lib/mapBudgetCategory'

export type CategoryBudgetRow = {
  category: string
  limit: number
  spent: number
  remaining: number
  pct: number
  over: boolean
}

function storageKey(userId: number): string {
  return `${BUDGET_STORAGE_KEY}:${userId}`
}

export function loadCategoryBudgets(userId: number): Record<string, number> {
  if (typeof window === 'undefined') return { ...DEFAULT_CATEGORY_BUDGETS }
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return { ...DEFAULT_CATEGORY_BUDGETS }
    const saved = JSON.parse(raw) as Record<string, number>
    return { ...DEFAULT_CATEGORY_BUDGETS, ...saved }
  } catch {
    return { ...DEFAULT_CATEGORY_BUDGETS }
  }
}

export function saveCategoryBudget(userId: number, category: string, limit: number): void {
  const current = loadCategoryBudgets(userId)
  current[category] = Math.max(0, limit)
  localStorage.setItem(storageKey(userId), JSON.stringify(current))
}

function spendingByBudgetCategory(transactions: Transaction[]): Map<string, number> {
  const totals = new Map<string, number>()
  for (const t of transactions) {
    if (t.amount >= 0 || t.category === 'Income') continue
    const budgetCat = mapToBudgetCategory(t.category)
    if (!budgetCat) continue
    totals.set(budgetCat, (totals.get(budgetCat) ?? 0) + Math.abs(t.amount))
  }
  return totals
}

export function buildCategoryBudgetRows(
  transactions: Transaction[],
  limits: Record<string, number>,
): CategoryBudgetRow[] {
  const spentByCat = spendingByBudgetCategory(transactions)

  return Object.keys(limits)
    .filter((c) => c !== 'Income')
    .map((category) => {
      const limit = limits[category] ?? 0
      const spent = spentByCat.get(category) ?? 0
      const remaining = Math.max(0, limit - spent)
      const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0
      return { category, limit, spent, remaining, pct, over: limit > 0 && spent > limit }
    })
    .sort((a, b) => b.spent - a.spent)
}

export function totalBudgetLimit(rows: CategoryBudgetRow[]): number {
  return rows.reduce((s, r) => s + r.limit, 0)
}

export function totalBudgetSpent(rows: CategoryBudgetRow[]): number {
  return rows.reduce((s, r) => s + r.spent, 0)
}
