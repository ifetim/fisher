import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlaidConnect, TEST_USER_ID } from '../components/plaid/PlaidConnect'
import { checkServerHealth } from '../lib/plaidApi'
import './PlaidTestPage.css'

export function PlaidTestPage() {
  const [serverOk, setServerOk] = useState<boolean | null>(null)

  useEffect(() => {
    void checkServerHealth().then(setServerOk)
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

      <ol className="plaid-test__steps">
        <li>
          Terminal 1: <code>cd server && npm run dev</code>
        </li>
        <li>
          Terminal 2: <code>npm run dev</code>
        </li>
        <li>
          Fix keys in <code>server/.env</code> if link token fails
        </li>
        <li>Click Connect bank → sandbox login</li>
      </ol>

      <div className={badgeClass}>
        Server:{' '}
        {serverOk === null
          ? 'checking…'
          : serverOk
            ? 'online ✓'
            : 'offline — start server on port 3001'}
      </div>

      <PlaidConnect userId={TEST_USER_ID} maxRows={0} />

      <Link to="/dashboard" className="plaid-test__back">
        ← Back to app
      </Link>
    </div>
  )
}
