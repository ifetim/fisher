'use client'

import type { Transaction } from '@/types'
import { paydayBudget } from '@/lib/paydayBudget'
import { formatAmountWhole } from '@/lib/v3Format'
import { V3Icons } from '@/components/v3/V3Icons'

type Props = {
  transactions: Transaction[]
  balancesVisible: boolean
}

export function PaydayCard({ transactions, balancesVisible }: Props) {
  const budget = paydayBudget(transactions)

  if (!budget.hasIncome) return null

  const remainingPct =
    budget.monthIncome > 0
      ? Math.min(100, Math.round((budget.remaining / budget.monthIncome) * 100))
      : 0

  const tone = remainingPct >= 50 ? 'mint' : remainingPct >= 20 ? 'orange' : 'rose'
  const dayLabel = budget.daysLeft === 1 ? 'day' : 'days'

  const remainingDisplay = balancesVisible
    ? `$${formatAmountWhole(budget.remaining)}`
    : '••••'
  const perDayDisplay = balancesVisible
    ? `$${formatAmountWhole(budget.perDay)}`
    : '••'

  return (
    <div>
      <div className="sec">
        <span className="lbl">Daily budget</span>
      </div>
      <div className={`card pad payday payday--${tone}`}>
        <div className="payday__top">
          <div className="payday__chip">{V3Icons.wage}</div>
          <div className="payday__copy">
            <p className="payday__lead">
              You have <strong>{remainingDisplay}</strong> left this month.
            </p>
            <p className="payday__sub">
              That&apos;s about <strong>{perDayDisplay}/day</strong> until {budget.nextMonthLabel}.
            </p>
          </div>
        </div>
        <div className="bar mint">
          <div className={`fill payday__fill payday__fill--${tone}`} style={{ width: `${remainingPct}%` }} />
        </div>
        <div className="payday__foot">
          <span>
            {budget.daysLeft} {dayLabel} left
          </span>
          <span>
            ${formatAmountWhole(budget.monthSpent)} of ${formatAmountWhole(budget.monthIncome)} spent
          </span>
        </div>
      </div>
    </div>
  )
}
