import type { SpendingThisMonthProps } from '../types'
import { BalanceToggle } from './BalanceToggle'

export function SpendingThisMonth({
  amount,
  displayAmount,
  balancesVisible,
  onToggleBalances,
}: SpendingThisMonthProps) {
  return (
    <section className="dash-ui__block" data-ui-slot="spending-month">
      <div className="dash-ui__block-head">
        <h2 className="dash-ui__label">Spending this month</h2>
        <BalanceToggle
          balancesVisible={balancesVisible}
          onToggle={onToggleBalances}
        />
      </div>
      <p className="dash-ui__amount dash-ui__amount--spend">
        {displayAmount(amount)}
      </p>
    </section>
  )
}
