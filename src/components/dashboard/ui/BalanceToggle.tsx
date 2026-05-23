import type { BalanceToggleProps } from '../types'

/** UI slot — replace with final eye control styling. */
export function BalanceToggle({
  balancesVisible,
  onToggle,
  label = 'Show balances',
}: BalanceToggleProps) {
  return (
    <button
      type="button"
      className="dash-ui__eye"
      onClick={onToggle}
      aria-pressed={balancesVisible}
      aria-label={balancesVisible ? 'Hide balances' : label}
      data-ui-slot="balance-toggle"
    >
      {balancesVisible ? '🙈' : '👁'}
    </button>
  )
}
