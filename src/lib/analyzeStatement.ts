// src/lib/analyzeStatement.ts
// Rule-based PDF statement analyzer. No AI/API needed.
// Extracts food transactions, matches against campus restaurant aliases,
// and returns a structured savings report ready for the frontend.

import campusRestaurants, { type CampusRestaurant } from '@/data/CampusRestaurants'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RawTransaction {
  date: string
  rawMerchant: string
  amount: number
}

export interface SavingsSuggestion {
  name: string
  avgMealCost: number
  location: string
  cuisine: string
  estimatedSavings: number
}

export interface MatchedTransaction {
  date: string
  merchant: string
  rawMerchant: string
  amount: number
  campus: string
  cuisine: string
  priceRange: string
  savings: SavingsSuggestion[]
}

export interface AnalysisResult {
  campus: string | null
  totalFoodSpend: number
  campusSpend: number
  potentialSavings: number
  matchedTransactions: MatchedTransaction[]
  summary: string
  categoryBreakdown: Record<string, number>
  topMerchant: string | null
}

// ── Food keyword list (matches categorizeMerchant.ts patterns) ────────────────

const FOOD_KEYWORDS = [
  'restaurant', 'cafe', 'café', 'coffee', 'bistro', 'grill', 'pizza',
  'burger', 'sushi', 'noodle', 'curry', 'diner', 'kitchen', 'bar', 'pub',
  'dining', 'bakery', 'bake', 'toast', 'sandwich', 'sub', 'wings', 'taco',
  'thai', 'pho', 'ramen', 'shawarma', 'falafel', 'canteen', 'hall', 'grind',
  'spoke', 'gerts', 'pit ', 'myhal', 'robarts', 'innis', 'leacock', 'centro',
  'jduc', 'musc', 'tatham', 'seedling', 'ponderosa', 'fed hall', 'machall',
  'tim hortons', 'starbucks', 'second cup', 'mcdonald', 'subway', 'chipotle',
  'doordash', 'uber eats', 'skipthedishes', 'skip the dishes',
]

// Cuisine labels that map to the app's existing category names
const CUISINE_HINTS: { keywords: string[]; cuisine: string }[] = [
  { keywords: ['sushi', 'japanese', 'ramen', 'noodle', 'pho'], cuisine: 'Food & Dining' },
  { keywords: ['pizza', 'italian', 'pasta'], cuisine: 'Food & Dining' },
  { keywords: ['burger', 'grill', 'wings'], cuisine: 'Food & Dining' },
  { keywords: ['curry', 'indian', 'masala'], cuisine: 'Food & Dining' },
  { keywords: ['taco', 'mexican', 'burrito'], cuisine: 'Food & Dining' },
  { keywords: ['café', 'cafe', 'coffee', 'grind', 'tim hortons', 'starbucks', 'second cup'], cuisine: 'Café / Coffee' },
  { keywords: ['bar', 'pub', 'spoke', 'gerts', 'pit '], cuisine: 'Bar Food' },
  { keywords: ['doordash', 'uber eats', 'skip'], cuisine: 'Food Delivery' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function isFoodMerchant(name: string): boolean {
  const lower = name.toLowerCase()
  return FOOD_KEYWORDS.some((kw) => lower.includes(kw))
}

function guessCuisine(name: string): string {
  const lower = name.toLowerCase()
  for (const { keywords, cuisine } of CUISINE_HINTS) {
    if (keywords.some((kw) => lower.includes(kw))) return cuisine
  }
  return 'Food & Dining'
}

function matchRestaurant(rawMerchant: string): CampusRestaurant | null {
  const upper = rawMerchant.toUpperCase()
  for (const r of campusRestaurants) {
    if (r.aliases.some((alias) => upper.includes(alias.toUpperCase()))) {
      return r
    }
  }
  return null
}

function normalizeDate(raw: string): string {
  if (!raw || raw === 'Unknown') return 'Unknown'
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  const slashMatch = raw.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})$/)
  if (slashMatch) {
    const y = slashMatch[3].length === 2 ? `20${slashMatch[3]}` : slashMatch[3]
    return `${y}-${slashMatch[1].padStart(2, '0')}-${slashMatch[2].padStart(2, '0')}`
  }
  return raw
}

// ── Transaction extraction ────────────────────────────────────────────────────
// Handles common Canadian bank statement formats: TD, RBC, Scotiabank, BMO, CIBC.

