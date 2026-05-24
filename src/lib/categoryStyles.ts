export type CategoryStyle = { icon: string; bg: string; color: string }

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'Food & Dining': { icon: '🍔', bg: 'rgba(249,115,22,0.15)', color: '#f97316' },
  Groceries: { icon: '🛒', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Transport: { icon: '🚇', bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  Shopping: { icon: '🛍️', bg: 'rgba(134,59,255,0.15)', color: '#863bff' },
  Entertainment: { icon: '🎵', bg: 'rgba(236,72,153,0.15)', color: '#ec4899' },
  Income: { icon: '💰', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Bills: { icon: '⚡', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  'Bills & Utilities': { icon: '⚡', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  Health: { icon: '💊', bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  Travel: { icon: '✈️', bg: 'rgba(14,165,233,0.15)', color: '#0ea5e9' },
  Other: { icon: '💳', bg: 'rgba(100,116,139,0.12)', color: '#64748b' },
}

const FALLBACK: CategoryStyle = { icon: '💳', bg: 'rgba(100,116,139,0.12)', color: '#64748b' }

export function categoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? FALLBACK
}

export function categoryChartColor(category: string, index: number): string {
  return CATEGORY_STYLES[category]?.color ?? CHART_PALETTE[index % CHART_PALETTE.length]
}

const CHART_PALETTE = ['#f97316', '#3b82f6', '#863bff', '#ec4899', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#64748b']
