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
  const {
    plaidConnected,
    plaidSyncing,
    syncPlaid,
    plaidSnapshot,
    disconnectPlaidAccount,
  } = useFinance()
  const userId = user ? String(user.id) : ''

  const [linkToken,   setLinkToken]   = useState<string | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [confirming,  setConfirming]  = useState(false)
  const [resetting,   setResetting]   = useState(false)

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

  const handleReset = useCallback(async () => {
    setResetting(true)
    setConfirming(false)
    try {
      await disconnectPlaidAccount()
    } finally {
      setResetting(false)
    }
  }, [disconnectPlaidAccount])

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess })

  if (plaidConnected) {
    const name = plaidSnapshot?.institution?.name

    if (confirming) {
      return (
        <div className="plaid" style={{ borderStyle: 'solid', borderColor: 'var(--rose)' }}>
          <div className="ico" style={{ background: 'var(--rose-soft)', color: 'var(--rose)' }}>
            {V3Icons.bank}
          </div>
          <div className="body">
            <p className="title">Reset bank connection?</p>
            <p className="sub">This clears the token — you can reconnect right after</p>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              className="btn"
              style={{ background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' }}
              disabled={resetting}
              onClick={handleReset}
            >
              {resetting ? 'Resetting…' : 'Yes, reset'}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="plaid" style={{ borderStyle: 'solid', borderColor: 'var(--mint)' }}>
        <div className="ico" style={{ background: 'var(--mint-soft)', color: 'var(--mint)' }}>
          {V3Icons.check}
        </div>
        <div className="body">
          <p className="title">{name ? `${name} connected` : 'Bank connected'}</p>
          <p className="sub">Transactions synced · read-only</p>
        </div>
        <button
          type="button"
          className="btn ghost"
          style={{ flexShrink: 0, fontSize: 12 }}
          onClick={() => setConfirming(true)}
        >
          Reset
        </button>
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
