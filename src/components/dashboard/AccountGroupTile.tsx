'use client'

import { useState } from 'react'
import type { PlaidAccount } from '@/lib/plaidApi'
import { formatCurrency } from '@/lib/format'

/**
 * Collapsible tile for grouped accounts (Investments / Loans / Other deposits).
 * Default state shows: emoji + group name + count + group total.
 * Expanded state lists each account in the group.
 *
 * Keeps the colored pastel "vibe" of the current Dashboard, just denser
 * information per square inch so a user with 8 accounts doesn't see 8 cards.
 */

type Props = {
  title: string
  emoji: string
  accentBg: string
  accounts: PlaidAccount[]
  groupTotal: number
  /** Pass true for liabilities (loans) so the total reads as negative. */
  isDebt?: boolean
  balancesVisible: boolean
}

export function AccountGroupTile({
  title,
  emoji,
  accentBg,
  accounts,
  groupTotal,
  isDebt = false,
  balancesVisible,
}: Props) {
  const [open, setOpen] = useState(false)

  if (accounts.length === 0) return null

  const totalLabel = balancesVisible
    ? (isDebt ? '−' : '') + formatCurrency(Math.abs(groupTotal))
    : '••••'

  return (
    <div className="group-tile">
      <button
        type="button"
        className="group-tile__head"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div className="group-tile__icon" style={{ background: accentBg }}>
          <span aria-hidden>{emoji}</span>
        </div>
        <div className="group-tile__meta">
          <p className="group-tile__title">{title}</p>
          <p className="group-tile__sub">
            {accounts.length} account{accounts.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="group-tile__total">
          <span
            className="group-tile__amount"
            style={isDebt ? { color: 'var(--red)' } : undefined}
          >
            {totalLabel}
          </span>
          <span className={`group-tile__chev ${open ? 'is-open' : ''}`} aria-hidden>
            ▾
          </span>
        </div>
      </button>

      {open ? (
        <ul className="group-tile__list">
          {accounts.map((a) => {
            const raw = a.balance.current ?? a.balance.available ?? 0
            const displayValue = isDebt ? -Math.abs(raw) : raw
            return (
              <li key={a.id} className="group-tile__row">
                <div>
                  <p className="group-tile__row-name">
                    {a.name}
                    {a.mask ? (
                      <span className="group-tile__row-mask"> ··{a.mask}</span>
                    ) : null}
                  </p>
                  <p className="group-tile__row-sub">{a.subtype ?? a.type}</p>
                </div>
                <span
                  className="group-tile__row-amount"
                  style={displayValue < 0 ? { color: 'var(--red)' } : undefined}
                >
                  {balancesVisible
                    ? (displayValue < 0 ? '−' : '') +
                      formatCurrency(Math.abs(displayValue))
                    : '••••'}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
