'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useAuth } from '../../context/AuthContext'
import {
  createLinkToken,
  exchangePublicToken,
  fetchPlaidStatus,
  fetchPlaidTransactions,
  type NormalizedTransaction,
} from '@/lib/plaidApi'
import './PlaidConnect.css'

const TEST_USER_ID = 'plaid-test-user'

type PlaidConnectProps = {
  userId?: string
  maxRows?: number
  onTransactions?: (transactions: NormalizedTransaction[]) => void
}

export function PlaidConnect({
  userId: userIdOverride,
  maxRows = 5,
  onTransactions,
}: PlaidConnectProps) {
  const { user } = useAuth()
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [transactions, setTransactions] = useState<NormalizedTransaction[]>([])

  const userId = userIdOverride ?? (user ? String(user.id) : '')

  const loadTransactions = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const txs = await fetchPlaidTransactions(userId)
      setTransactions(txs)
      onTransactions?.(txs)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load Plaid transactions.',
      )
    } finally {
      setLoading(false)
    }
  }, [userId, onTransactions])

  useEffect(() => {
    if (!userId) return

    void (async () => {
      try {
        const isConnected = await fetchPlaidStatus(userId)
        setConnected(isConnected)
        if (isConnected) await loadTransactions()
      } catch {
        /* env or server offline */
      }
    })()
  }, [userId, loadTransactions])

  useEffect(() => {
    if (!userId || connected) return

    void (async () => {
      try {
        const token = await createLinkToken(userId)
        setLinkToken(token)
        setError('')
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Plaid not configured. Add keys to .env.local',
        )
      }
    })()
  }, [userId, connected])

  const onSuccess = useCallback(
    async (publicToken: string) => {
      if (!userId) return
      setLoading(true)
      setError('')
      try {
        await exchangePublicToken(userId, publicToken)
        setConnected(true)
        await loadTransactions()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Token exchange failed.',
        )
      } finally {
        setLoading(false)
      }
    },
    [userId, loadTransactions],
  )

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  })

  if (!userId) return null

  const visible =
    maxRows <= 0 ? transactions : transactions.slice(0, maxRows)

  return (
    <section className="plaid-connect">
      <h2 className="plaid-connect__title">Connect your bank</h2>
      <p className="plaid-connect__text">
        Plaid sandbox: use <strong>First Platypus Bank</strong> with user_good / pass_good
      </p>

      {!connected ? (
        <>
          <button
            type="button"
            className="plaid-connect__btn"
            disabled={!ready || loading || !linkToken}
            onClick={() => open()}
          >
            {loading ? 'Connecting…' : 'Connect bank'}
          </button>
          {linkToken && ready ? (
            <p className="plaid-connect__ready">Plaid ready — tap to open sandbox</p>
          ) : !error && !linkToken ? (
            <p className="plaid-connect__ready">Loading Plaid…</p>
          ) : null}
        </>
      ) : (
        <p className="plaid-connect__status">
          Connected · {transactions.length} live transactions
        </p>
      )}

      {error ? <p className="plaid-connect__error">{error}</p> : null}

      {visible.length > 0 ? (
        <ul className="plaid-connect__list">
          {visible.map((tx) => (
            <li key={tx.id} className="plaid-connect__row">
              <span>
                {tx.merchant}
                <small> · {tx.date}</small>
              </span>
              <span className={tx.amount >= 0 ? 'amount--income' : 'amount--spend'}>
                {formatAmount(tx.amount)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function formatAmount(amount: number) {
  const prefix = amount >= 0 ? '+' : ''
  return `${prefix}$${Math.abs(amount).toFixed(2)}`
}

export { TEST_USER_ID }
