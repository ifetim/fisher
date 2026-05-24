/**
 * Generates Plaid Sandbox custom users for student demo scenarios.
 * Run: node scripts/generate-plaid-student-users.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../src/data/plaid-test-users')
const MAX = 248
const START = new Date('2025-06-01')
const END = new Date('2026-05-22')

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
 * convention because that reads naturally (Payroll: +780, Rent: -950).
 *
 * Plaid's API uses the opposite convention: `amount` is positive when money
 * moves OUT of the account (debit) and negative when money moves IN (credit).
 * We flip the sign here so the emitted JSON matches what Plaid expects when
 * uploaded as a Sandbox custom user. Without this flip, payroll deposits get
 * categorized as TRANSFER_OUT (spending) and expenses get treated as income.
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

function trimToMax(all) {
  all.sort((a, b) => a.date_posted.localeCompare(b.date_posted))
  if (all.length <= MAX) return all

  const essential = all.filter((t) => t._essential)
  const optional = all.filter((t) => !t._essential)
  const room = MAX - essential.length
  return [...essential, ...optional.slice(-Math.max(0, room))].sort((a, b) =>
    a.date_posted.localeCompare(b.date_posted),
  )
}

function strip(list) {
  return list.map(({ _acct, _essential, ...t }) => t)
}

function byAcct(trimmed, key) {
  return strip(trimmed.filter((t) => t._acct === key))
}

function writeProfile(filename, dashboardUsername, accountTemplates, trimmed) {
  const accounts = accountTemplates
    .map((acct) => ({
      ...acct,
      transactions: byAcct(trimmed, acct._key),
    }))
    .map(({ _key, ...rest }) => rest)

  const out = { override_accounts: accounts }
  fs.writeFileSync(path.join(OUT_DIR, filename), `${JSON.stringify(out, null, 2)}\n`)

  const dates = trimmed.map((t) => t.date_posted)
  console.log(
    `${filename} (username: ${dashboardUsername}): ${trimmed.length} txs, ${dates[0]} → ${dates.at(-1)}, ${accounts.length} accounts`,
  )
}

function markEssential(tx) {
  tx._essential = true
  return tx
}

/** Broke second-year student — low balance, delivery habit, CC nearly maxed. */
function buildBrokeStudentTxs() {
  const all = []

  for (let cursor = new Date(START); cursor <= END; cursor = addDays(cursor, 1)) {
    const day = cursor.getDate()
    const month = cursor.getMonth()

    // Part-time campus job — biweekly
    if (day === 1 || day === 15) {
      all.push(markEssential(makeTx(cursor, 'Campus Bookstore Payroll', 620, 'checking')))
    }

    // Rent (shared apartment)
    if (day === 1) {
      all.push(markEssential(makeTx(cursor, 'Rent - Shared Apt', -875, 'checking')))
    }

    // OSAP drops (Sept + Jan)
    if ((month === 8 || month === 0) && day === 10) {
      all.push(markEssential(makeTx(cursor, 'OSAP Grant/Loan Deposit', 4200, 'checking')))
    }

    // Tuition hit when OSAP lands
    if ((month === 8 || month === 0) && day === 12) {
      all.push(markEssential(makeTx(cursor, 'University Tuition Payment', -3800, 'checking')))
    }

    if (day === 3) all.push(makeTx(cursor, 'Rogers Student Plan', -45, 'checking'))
    if (day === 8) all.push(makeTx(cursor, 'Spotify', -11.99, 'checking'))
    if (day === 9) all.push(makeTx(cursor, 'Crave', -14.99, 'checking'))

    // Heavy delivery — the problem pattern
    if ([4, 11, 18, 25].includes(day)) {
      const app = day % 2 === 0 ? 'DoorDash' : 'Uber Eats'
      all.push(makeTx(cursor, app, -randBetween(18, 42), 'credit'))
    }

  if (day === 6 || day === 20) {
      all.push(makeTx(cursor, 'Tim Hortons', -randBetween(3.5, 8.5), 'checking'))
    }

    // Groceries — tries to keep cheap
    if (day === 13) {
      all.push(makeTx(cursor, 'No Frills', -randBetween(28, 55), 'checking'))
    }

    // Textbooks / Amazon when broke → goes on card
    if ((month === 8 || month === 0) && day === 20) {
      all.push(makeTx(cursor, 'Amazon.ca - Textbooks', -randBetween(120, 280), 'credit'))
    }

    // Minimum CC payment only (can't afford more)
    if (day === 22) {
      all.push(markEssential(makeTx(cursor, 'TD Visa Minimum Payment', -35, 'checking')))
    }

    // Random card spending when checking is empty
    if (day === 17) {
      const shops = ['Shein', 'Shoppers Drug Mart', 'LCBO', 'Dollarama']
      all.push(makeTx(cursor, shops[month % shops.length], -randBetween(12, 65), 'credit'))
    }

    // Occasional overdraft / NSF stress
    if (month === 2 && day === 16) {
      all.push(markEssential(makeTx(cursor, 'Overdraft Fee', -5, 'checking')))
    }
    if (month === 4 && day === 14) {
      all.push(markEssential(makeTx(cursor, 'NSF Fee', -48, 'checking')))
    }

    // Rare tiny transfer to savings then pulled back
    if (day === 28 && month % 4 === 0) {
      all.push(makeTx(cursor, 'Transfer to Savings', -40, 'checking'))
      all.push(makeTx(cursor, 'Transfer from Chequing', 40, 'savings'))
    }
  }

  return trimToMax(all)
}

