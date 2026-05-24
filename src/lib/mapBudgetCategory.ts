import { DEFAULT_CATEGORY_BUDGETS } from '@/constants/categoryBudgets'

/** App budget category names (canonical keys from DEFAULT_CATEGORY_BUDGETS). */
const BUDGET_CATEGORIES = Object.keys(DEFAULT_CATEGORY_BUDGETS)

const BUDGET_BY_UPPER = new Map(
  BUDGET_CATEGORIES.map((name) => [name.toUpperCase(), name]),
)

/** Plaid personal_finance_category.primary values → budget category. */
const PLAID_TO_BUDGET: Record<string, string> = {
  'FOOD AND DRINK': 'Food & Dining',
  GROCERIES: 'Groceries',
  TRANSPORTATION: 'Transport',
  'GENERAL MERCHANDISE': 'Shopping',
  ENTERTAINMENT: 'Entertainment',
  'RENT AND UTILITIES': 'Bills & Utilities',
  UTILITIES: 'Bills & Utilities',
  'HOME IMPROVEMENT': 'Bills & Utilities',
  MEDICAL: 'Health',
  'PERSONAL CARE': 'Health',
  TRAVEL: 'Travel',
  'LOAN PAYMENTS': 'Bills & Utilities',
  'BANK FEES': 'Other',
  'GENERAL SERVICES': 'Other',
  'GOVERNMENT AND NON PROFIT': 'Other',
  TAX: 'Other',
  // Legacy Plaid category labels
  RESTAURANTS: 'Food & Dining',
  'FAST FOOD': 'Food & Dining',
  'COFFEE SHOP': 'Food & Dining',
  'SUPERMARKETS AND GROCERIES': 'Groceries',
  SHOPS: 'Shopping',
  PAYMENT: 'Other',
  TRANSFER: 'Other',
}

/** Not counted toward category budget totals. */
const EXCLUDED = new Set(['INCOME', 'TRANSFER IN', 'TRANSFER OUT'])

function normalizeKey(category: string): string {
  return category.trim().toUpperCase()
}

/**
 * Map a transaction category (Plaid PFC, statement upload, or demo JSON)
 * to a canonical budget category. Returns null when the tx should be skipped.
 */
export function mapToBudgetCategory(raw: string): string | null {
  const key = normalizeKey(raw)
  if (EXCLUDED.has(key) || raw === 'Income') return null

  const direct = BUDGET_BY_UPPER.get(key)
  if (direct) return direct

  return PLAID_TO_BUDGET[key] ?? 'Other'
}
