/**
 * Merchant-name → canonical budget category mapping.
 *
 * Plaid's `personal_finance_category` is unreliable for Sandbox custom users
 * (most things end up as TRANSFER_OUT / OTHER / GENERAL_MERCHANDISE), and even
 * in production it's coarse. This file maps the merchant/description text we
 * actually see in our demo data + common Canadian retailers to the categories
 * our UI knows how to render.
 *
 * Rules are scanned in order — put more specific patterns first (e.g. "Uber
 * Eats" must beat plain "Uber").
 */

export type MerchantCategorization = {
  /** Canonical category — matches keys in DEFAULT_CATEGORY_BUDGETS, plus 'Income'. */
  category: string
  /** True if this transaction represents money coming IN to the account. */
  isIncome: boolean
}

type Rule = { pattern: RegExp; category: string; income?: boolean }

const RULES: Rule[] = [
  // ── Income (deposits, payroll, scholarships, transfers IN, refunds) ──
  { pattern: /\b(payroll|salary|paycheck|wages|direct deposit|employer)\b/i, category: 'Income', income: true },
  { pattern: /\b(osap|scholarship|grant|bursary)\b/i, category: 'Income', income: true },
  { pattern: /\bloan (deposit|disbursement)\b/i, category: 'Income', income: true },
  { pattern: /\b(e-?transfer from|transfer from|interac.*from|deposit from)\b/i, category: 'Income', income: true },
  { pattern: /\brefund\b/i, category: 'Income', income: true },
  { pattern: /\binterest (earned|deposit|credit)\b/i, category: 'Income', income: true },

  // ── Internal transfers OUT / credit card payments (money leaves but isn't real spending) ──
  { pattern: /\b(transfer to|interac.*to)\b/i, category: 'Other' },
  { pattern: /\b(visa|amex|mastercard|credit card)\b.*\bpayment\b/i, category: 'Other' },

  // ── Bank fees ──
  { pattern: /\b(overdraft|nsf|service charge|monthly fee|account fee)\b/i, category: 'Other' },

  // ── Food delivery ──
  { pattern: /(doordash|uber\s*eats|skip\s*the\s*dishes|skipthedishes|grubhub|just\s*eat)/i, category: 'Food & Dining' },

  // ── Restaurants / cafes / fast food ──
  { pattern: /(starbucks|tim hortons|second cup|mcdonald|burger king|wendy|kfc|subway|chipotle|nobu|domino|pizza|sushi|ramen|cafe|coffee|restaurant|bistro|grill|kitchen|diner|tacos?\b|noodle)/i, category: 'Food & Dining' },

  // ── Groceries ──
  { pattern: /(loblaws|no frills|metro\b|sobeys|costco|walmart|whole foods|safeway|food basics|farm boy|fortinos|freshco|t&t|h-?mart)/i, category: 'Groceries' },

  // ── Travel (airlines + hotels — must come before "Transport" so flights aren't lumped as transit) ──
  { pattern: /(westjet|air\s*canada|porter airlines|swoop|flair airlines|airline|airways)/i, category: 'Travel' },
  { pattern: /(marriott|hilton|sheraton|airbnb|hotel|expedia|booking\.com|hostel)/i, category: 'Travel' },

  // ── Transport (rideshare, transit, gas) ──
  { pattern: /\buber\b/i, category: 'Transport' }, // Uber Eats already matched above
  { pattern: /\blyft\b/i, category: 'Transport' },
  { pattern: /(via rail|presto|ttc|go transit|metropass|compass card|bus pass|transit)/i, category: 'Transport' },
  { pattern: /(shell|petro-?canada|esso|husky|chevron|gas station|fuel)/i, category: 'Transport' },

  // ── Entertainment / subscriptions ──
  { pattern: /(netflix|spotify|crave|disney|hulu|prime video|youtube premium|apple music|hbo|paramount|tidal)/i, category: 'Entertainment' },
  { pattern: /(cineplex|movie theatre|cinema|concert|ticketmaster|stubhub|steam\b|playstation|nintendo|xbox)/i, category: 'Entertainment' },

  // ── Bills & Utilities (telecom, utilities, rent, insurance, loan/tuition payments) ──
  { pattern: /(rogers|bell\b|telus|fido|koodo|chatr|virgin mobile|freedom mobile)/i, category: 'Bills & Utilities' },
  { pattern: /(hydro|enbridge|union gas|electric|natural gas|utility|utilities|water bill)/i, category: 'Bills & Utilities' },
  { pattern: /\brent\b/i, category: 'Bills & Utilities' },
  { pattern: /\binsurance\b/i, category: 'Bills & Utilities' },
  { pattern: /(student loan payment|loan payment|mortgage)/i, category: 'Bills & Utilities' },
  { pattern: /(tuition|university|college)/i, category: 'Bills & Utilities' },

  // ── Health ──
  { pattern: /(shoppers drug mart|pharmacy|rexall|dental|dentist|clinic|doctor|hospital|chiropractor)/i, category: 'Health' },
  { pattern: /(equinox|goodlife|gym\b|yoga|pilates|crossfit|fitness)/i, category: 'Health' },

  // ── Shopping ──
  { pattern: /(amazon|aliexpress|shein|temu|ebay|etsy|wish\.com)/i, category: 'Shopping' },
  { pattern: /(zara|h&m|aritzia|nordstrom|hudsons bay|sephora|indigo|chapters|best buy|apple store|alo yoga|simons|uniqlo|gap\b|old navy|lululemon)/i, category: 'Shopping' },
  { pattern: /(lcbo|beer store|liquor)/i, category: 'Shopping' },
  { pattern: /(dollarama|dollar store|dollar tree)/i, category: 'Shopping' },
]

/**
 * Categorize a transaction by its merchant/description text.
 * Returns `null` when no rule matches (caller should fall back to Plaid PFC).
 */
export function categorizeMerchant(merchant: string): MerchantCategorization | null {
  if (!merchant) return null
  for (const rule of RULES) {
    if (rule.pattern.test(merchant)) {
      return { category: rule.category, isIncome: rule.income ?? false }
    }
  }
  return null
}
