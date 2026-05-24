import type { Transaction } from '@/types'

export type Subscription = {
  merchant: string
  amount: number
  /** Number of distinct months we've seen a charge for this merchant. */
  hits: number
  /** Most recent transaction date (yyyy-mm-dd). */
  lastDate: string
  category: string
}

const KNOWN_SUBS = [
  'netflix',
  'spotify',
  'apple',
  'apple.com',
  'icloud',
  'apple music',
  'apple tv',
  'disney',
  'disney+',
  'hulu',
  'prime video',
  'amazon prime',
  'youtube',
  'crave',
  'audible',
  'rogers',
  'bell',
  'fido',
  'telus',
  'koodo',
  'chatgpt',
  'openai',
  'github',
  'figma',
  'notion',
  'dropbox',
  'icloud',
  'patreon',
  'twitch',
  'gym',
  'fitness',
]

function normalizeMerchant(merchant: string): string {
  return merchant.trim().toLowerCase()
}

function isKnownSubscriptionMerchant(merchant: string): boolean {
  const m = normalizeMerchant(merchant)
  return KNOWN_SUBS.some((s) => m.includes(s))
}

function monthKey(date: string): string {
  return date.slice(0, 7) // yyyy-mm
}

/**
 * Detect recurring monthly charges by scanning transactions for either
 *   1. Known subscription merchants (Netflix, Spotify, Apple, etc.), OR
 *   2. The same merchant + similar amount appearing in 2+ different months.
 *
 * Returns one row per merchant, sorted by monthly amount (descending).
 */
export function detectSubscriptions(transactions: Transaction[]): Subscription[] {
  // Group spending charges by merchant, keep one entry per month per merchant
  const byMerchant = new Map<
    string,
    { merchant: string; category: string; perMonth: Map<string, { amount: number; date: string }> }
  >()

  for (const t of transactions) {
    if (t.amount >= 0) continue // only spending
    if (t.category === 'Income') continue
    const key = normalizeMerchant(t.merchant)
    const month = monthKey(t.date)
    const amount = Math.abs(t.amount)

    let row = byMerchant.get(key)
    if (!row) {
      row = { merchant: t.merchant, category: t.category, perMonth: new Map() }
      byMerchant.set(key, row)
    }
    const existing = row.perMonth.get(month)
    if (!existing || t.date > existing.date) {
      row.perMonth.set(month, { amount, date: t.date })
    }
  }

  const subscriptions: Subscription[] = []

  for (const [, row] of byMerchant) {
    const monthsSeen = [...row.perMonth.values()]
    const known = isKnownSubscriptionMerchant(row.merchant)

    // Need either a known sub merchant with >= 1 hit, or 2+ months of repeats.
    if (!known && monthsSeen.length < 2) continue

    // Sort by date desc and use the most recent charge as the canonical amount.
    monthsSeen.sort((a, b) => b.date.localeCompare(a.date))
    const recent = monthsSeen[0]

    // If amounts vary wildly between months, it's probably not a fixed sub.
    // Allow up to 25% variance (covers tax/exchange rate drift).
    if (!known && monthsSeen.length >= 2) {
      const min = Math.min(...monthsSeen.map((m) => m.amount))
      const max = Math.max(...monthsSeen.map((m) => m.amount))
      if (max > min * 1.25) continue
    }

    subscriptions.push({
      merchant: row.merchant,
      category: row.category,
      amount: recent.amount,
      hits: monthsSeen.length,
      lastDate: recent.date,
    })
  }

  return subscriptions.sort((a, b) => b.amount - a.amount)
}

export function totalMonthlySubscriptions(subs: Subscription[]): number {
  return subs.reduce((sum, s) => sum + s.amount, 0)
}
