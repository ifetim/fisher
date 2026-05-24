'use client'

import { useCallback, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { filterTransactions } from '@/lib/transactions'
import {
  buildCategoryBudgetRows,
  loadCategoryBudgets,
  saveCategoryBudget,
  totalBudgetLimit,
  totalBudgetSpent,
} from '@/lib/categoryBudgets'

export function useCategoryBudgets() {
  const { user } = useAuth()
  const { transactions } = useFinance()
  const [version, setVersion] = useState(0)

  const monthTx = useMemo(
    () => filterTransactions(transactions, { accountId: 'all', period: 'month', category: 'all' }),
    [transactions],
  )

  const limits = useMemo(() => {
    if (!user) return {}
    void version
    return loadCategoryBudgets(user.id)
  }, [user, version])

  const rows = useMemo(
    () => (user ? buildCategoryBudgetRows(monthTx, limits) : []),
    [user, monthTx, limits],
  )

  const setLimit = useCallback(
    (category: string, limit: number) => {
      if (!user) return
      saveCategoryBudget(user.id, category, limit)
      setVersion((v) => v + 1)
    },
    [user],
  )

  return {
    rows,
    totalLimit: totalBudgetLimit(rows),
    totalSpent: totalBudgetSpent(rows),
    setLimit,
  }
}
