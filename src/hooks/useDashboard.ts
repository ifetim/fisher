import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getAccountsForUser,
  getTransactionsForUser,
} from '../data'
import {
  buildQuickInsights,
  computeMonthSpending,
  computeNetWorth,
  getTimeGreeting,
} from '../lib/dashboard'
import { useBalanceVisibility } from './useBalanceVisibility'

export function useDashboard() {
  const { user } = useAuth()
  const visibility = useBalanceVisibility(false)

  const data = useMemo(() => {
    if (!user) return null

    const accounts = getAccountsForUser(user.id)
    const transactions = getTransactionsForUser(user.id)
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
    }
  }, [user])

  return { ...visibility, ...data }
}
