import type { SpendingThisMonthProps } from '../types'

/** UI slot — replace with final spending summary card. */
export function SpendingThisMonth({
  amount,
  displayAmount,
}: SpendingThisMonthProps) {
  return (
    <section className="dash-ui__block" data-ui-slot="spending-month">
      <h2 className="dash-ui__label">Spending this month</h2>
      <p className="dash-ui__amount dash-ui__amount--spend">
        {displayAmount(amount)}
      </p>
    </section>
  )
}
