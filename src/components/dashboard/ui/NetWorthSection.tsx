import type { NetWorthSectionProps } from '../types'
import { BalanceToggle } from './BalanceToggle'

/** UI slot — replace with Wealthsimple-style net worth card. */
export function NetWorthSection({
  netWorth,
  displayAmount,
  balancesVisible,
  onToggleBalances,
}: NetWorthSectionProps) {
  return (
    <section className="dash-ui__block" data-ui-slot="net-worth">
      <div className="dash-ui__block-head">
        <h2 className="dash-ui__label">Net worth</h2>
        <BalanceToggle
          balancesVisible={balancesVisible}
          onToggle={onToggleBalances}
        />
      </div>
      <p className="dash-ui__amount dash-ui__amount--hero">
        {displayAmount(netWorth)}
      </p>
    </section>
  )
}
