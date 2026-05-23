'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getSavingsPlansForUser,
  getTransactionsForUser,
} from '../data'
import type { SavingsPlan, Transaction } from '../types'
import { useAuth } from './AuthContext'

const UPLOADED_KEY = 'clearmint-uploaded-txs'
const GOALS_KEY = 'clearmint-extra-goals'

type FinanceContextValue = {
  transactions: Transaction[]
  addUploadedTransactions: (rows: Omit<Transaction, 'id'>[]) => void
  savingsPlans: SavingsPlan[]
  addSavingsGoal: (goal: Omit<SavingsPlan, 'id' | 'userId'>) => void
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

let nextUploadId = -1
let nextGoalId = 1000

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [uploaded, setUploaded] = useState<Transaction[]>([])
  const [extraGoals, setExtraGoals] = useState<SavingsPlan[]>([])

  useEffect(() => {
    setUploaded(loadJson<Transaction[]>(UPLOADED_KEY, []))
    setExtraGoals(loadJson<SavingsPlan[]>(GOALS_KEY, []))
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(UPLOADED_KEY, JSON.stringify(uploaded))
    }
  }, [uploaded])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GOALS_KEY, JSON.stringify(extraGoals))
    }
  }, [extraGoals])

  const baseTransactions = useMemo(
    () => (user ? getTransactionsForUser(user.id) : []),
    [user],
  )

  const transactions = useMemo(
    () => [...baseTransactions, ...uploaded],
    [baseTransactions, uploaded],
  )

  const savingsPlans = useMemo(() => {
    if (!user) return []
    return [...getSavingsPlansForUser(user.id), ...extraGoals.filter((g) => g.userId === user.id)]
  }, [user, extraGoals])

  const addUploadedTransactions = useCallback((rows: Omit<Transaction, 'id'>[]) => {
    const withIds = rows.map((r) => ({
      ...r,
      id: nextUploadId--,
    }))
    setUploaded((prev) => [...prev, ...withIds])
  }, [])

  const addSavingsGoal = useCallback(
    (goal: Omit<SavingsPlan, 'id' | 'userId'>) => {
      if (!user) return
      const plan: SavingsPlan = {
        ...goal,
        id: nextGoalId++,
        userId: user.id,
      }
      setExtraGoals((prev) => [...prev, plan])
    },
    [user],
  )

  const value = useMemo(
    () => ({
      transactions,
      addUploadedTransactions,
      savingsPlans,
      addSavingsGoal,
    }),
    [transactions, addUploadedTransactions, savingsPlans, addSavingsGoal],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