export function extractTransactions(text: string): RawTransaction[] {
  const transactions: RawTransaction[] = []
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

  // Strict: DATE  MERCHANT  AMOUNT (2+ spaces as delimiter)
  const strictRe =
    /^(?:(\w{3}\s+\d{1,2}(?:,?\s*\d{4})?|\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}|\d{4}-\d{2}-\d{2}))\s{2,}(.+?)\s{2,}\$?([\d,]+\.\d{2})/

  // Loose: merchant + amount at end of line — only kept if food keyword matches
  const looseRe = /^(.{5,50}?)\s+\$?([\d,]+\.\d{2})\s*(?:CR|DR)?$/

  for (const line of lines) {
    const strict = line.match(strictRe)
    if (strict) {
      transactions.push({
        date: normalizeDate(strict[1]),
        rawMerchant: strict[2].trim().toUpperCase(),
        amount: parseFloat(strict[3].replace(',', '')),
      })
      continue
    }

    const loose = line.match(looseRe)
    if (loose) {
      const merchant = loose[1].trim().toUpperCase()
      if (isFoodMerchant(merchant)) {
        transactions.push({
          date: 'Unknown',
          rawMerchant: merchant,
          amount: parseFloat(loose[2].replace(',', '')),
        })
      }
    }
  }

  return transactions
}

// ── Main analysis ─────────────────────────────────────────────────────────────

export function analyzeStatement(
  rawText: string,
  selectedCampus?: string,
): AnalysisResult {
  const allTxs = extractTransactions(rawText)

  const matched: MatchedTransaction[] = []
  const categoryBreakdown: Record<string, number> = {}
  const campusHits: Record<string, number> = {}

  let totalFoodSpend = 0
  let campusSpend = 0
  let potentialSavings = 0

  for (const tx of allTxs) {
    if (!isFoodMerchant(tx.rawMerchant)) continue
    totalFoodSpend += tx.amount

    const restaurant = matchRestaurant(tx.rawMerchant)
    if (!restaurant) continue

    // Filter by selected campus if the user picked one
    if (selectedCampus && restaurant.campus !== selectedCampus) continue

    campusSpend += tx.amount
    campusHits[restaurant.campus] = (campusHits[restaurant.campus] ?? 0) + 1

    const cuisine = restaurant.cuisine
    categoryBreakdown[cuisine] = (categoryBreakdown[cuisine] ?? 0) + tx.amount

    const savings: SavingsSuggestion[] = restaurant.cheaperAlternatives
      .map((alt) => ({
        ...alt,
        estimatedSavings: parseFloat((tx.amount - alt.avgMealCost).toFixed(2)),
      }))
      .filter((s) => s.estimatedSavings > 0)

    potentialSavings += savings.reduce((sum, s) => sum + s.estimatedSavings, 0)

    matched.push({
      date: tx.date,
      merchant: restaurant.name,
      rawMerchant: tx.rawMerchant,
      amount: tx.amount,
      campus: restaurant.campus,
      cuisine,
      priceRange: restaurant.priceRange,
      savings,
    })
  }

  const detectedCampus =
    selectedCampus ??
    (Object.keys(campusHits).length > 0
      ? Object.entries(campusHits).sort((a, b) => b[1] - a[1])[0][0]
      : null)

  const topMerchant =
    matched.length > 0
      ? [...matched].sort((a, b) => b.amount - a.amount)[0].merchant
      : null

  const summary = buildSummary({
    campus: detectedCampus,
    campusSpend,
    potentialSavings,
    matchCount: matched.length,
    topMerchant,
  })

  return {
    campus: detectedCampus,
    totalFoodSpend: parseFloat(totalFoodSpend.toFixed(2)),
    campusSpend: parseFloat(campusSpend.toFixed(2)),
    potentialSavings: parseFloat(potentialSavings.toFixed(2)),
    matchedTransactions: matched,
    summary,
    categoryBreakdown,
    topMerchant,
  }
}

function buildSummary({
  campus,
  campusSpend,
  potentialSavings,
  matchCount,
  topMerchant,
}: {
  campus: string | null
  campusSpend: number
  potentialSavings: number
  matchCount: number
  topMerchant: string | null
}): string {
  if (matchCount === 0) {
    return 'No on-campus restaurant spending detected in this statement.'
  }
  const at = campus ? `at ${campus}` : 'on campus'
  let msg = `You spent $${campusSpend.toFixed(2)} ${at} across ${matchCount} transaction${matchCount !== 1 ? 's' : ''}.`
  if (potentialSavings > 0) {
    msg += ` Switching to cheaper on-campus options could save you $${potentialSavings.toFixed(2)}.`
  }
  if (topMerchant) {
    msg += ` Biggest spend: ${topMerchant}.`
  }
  return msg
}