/** Co-op student with money everywhere — hard to see the full picture. */
function buildManyAccountsTxs() {
  const all = []

  for (let cursor = new Date(START); cursor <= END; cursor = addDays(cursor, 1)) {
    const day = cursor.getDate()
    const month = cursor.getMonth()
    const isCoopTerm = month >= 0 && month <= 3 // Jan–Apr co-op

    // Co-op pay → TD chequing; part-time fallback → RBC
    if (day === 1 || day === 15) {
      if (isCoopTerm) {
        all.push(markEssential(makeTx(cursor, 'Co-op Employer - Direct Deposit', 2850, 'td_checking')))
      } else {
        all.push(markEssential(makeTx(cursor, 'Campus Job Payroll', 780, 'rbc_checking')))
      }
    }

    if (day === 1) {
      all.push(markEssential(makeTx(cursor, 'Rent Payment', -950, isCoopTerm ? 'td_checking' : 'rbc_checking')))
    }

    // Parent help sometimes
    if (day === 5 && month % 3 === 1) {
      all.push(makeTx(cursor, 'E-Transfer from Mom', 200, 'rbc_checking'))
    }

    // Messy internal transfers
    if (day === 10) {
      all.push(makeTx(cursor, 'Transfer to EQ Savings', -300, 'td_checking'))
      all.push(markEssential(makeTx(cursor, 'Transfer from TD Chequing', 300, 'eq_savings')))
    }
    if (day === 24 && isCoopTerm) {
      all.push(makeTx(cursor, 'Transfer to BMO Savings', -150, 'td_checking'))
      all.push(makeTx(cursor, 'Transfer from TD', 150, 'bmo_savings'))
    }

    // Split spending across cards
    if ([7, 14, 21].includes(day)) {
      all.push(makeTx(cursor, 'Loblaws', -randBetween(45, 95), day === 21 ? 'td_visa' : 'rbc_checking'))
    }

    if ([3, 17].includes(day)) {
      all.push(makeTx(cursor, 'DoorDash', -randBetween(22, 48), 'amex'))
    }

    if (day === 4) all.push(makeTx(cursor, 'Rogers', -75, 'td_visa'))
    if (day === 8) all.push(makeTx(cursor, 'Netflix', -17.99, 'amex'))
    if (day === 11) all.push(makeTx(cursor, 'Spotify', -11.99, 'td_visa'))
    if (day === 9) all.push(makeTx(cursor, 'Presto', -150, 'rbc_checking'))

    // LOC draw for tuition (Sept) — student loan, not line of credit (Plaid sandbox breaks on LOC subtype)
    if (month === 8 && day === 8) {
      all.push(markEssential(makeTx(cursor, 'Tuition - Loan Disbursement', 5500, 'student_loan')))
    }
    if (month === 8 && day === 9) {
      all.push(markEssential(makeTx(cursor, 'University Tuition', -5500, 'td_checking')))
    }

    // Pay down loan slowly during co-op
    if (isCoopTerm && day === 20) {
      all.push(markEssential(makeTx(cursor, 'Student Loan Payment', -400, 'td_checking')))
    }

    // CC payments from different accounts
    if (day === 18) {
      all.push(markEssential(makeTx(cursor, 'TD Visa Payment', -randBetween(120, 280), 'td_checking')))
    }
    if (day === 19) {
      all.push(markEssential(makeTx(cursor, 'Amex Payment', -randBetween(80, 160), isCoopTerm ? 'td_checking' : 'rbc_checking')))
    }

    // Online shopping on Amex
    if (day === 26) {
      all.push(makeTx(cursor, 'Amazon.ca', -randBetween(25, 110), 'amex'))
    }
  }

  return trimToMax(all)
}

