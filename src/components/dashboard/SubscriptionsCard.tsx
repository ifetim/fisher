'use client'

import { useMemo, useState } from 'react'
import type { Transaction } from '@/types'
import { detectSubscriptions, totalMonthlySubscriptions } from '@/lib/subscriptions'
import { formatAmountWhole } from '@/lib/v3Format'
import { V3Icons } from '@/components/v3/V3Icons'
import { txV3Icon } from '@/lib/txV3Icon'

type Props = {
  transactions: Transaction[]
}

const COLLAPSED = 4

export function SubscriptionsCard({ transactions }: Props) {
  const subs = useMemo(() => detectSubscriptions(transactions), [transactions])
  const [expanded, setExpanded] = useState(false)

  if (subs.length === 0) return null

  const total = totalMonthlySubscriptions(subs)
  const yearly = total * 12
  const visible = expanded ? subs : subs.slice(0, COLLAPSED)
  const hidden = subs.length - COLLAPSED

  return (
    <div>
      <div className="sec">
        <span className="lbl">Subscriptions</span>
        {subs.length > COLLAPSED ? (
          <span className="act" role="button" tabIndex={0} onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Show fewer' : `Show all (${subs.length})`}
          </span>
        ) : null}
      </div>

      <div className="card pad subs">
        <div className="subs__head">
          <div>
            <p className="subs__lbl">Recurring this month</p>
            <p className="subs__total">
              ${formatAmountWhole(total)}
              <span className="subs__per">/mo</span>
            </p>
            <p className="subs__year">
              ≈ ${formatAmountWhole(yearly)} per year
            </p>
          </div>
          <div className="subs__chip">
            {V3Icons.spark}
            <span>{subs.length} found</span>
          </div>
        </div>
      </div>

      <div className="card subs__list">
        {visible.map((s) => {
          const { ico, svg } = txV3Icon(s.category, -s.amount)
          return (
            <div className="tx" key={s.merchant}>
              <div className={`ico ${ico}`.trim()}>{svg}</div>
              <div className="meta">
                <p className="merch">{s.merchant}</p>
                <p className="cat">
                  {s.category} · seen {s.hits}× this period
                </p>
              </div>
              <span className="amt">
                ${s.amount.toFixed(2)}
                <span className="subs__row-per">/mo</span>
              </span>
            </div>
          )
        })}
        {!expanded && hidden > 0 ? (
          <button
            type="button"
            className="subs__more"
            onClick={() => setExpanded(true)}
          >
            +{hidden} more recurring charges
          </button>
        ) : null}
      </div>
    </div>
  )
}
