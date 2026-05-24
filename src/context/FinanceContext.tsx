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
import type { NormalizedTransaction } from '@/lib/plaid/normalizeTransaction'
import {
  disconnectPlaid,
  fetchPlaidSnapshot,
  fetchPlaidStatus,
  fetchPlaidTransactions,
  type PlaidSnapshot,
} from '@/lib/plaidApi'
import { useAuth } from './AuthContext'

const UPLOADED_KEY      = 'clearmint-uploaded-txs'
const GOALS_KEY         = 'clearmint-extra-goals'
const PLAID_KEY         = 'clearmint-plaid-txs'
const PLAID_SNAPSHOT_KEY = 'clearmint-plaid-snapshot'

type FinanceContextValue = {
  transactions: Transaction[]
  addUploadedTransactions: (rows: Omit<Transaction, 'id'>[]) => void
  addPlaidTransactions: (txs: NormalizedTransaction[]) => void
  plaidConnected: boolean
  plaidSyncing: boolean
  plaidSnapshot: PlaidSnapshot | null
  syncPlaid: () => Promise<void>
  disconnectPlaidAccount: () => Promise<void>
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

/** Convert a Plaid NormalizedTransaction to the app's Transaction shape. */
function plaidToTransaction(tx: NormalizedTransaction, index: number): Transaction {
  return {
    // Use large negative IDs so they never collide with local demo data
    id: -(1_000_000 + index),
    accountId: 0,  // Plaid accounts aren't in local accounts.json
    date: tx.date,
    merchant: tx.merchant,
    category: tx.category,
    amount: tx.amount,
    type: tx.type,
  }
}

let nextUploadId = -1
let nextGoalId   = 1000

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [uploaded,       setUploaded]       = useState<Transaction[]>([])
  const [extraGoals,     setExtraGoals]     = useState<SavingsPlan[]>([])
  const [plaidRaw,       setPlaidRaw]       = useState<NormalizedTransaction[]>([])
  const [plaidSnapshot,  setPlaidSnapshot]  = useState<PlaidSnapshot | null>(null)
  const [plaidConnected, setPlaidConnected] = useState(false)
  const [plaidSyncing,   setPlaidSyncing]   = useState(false)

  useEffect(() => {
    setUploaded(loadJson<Transaction[]>(UPLOADED_KEY, []))
    setExtraGoals(loadJson<SavingsPlan[]>(GOALS_KEY, []))
    setPlaidRaw(loadJson<NormalizedTransaction[]>(PLAID_KEY, []))
    setPlaidSnapshot(loadJson<PlaidSnapshot | null>(PLAID_SNAPSHOT_KEY, null))
  }, [])

  // Persist each slice whenever it changes
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PLAID_KEY, JSON.stringify(plaidRaw))
    }
  }, [plaidRaw])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (plaidSnapshot) {
      localStorage.setItem(PLAID_SNAPSHOT_KEY, JSON.stringify(plaidSnapshot))
    } else {
      localStorage.removeItem(PLAID_SNAPSHOT_KEY)
    }
  }, [plaidSnapshot])

  // Auto-sync Plaid whenever a user logs in
  useEffect(() => {
    if (!user) {
      setPlaidConnected(false)
      return
    }
    const userId = String(user.id)
    void (async () => {
      try {
        const connected = await fetchPlaidStatus(userId)
        setPlaidConnected(connected)
        if (connected) {
          setPlaidSyncing(true)
          // Run snapshot + transactions in parallel — each tolerates the other failing
          const [snapResult, txsResult] = await Promise.allSettled([
            fetchPlaidSnapshot(userId),
            fetchPlaidTransactions(userId),
          ])
          if (snapResult.status === 'fulfilled') setPlaidSnapshot(snapResult.value)
          if (txsResult.status === 'fulfilled')  setPlaidRaw(txsResult.value)
        }
      } catch {
        // Plaid not configured or server offline — silent on startup
      } finally {
        setPlaidSyncing(false)
      }
    })()
  }, [user])

  // Manual re-sync — called by PlaidConnect after exchange or Refresh button
  const syncPlaid = useCallback(async () => {
    if (!user) return
    const userId = String(user.id)
    setPlaidSyncing(true)
    try {
      const [snapResult, txsResult] = await Promise.allSettled([
        fetchPlaidSnapshot(userId),
        fetchPlaidTransactions(userId),
      ])
      if (snapResult.status === 'fulfilled') setPlaidSnapshot(snapResult.value)
      if (txsResult.status === 'fulfilled')  setPlaidRaw(txsResult.value)
      setPlaidConnected(true)
    } catch (err) {
      console.error('Plaid sync failed:', err)
    } finally {
      setPlaidSyncing(false)
    }
  }, [user])

  const baseTransactions = useMemo(
    () => (user ? getTransactionsForUser(user.id) : []),
    [user],
  )

  const plaidTransactions = useMemo(
    () => plaidRaw.map((tx, i) => plaidToTransaction(tx, i)),
    [plaidRaw],
  )

  // Merge: demo data + CSV uploads + Plaid live data
  const transactions = useMemo(
    () => [...baseTransactions, ...uploaded, ...plaidTransactions],
    [baseTransactions, uploaded, plaidTransactions],
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

  /** Replace the current Plaid transaction set. Called after a successful sync. */
  const addPlaidTransactions = useCallback((txs: NormalizedTransaction[]) => {
    setPlaidRaw(txs)
  }, [])

  const disconnectPlaidAccount = useCallback(async () => {
    if (!user) return
    const userId = String(user.id)
    try {
      await disconnectPlaid(userId)
    } catch (err) {
      console.error('Disconnect failed:', err)
    }
    setPlaidRaw([])
    setPlaidSnapshot(null)
    setPlaidConnected(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PLAID_KEY)
      localStorage.removeItem(PLAID_SNAPSHOT_KEY)
    }
  }, [user])

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
      addPlaidTransactions,
      plaidConnected,
      plaidSyncing,
      plaidSnapshot,
      syncPlaid,
      disconnectPlaidAccount,
      savingsPlans,
      addSavingsGoal,
    }),
    [transactions, addUploadedTransactions, addPlaidTransactions, plaidConnected, plaidSyncing, plaidSnapshot, syncPlaid, disconnectPlaidAccount, savingsPlans, addSavingsGoal],
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
