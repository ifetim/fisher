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
import type { Account } from '../types'
import type { PlaidAccount } from '@/lib/plaidApi'
import { useBalanceVisibility } from './useBalanceVisibility'

/**
 * Convert a Plaid account into the app's Account shape so Dashboard cards
 * can render demo data and live Plaid data with the same component.
 * Credit accounts in Plaid carry a positive `current` balance (money owed),
 * so we flip the sign to match our "negative = liability" convention.
 */
function plaidToAccount(p: PlaidAccount, userId: number, index: number): Account {
  const type: Account['type'] =
    p.type === 'credit'   ? 'credit'
  : p.subtype === 'savings' ? 'savings'
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
  const { transactions, plaidSnapshot } = useFinance()
  const visibility = useBalanceVisibility(false)

  const data = useMemo(() => {
    if (!user) return null

    const localAccounts = getAccountsForUser(user.id)
    const plaidAccounts = (plaidSnapshot?.accounts ?? []).map((a, i) =>
      plaidToAccount(a, user.id, i),
    )
    const accounts = [...localAccounts, ...plaidAccounts]

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const firstName = user.name.split(' ')[0] ?? user.name

    return {
      greeting: getTimeGreeting(firstName),
      accounts,
      netWorth: computeNetWorth(accounts),
      spendingThisMonth: computeMonthSpending(transactions, year, month),
      quickInsights: buildQuickInsights(transactions),
      institutionName: plaidSnapshot?.institution?.name ?? null,
    }
  }, [user, transactions, plaidSnapshot])

  return { ...visibility, ...data }
}
