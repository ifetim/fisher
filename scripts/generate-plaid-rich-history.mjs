/**
 * Generates src/data/plaid-test-users/rich-history.json — a Plaid Sandbox
 * custom user with ~12 months of explicit transactions (Plaid cap ~250).
 * Run: node scripts/generate-plaid-rich-history.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/data/plaid-test-users/rich-history.json')
const MAX = 248

function pad(n) {
  return String(n).padStart(2, '0')
}

function fmt(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function randBetween(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100
}

/**
 * Build a transaction in Plaid's sign convention.
 *
 * Call sites use the intuitive "positive = income / negative = expense"
 * convention. Plaid's API uses the opposite (positive = money OUT). We flip
 * the sign here so the generated JSON is correct when uploaded as a Sandbox
 * custom user.
 */
function makeTx(date, description, amount, acct) {
  const s = fmt(date)
  return {
    date_transacted: s,
    date_posted: s,
    amount: -amount,
    description,
    currency: 'CAD',
    _acct: acct,
  }
}

const start = new Date('2025-06-01')
const end = new Date('2026-05-22')
const all = []

for (let cursor = new Date(start); cursor <= end; cursor = addDays(cursor, 1)) {
  const day = cursor.getDate()
  const month = cursor.getMonth()

  if (day === 1 || day === 15) {
    all.push(makeTx(cursor, 'Employer Inc - Direct Deposit', 2100, 'checking'))
  }
  if (day === 4) all.push(makeTx(cursor, 'Rogers Wireless', -85, 'checking'))
  if (day === 2) all.push(makeTx(cursor, 'Hydro One', -randBetween(78, 112), 'checking'))
  if (day === 8) all.push(makeTx(cursor, 'Netflix', -17.99, 'checking'))
  if (day === 11) all.push(makeTx(cursor, 'Spotify', -11.99, 'checking'))
  if (day === 7) {
    all.push(makeTx(cursor, 'Transfer to Savings', -250, 'checking'))
    all.push(makeTx(cursor, 'Transfer from Chequing', 250, 'savings'))
  }
  if (day === 16) {
    all.push(makeTx(cursor, 'TD Visa Payment', -randBetween(180, 420), 'checking'))
  }
  if (day === 9) all.push(makeTx(cursor, 'Presto Auto-Load', -150, 'checking'))

  // Weekly groceries (one trip)
  if (day === 12) {
    all.push(makeTx(cursor, month % 3 === 0 ? 'Costco' : 'Loblaws', -randBetween(62, 165), 'checking'))
  }

  // Biweekly food / coffee
  if (day === 5 || day === 19) {
    const merchants = ['DoorDash', 'Tim Hortons', 'Starbucks', 'SkipTheDishes']
    const m = merchants[(month + day) % merchants.length]
    all.push(makeTx(cursor, m, -randBetween(5, m.includes('Dash') || m.includes('Skip') ? 42 : 12), 'checking'))
  }

  if (day === 14) all.push(makeTx(cursor, 'Shell Gas Station', -randBetween(42, 68), 'checking'))
  if (day === 22) all.push(makeTx(cursor, 'Uber', -randBetween(12, 28), 'checking'))

  // Credit card — twice per month
  if (day === 6 || day === 20) {
    const ccMerchants = [
      ['Amazon.ca', 35, 120],
      ['Zara', 60, 140],
      ['Shoppers Drug Mart', 18, 65],
      ['LCBO', 25, 55],
      ['Best Buy', 80, 280],
    ]
    const pick = ccMerchants[(month + day) % ccMerchants.length]
    all.push(makeTx(cursor, pick[0], -randBetween(pick[1], pick[2]), 'credit'))
  }

  if ((month === 10 || month === 11) && day === 28) {
    all.push(makeTx(cursor, 'Amazon.ca', -randBetween(45, 180), 'credit'))
  }
}

all.sort((a, b) => a.date_posted.localeCompare(b.date_posted))

// If over Plaid's limit, drop optional credit-card purchases first (keep payroll + bills).
let trimmed = all
if (trimmed.length > MAX) {
  const essential = trimmed.filter(
    (t) =>
      t._acct !== 'credit' ||
      t.description === 'Amazon.ca' && t.date_posted.endsWith('-28'),
  )
  const optionalCredit = trimmed.filter(
    (t) => t._acct === 'credit' && !essential.includes(t),
  )
  const room = MAX - essential.length
  trimmed = [...essential, ...optionalCredit.slice(-Math.max(0, room))]
  trimmed.sort((a, b) => a.date_posted.localeCompare(b.date_posted))
}

const strip = (list) => list.map(({ _acct, ...t }) => t)
const checkingTx = strip(trimmed.filter((t) => t._acct === 'checking'))
const savingsTx = strip(trimmed.filter((t) => t._acct === 'savings'))
const creditTx = strip(trimmed.filter((t) => t._acct === 'credit'))

const config = {
  override_accounts: [
    {
      type: 'depository',
      subtype: 'checking',
      starting_balance: 2847.5,
      meta: { name: 'Chequing', official_name: 'RBC Day to Day Banking' },
      identity: {
        names: ['Fe Martinez'],
        emails: [{ data: 'fe@email.com', primary: true, type: 'primary' }],
      },
      transactions: checkingTx,
    },
    {
      type: 'depository',
      subtype: 'savings',
      starting_balance: 5200,
      meta: { name: 'Savings', official_name: 'RBC High Interest eSavings' },
      transactions: savingsTx,
    },
    {
      type: 'credit',
      subtype: 'credit card',
      starting_balance: 843.2,
      meta: { name: 'Credit Card', official_name: 'TD Cash Back Visa' },
      liability: {
        type: 'credit',
        purchase_apr: 20.99,
        minimum_payment_amount: 25,
        last_payment_amount: 320,
      },
      transactions: creditTx,
    },
  ],
}

fs.writeFileSync(OUT, `${JSON.stringify(config, null, 2)}\n`)
const total = checkingTx.length + savingsTx.length + creditTx.length
const dates = trimmed.map((t) => t.date_posted)
console.log(`Wrote ${OUT}`)
console.log(`Transactions: checking=${checkingTx.length}, savings=${savingsTx.length}, credit=${creditTx.length}, total=${total}`)
console.log(`Date range: ${dates[0]} → ${dates.at(-1)}`)
