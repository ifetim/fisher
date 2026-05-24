import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFinance } from '../context/FinanceContext'
import { getAccountsForUser } from '../data'
import {
  buildQuickInsights,
  computeMonthSpending,
  computeNetWorth,
  getTimeGreeting,
} from '../lib/dashboard'
import {
  groupPlaidAccounts,
  netWorthFromGroups,
  type GroupedAccounts,
} from '../lib/accountGrouping'
import type { Account } from '../types'
import type { PlaidAccount } from '@/lib/plaidApi'
import { useBalanceVisibility } from './useBalanceVisibility'

/**
 * Convert a Plaid account into the local Account shape so the existing
 * account-card components can render Plaid data without changes. Credit
 * accounts in Plaid carry a positive `current` (money owed); we flip it so
 * "negative balance = liability" matches our convention.
 */
function plaidToAccount(p: PlaidAccount, userId: number, index: number): Account {
  const type: Account['type'] =
    p.type === 'credit'
      ? 'credit'
      : p.subtype === 'savings'
        ? 'savings'
        : 'chequing'

  const rawBalance = p.balance.current ?? p.balance.available ?? 0
  const balance = type === 'credit' ? -Math.abs(rawBalance) : rawBalance

  return {
    id: -(1000 + index),
    userId,
    name: p.name + (p.mask ? ` ··${p.mask}` : ''),
    bank: 'Plaid',
    balance,
    type,
  }
}

export function useDashboard() {
  const { user } = useAuth()
  const { transactions, plaidSnapshot, plaidConnected } = useFinance()
  const visibility = useBalanceVisibility(false)

  const data = useMemo(() => {
    if (!user) return null

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const firstName = user.name.split(' ')[0] ?? user.name

    // --- Account selection: real Plaid data takes over once connected ---
    const plaidAccountsRaw = plaidSnapshot?.accounts ?? []
    const groups: GroupedAccounts = plaidConnected
      ? groupPlaidAccounts(plaidAccountsRaw)
      : { primary: [], investments: [], loans: [], otherDeposits: [] }

    // Primary card list — what shows individually on Dashboard
    const primaryAccounts: Account[] = plaidConnected
      ? groups.primary.map((a, i) => plaidToAccount(a, user.id, i))
      : getAccountsForUser(user.id)

    // Net Worth — Plaid covers everything when connected; else from demo
    const netWorth = plaidConnected
      ? netWorthFromGroups(groups)
      : computeNetWorth(getAccountsForUser(user.id))

    return {
      greeting: getTimeGreeting(firstName),
      accounts: primaryAccounts,
      groupedAccounts: groups,
      netWorth,
      spendingThisMonth: computeMonthSpending(transactions, year, month),
      quickInsights: buildQuickInsights(transactions),
      institutionName: plaidSnapshot?.institution?.name ?? null,
      plaidConnected,
    }
  }, [user, transactions, plaidSnapshot, plaidConnected])

  return { ...visibility, ...data }
}
