import { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useAuth } from '../../context/AuthContext'
import {
  createLinkToken,
  exchangePublicToken,
  fetchPlaidStatus,
  fetchPlaidTransactions,
  type NormalizedTransaction,
} from '../../lib/plaidApi'
import './PlaidConnect.css'

type PlaidConnectProps = {
  onTransactions?: (transactions: NormalizedTransaction[]) => void
}

export function PlaidConnect({ onTransactions }: PlaidConnectProps) {
  const { user } = useAuth()
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [transactions, setTransactions] = useState<NormalizedTransaction[]>([])

  const userId = user ? String(user.id) : ''

  const loadTransactions = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const txs = await fetchPlaidTransactions(userId)
      setTransactions(txs)
      onTransactions?.(txs)
    } catch {
      setError('Could not load Plaid transactions. Is the server running?')
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
        /* server may be offline */
      }
    })()
  }, [userId, loadTransactions])

  useEffect(() => {
    if (!userId || connected) return

    void (async () => {
      try {
        const token = await createLinkToken(userId)
        setLinkToken(token)
      } catch {
        setError('Plaid server not reachable. Run: npm run dev:server')
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
      } catch {
        setError('Bank connected but token exchange failed.')
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

  if (!user) return null

  return (
    <section className="plaid-connect">
      <h2 className="plaid-connect__title">Bank (Plaid Sandbox)</h2>
      <p className="plaid-connect__hint">
        Demo: First Platypus Bank · user_good / pass_good
      </p>

      {!connected ? (
        <button
          type="button"
          className="plaid-connect__button"
          disabled={!ready || loading || !linkToken}
          onClick={() => open()}
        >
          {loading ? 'Connecting…' : 'Connect bank'}
        </button>
      ) : (
        <p className="plaid-connect__status">Connected · {transactions.length} transactions</p>
      )}

      {error ? <p className="plaid-connect__error">{error}</p> : null}

      {transactions.length > 0 ? (
        <ul className="plaid-connect__list">
          {transactions.slice(0, 10).map((tx) => (
            <li key={tx.id} className="plaid-connect__row">
              <span>{tx.merchant}</span>
              <span className={tx.type === 'credit' ? 'income' : 'spend'}>
                {tx.amount < 0 ? '' : '+'}${Math.abs(tx.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
