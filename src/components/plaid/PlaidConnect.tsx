'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useAuth } from '../../context/AuthContext'
import { useFinance } from '../../context/FinanceContext'
import { createLinkToken, exchangePublicToken } from '@/lib/plaidApi'
import './PlaidConnect.css'

export const TEST_USER_ID = 'plaid-test-user'

type PlaidConnectProps = {
  /** Pass only from PlaidTestPage — normal app flow uses the logged-in user. */
  userId?: string
}

export function PlaidConnect({ userId: userIdOverride }: PlaidConnectProps) {
  const { user } = useAuth()
  const { plaidConnected, plaidSyncing, syncPlaid } = useFinance()

  // Test mode: userId prop differs from logged-in user (or no user at all)
  const isTestMode = !!userIdOverride
  const userId = userIdOverride ?? (user ? String(user.id) : '')

  // In test mode we track local connected state; normal mode reads from context
  const [testConnected, setTestConnected] = useState(false)
  const connected = isTestMode ? testConnected : plaidConnected
  const syncing   = isTestMode ? false        : plaidSyncing

  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // Fetch a link token whenever we know the userId and aren't already connected
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
        } else {
          // Sync transactions into FinanceContext — Dashboard + Spending update automatically
          await syncPlaid()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Token exchange failed.')
      } finally {
        setLoading(false)
      }
    },
    [userId, isTestMode, syncPlaid],
  )

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess })

  if (!userId) return null

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
        <p className="plaid-connect__status">
          {syncing ? 'Syncing transactions…' : 'Bank connected ✓'}
        </p>
      )}

      {error ? <p className="plaid-connect__error">{error}</p> : null}
    </section>
  )
}
