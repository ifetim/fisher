'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { createLinkToken, exchangePublicToken } from '@/lib/plaidApi'
import { V3Icons } from './V3Icons'

/** Compact Plaid connect row matching v3 Spending screen. */
export function PlaidBanner() {
  const { user } = useAuth()
  const { plaidConnected, plaidSyncing, syncPlaid, plaidSnapshot } = useFinance()
  const userId = user ? String(user.id) : ''

  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId || plaidConnected) return
    void createLinkToken(userId)
      .then(setLinkToken)
      .catch(() => setLinkToken(null))
  }, [userId, plaidConnected])

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

  if (plaidConnected) {
    const name = plaidSnapshot?.institution?.name
    return (
      <div className="plaid" style={{ borderStyle: 'solid', borderColor: 'var(--mint)' }}>
        <div className="ico" style={{ background: 'var(--mint-soft)', color: 'var(--mint)' }}>
          {V3Icons.check}
        </div>
        <div className="body">
          <p className="title">{name ? `${name} connected` : 'Bank connected'}</p>
          <p className="sub">Transactions sync automatically · read-only</p>
        </div>
      </div>
    )
  }

  return (
    <div className="plaid">
      <div className="ico">{V3Icons.bank}</div>
      <div className="body">
        <p className="title">Connect your bank</p>
        <p className="sub">Auto-sync via Plaid · read-only access</p>
      </div>
      <button
        type="button"
        className="btn"
        disabled={!ready || loading || plaidSyncing || !linkToken}
        onClick={() => open()}
      >
        {loading || plaidSyncing ? 'Connecting…' : 'Connect'}
      </button>
    </div>
  )
}
