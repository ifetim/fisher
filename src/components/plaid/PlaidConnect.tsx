'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useAuth } from '../../context/AuthContext'
import { useFinance } from '../../context/FinanceContext'
import {
  createLinkToken,
  disconnectPlaid,
  exchangePublicToken,
  fetchPlaidSnapshot,
  fetchPlaidTransactions,
  type PlaidSnapshot,
} from '@/lib/plaidApi'
import './PlaidConnect.css'

export const TEST_USER_ID = 'plaid-test-user'

type PlaidConnectProps = {
  /** Pass only from PlaidTestPage — normal app flow uses the logged-in user. */
  userId?: string
}

function formatCurrency(value: number | null, currency = 'USD'): string {
  if (value === null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

export function PlaidConnect({ userId: userIdOverride }: PlaidConnectProps) {
  const { user } = useAuth()
  const {
    plaidConnected,
    plaidSyncing,
    plaidSnapshot: ctxSnapshot,
    syncPlaid,
    disconnectPlaidAccount,
  } = useFinance()

  const isTestMode = !!userIdOverride
  const userId = userIdOverride ?? (user ? String(user.id) : '')

  // Test mode keeps everything local so it doesn't affect the logged-in user
  const [testConnected, setTestConnected] = useState(false)
  const [testSnapshot,  setTestSnapshot]  = useState<PlaidSnapshot | null>(null)
  const [testTxCount,   setTestTxCount]   = useState<number | null>(null)

  const connected = isTestMode ? testConnected : plaidConnected
  const syncing   = isTestMode ? false        : plaidSyncing
  const snapshot  = isTestMode ? testSnapshot  : ctxSnapshot

  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // Helper used by test-mode connect + refresh
  const fetchTestSnapshot = useCallback(async () => {
    try {
      const [snap, txs] = await Promise.all([
        fetchPlaidSnapshot(userId),
        fetchPlaidTransactions(userId),
      ])
      setTestSnapshot(snap)
      setTestTxCount(txs.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load Plaid data')
    }
  }, [userId])

  // Fetch a link token whenever we have a user and aren't connected yet
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
            : 'Plaid not configured — add keys to .env.local',
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
        if (isTestMode) {
          setTestConnected(true)
          await fetchTestSnapshot()
        } else {
          await syncPlaid()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Token exchange failed.')
      } finally {
        setLoading(false)
      }
    },
    [userId, isTestMode, syncPlaid, fetchTestSnapshot],
  )

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess })

  if (!userId) return null

  const accounts = snapshot?.accounts ?? []
  const identity = snapshot?.identity ?? []
  const institution = snapshot?.institution ?? null
  const accountHolder = identity[0]?.names[0] ?? null

  return (
    <section className="plaid-connect">
      <h2 className="plaid-connect__title">Connect your bank</h2>
      <p className="plaid-connect__text">
        Sandbox: <strong>First Platypus Bank</strong> — usernames{' '}
        <strong>broke_student</strong>, <strong>many_accounts</strong>, or{' '}
        <strong>rich_history</strong> (any password)
      </p>

      {!connected ? (
        <>
          <button
            type="button"
            className="plaid-connect__btn"
            disabled={!ready || loading || syncing || !linkToken}
            onClick={() => open()}
          >
            {loading || syncing ? 'Connecting…' : 'Connect bank'}
          </button>
          {linkToken && ready ? (
            <p className="plaid-connect__ready">Plaid ready — tap to open sandbox</p>
          ) : !error && !linkToken ? (
            <p className="plaid-connect__ready">Loading Plaid…</p>
          ) : null}
        </>
      ) : (
        <div className="plaid-connect__connected">
          {/* Institution header */}
          <div className="plaid-connect__inst">
            {institution?.logo ? (
              <img src={institution.logo} alt={institution.name} className="plaid-connect__logo" />
            ) : (
              <div
                className="plaid-connect__logo plaid-connect__logo--fallback"
                style={{ background: institution?.primaryColor ?? '#0f172a' }}
              >
                {(institution?.name ?? 'B')[0]}
              </div>
            )}
            <div>
              <p className="plaid-connect__inst-name">
                {syncing ? 'Syncing…' : institution?.name ?? 'Bank connected'} ✓
              </p>
              {accountHolder ? (
                <p className="plaid-connect__inst-holder">Account holder: {accountHolder}</p>
              ) : null}
            </div>
          </div>

          {/* Account list with live balances */}
          {accounts.length > 0 ? (
            <ul className="plaid-connect__accounts">
              {accounts.map((a) => (
                <li key={a.id} className="plaid-connect__acct">
                  <div>
                    <p className="plaid-connect__acct-name">
                      {a.name}
                      {a.mask ? <span className="plaid-connect__acct-mask"> ··{a.mask}</span> : null}
                    </p>
                    <p className="plaid-connect__acct-type">
                      {a.subtype ?? a.type}
                    </p>
                  </div>
                  <span className="plaid-connect__acct-balance">
                    {formatCurrency(a.balance.current, a.balance.currency)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="plaid-connect__meta">
            {(isTestMode ? testTxCount : null) !== null
              ? `${testTxCount} transactions loaded`
              : 'Transactions synced to Dashboard + Spending'}
          </p>

          <div className="plaid-connect__actions">
            <button
              type="button"
              className="plaid-connect__btn plaid-connect__btn--secondary"
              disabled={syncing || loading}
              onClick={async () => {
                setLoading(true)
                try {
                  if (isTestMode) {
                    await fetchTestSnapshot()
                  } else {
                    await syncPlaid()
                  }
                } catch { /* silent */ } finally {
                  setLoading(false)
                }
              }}
            >
              {loading ? 'Refreshing…' : 'Refresh sync'}
            </button>
            <button
              type="button"
              className="plaid-connect__btn plaid-connect__btn--danger"
              onClick={async () => {
                try {
                  if (isTestMode) {
                    await disconnectPlaid(userId)
                    setTestConnected(false)
                    setTestSnapshot(null)
                    setTestTxCount(null)
                  } else {
                    await disconnectPlaidAccount()
                  }
                  setLinkToken(null)
                } catch { /* silent */ }
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {error ? <p className="plaid-connect__error">{error}</p> : null}
    </section>
  )
}
