import type { PlaidAccount } from './plaidApi'

/**
 * Plaid account categorization for Dashboard display.
 *
 *   primary        — checking, savings, credit card (always shown individually)
 *   investments    — IRA, 401k, brokerage, HSA, etc. (collapsed by default)
 *   loans          — student, mortgage, auto, personal (collapsed by default)
 *   otherDeposits  — CD, money market, prepaid (collapsed by default)
 *
 * Anything we don't recognize falls back to `otherDeposits` so it still shows up.
 */
export type GroupedAccounts = {
  primary: PlaidAccount[]
  investments: PlaidAccount[]
  loans: PlaidAccount[]
  otherDeposits: PlaidAccount[]
}

const PRIMARY_DEPOSITORY_SUBTYPES = new Set([
  'checking',
  'savings',
  'paypal', // common student-facing
])

export function groupPlaidAccounts(accounts: PlaidAccount[]): GroupedAccounts {
  const groups: GroupedAccounts = {
    primary: [],
    investments: [],
    loans: [],
    otherDeposits: [],
  }

  for (const account of accounts) {
    const type = account.type
    const subtype = account.subtype ?? ''

    if (type === 'credit') {
      groups.primary.push(account)
    } else if (type === 'depository' && PRIMARY_DEPOSITORY_SUBTYPES.has(subtype)) {
      groups.primary.push(account)
    } else if (type === 'investment' || type === 'brokerage') {
      groups.investments.push(account)
    } else if (type === 'loan') {
      groups.loans.push(account)
    } else {
      // depository CD/money market/cash management — anything else
      groups.otherDeposits.push(account)
    }
  }

  return groups
}

/**
 * Total balance for a group. Loan accounts represent debt — Plaid returns
 * positive balances for them but they reduce net worth, so we flip the sign.
 * Credit cards already get flipped when we display per-account; for group
 * totals we use the same convention.
 */
export function groupTotal(accounts: PlaidAccount[], isDebt = false): number {
  const sum = accounts.reduce((acc, a) => {
    const value = a.balance.current ?? a.balance.available ?? 0
    return acc + Math.abs(value)
  }, 0)
  return isDebt ? -sum : sum
}

/** Net worth = assets - debts, computed from Plaid account groups. */
export function netWorthFromGroups(groups: GroupedAccounts): number {
  const primary = groups.primary.reduce((sum, a) => {
    const value = a.balance.current ?? a.balance.available ?? 0
    // Credit cards are debt — Plaid returns positive but we subtract
    return sum + (a.type === 'credit' ? -Math.abs(value) : value)
  }, 0)
  const investments = groupTotal(groups.investments)
  const otherDeposits = groupTotal(groups.otherDeposits)
  const loans = groupTotal(groups.loans, true) // negative

  return primary + investments + otherDeposits + loans
}