const brokeTrimmed = buildBrokeStudentTxs()
writeProfile('broke-student.json', 'broke_student', [
    {
      _key: 'checking',
      type: 'depository',
      subtype: 'checking',
      starting_balance: 47.18,
      meta: { name: 'Chequing', official_name: 'TD Student Chequing' },
      identity: {
        names: ['Alex Chen'],
        emails: [{ data: 'alex@email.com', primary: true, type: 'primary' }],
      },
    },
    {
      _key: 'savings',
      type: 'depository',
      subtype: 'savings',
      starting_balance: 85,
      meta: { name: 'Savings', official_name: 'TD Every Day Savings' },
    },
    {
      _key: 'credit',
      type: 'credit',
      subtype: 'credit card',
      starting_balance: 3872.4,
      meta: { name: 'Credit Card', official_name: 'TD Student Visa' },
      liability: {
        type: 'credit',
        purchase_apr: 24.99,
        minimum_payment_amount: 35,
        last_payment_amount: 35,
      },
    },
  ],
  brokeTrimmed,
)

const manyTrimmed = buildManyAccountsTxs()
writeProfile('many-accounts-student.json', 'many_accounts', [
    {
      _key: 'rbc_checking',
      type: 'depository',
      subtype: 'checking',
      starting_balance: 312.6,
      meta: { name: 'RBC Chequing', official_name: 'RBC Student Banking' },
      identity: {
        names: ['Sam Okonkwo'],
        emails: [{ data: 'sam@email.com', primary: true, type: 'primary' }],
      },
    },
    {
      _key: 'td_checking',
      type: 'depository',
      subtype: 'checking',
      starting_balance: 1840.25,
      meta: { name: 'TD Chequing', official_name: 'TD Unlimited Chequing' },
    },
    {
      _key: 'bmo_savings',
      type: 'depository',
      subtype: 'savings',
      starting_balance: 620,
      meta: { name: 'BMO Savings', official_name: 'BMO Smart Saver' },
    },
    {
      _key: 'eq_savings',
      type: 'depository',
      subtype: 'savings',
      starting_balance: 2400,
      meta: { name: 'EQ Bank Savings', official_name: 'EQ Bank Savings Plus' },
    },
    {
      _key: 'td_visa',
      type: 'credit',
      subtype: 'credit card',
      starting_balance: 1240.8,
      meta: { name: 'TD Visa', official_name: 'TD Cash Back Visa' },
      liability: {
        type: 'credit',
        purchase_apr: 21.99,
        minimum_payment_amount: 25,
        last_payment_amount: 180,
      },
    },
    {
      _key: 'amex',
      type: 'credit',
      subtype: 'credit card',
      starting_balance: 680.15,
      meta: { name: 'Amex', official_name: 'Amex Cobalt' },
      liability: {
        type: 'credit',
        purchase_apr: 20.99,
        minimum_payment_amount: 25,
        last_payment_amount: 95,
      },
    },
    {
      _key: 'student_loan',
      type: 'loan',
      subtype: 'student',
      starting_balance: 4200,
      meta: { name: 'Student Loan', official_name: 'RBC Student Loan' },
      liability: {
        type: 'student',
        minimum_payment_amount: 50,
      },
    },
  ],
  manyTrimmed,
)

console.log('Done — paste each file into Plaid Dashboard as a separate test user.')
