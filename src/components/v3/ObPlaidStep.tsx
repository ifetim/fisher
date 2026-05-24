'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { createLinkToken, exchangePublicToken } from '@/lib/plaidApi'
import { V3Icons } from './V3Icons'

const BANKS = ['RBC', 'TD', 'Scotiabank', 'BMO', 'CIBC', 'Tangerine', 'Simplii', 'EQ Bank']

/** Onboarding step 2 — matches prototype `ob-plaid` card. */
export function ObPlaidStep({ connected }: { connected: boolean }) {
  const { user } = useAuth()
  const { syncPlaid } = useFinance()
  const userId = user ? String(user.id) : ''
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId || connected) return
    void createLinkToken(userId).then(setLinkToken).catch(() => setLinkToken(null))
  }, [userId, connected])

  const onSuccess = useCallback(
    async (publicToken: string) => {
      if (!userId) return
      setLoading(true)
      try {
        await exchangePublicToken(userId, publicToken)
        await syncPlaid()
      } finally {
        setLoading(false)
      }
    },
    [userId, syncPlaid],
  )

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess })

  return (
    <div className={`ob-plaid${connected ? ' connected' : ''}`}>
      <div className="logo">{connected ? V3Icons.check : V3Icons.bank}</div>
      <p className="t">{connected ? 'Bank connected' : 'Link your bank with Plaid'}</p>
      <p className="s">
        {connected
          ? "We'll keep your transactions in sync automatically."
          : "We'll show your transactions and balances. No money ever moves through us."}
      </p>
      {!connected ? (
        <>
          <div className="banks">
            {BANKS.map((b) => (
              <span key={b} className="bank-chip">
                {b}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="btn"
            disabled={!ready || loading || !linkToken}
            onClick={() => open()}
          >
            {V3Icons.bank} {loading ? 'Connecting…' : 'Connect with Plaid'}
          </button>
        </>
      ) : null}
    </div>
  )
}
