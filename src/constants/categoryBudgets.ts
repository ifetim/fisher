/** Default monthly limits per category (student-friendly starting points). */
export const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  'Food & Dining': 350,
  Transport: 120,
  Shopping: 150,
  Entertainment: 80,
  'Bills & Utilities': 400,
  Health: 75,
  Travel: 125,
  Groceries: 200,
  Other: 100,
}

export const BUDGET_STORAGE_KEY = 'clearmint-category-budgets'
