'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PlaidConnect, TEST_USER_ID } from '../components/plaid/PlaidConnect'
import { checkPlaidCredentials, checkServerHealth } from '../lib/plaidApi'
import './PlaidTestPage.css'

export function PlaidTestPage() {
  const [serverOk, setServerOk] = useState<boolean | null>(null)
  const [credIssue, setCredIssue] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const ok = await checkServerHealth()
      setServerOk(ok)
      if (ok) {
        const cred = await checkPlaidCredentials()
        if (!cred.credentialsOk) setCredIssue(cred.issue ?? 'Invalid Plaid keys')
      }
    })()
  }, [])

  const badgeClass =
    serverOk === true
      ? 'plaid-test__badge plaid-test__badge--ok'
      : serverOk === false
        ? 'plaid-test__badge plaid-test__badge--bad'
        : 'plaid-test__badge'

  return (
    <div className="plaid-test">
      <header className="plaid-test__header">
        <h1>Plaid Sandbox Test</h1>
        <p>Quick check — no login required.</p>
      </header>

      <div className={badgeClass}>
        Server:{' '}
        {serverOk === null
          ? 'checking…'
          : serverOk
            ? 'online ✓'
            : 'offline — run: npm run dev'}
      </div>

      {credIssue ? (
        <div className="plaid-test__cred-fix">
          <strong>Keys problem — Connect bank stays disabled until fixed:</strong>
          <p>{credIssue}</p>
          <ol>
            <li>
              Open{' '}
              <a href="https://dashboard.plaid.com/developers/keys" target="_blank" rel="noreferrer">
                Plaid Dashboard → Keys
              </a>
            </li>
            <li>Copy <strong>Sandbox</strong> Client ID + Secret</li>
            <li>Paste into <code>.env.local</code></li>
            <li>Restart dev server, refresh this page</li>
          </ol>
        </div>
      ) : null}

      <PlaidConnect userId={TEST_USER_ID} maxRows={0} />

      <Link href="/dashboard" className="plaid-test__back">
        ← Back to app
      </Link>
    </div>
  )
}
