import type { AccountsRowProps } from '../types'
import { BalanceToggle } from './BalanceToggle'

/** UI slot — replace with horizontal account cards. */
export function AccountsRow({
  accounts,
  balancesVisible,
  onToggleBalances,
}: AccountsRowProps) {
  return (
    <section className="dash-ui__block" data-ui-slot="accounts-row">
      <div className="dash-ui__block-head">
        <h2 className="dash-ui__label">Accounts</h2>
        <BalanceToggle
          balancesVisible={balancesVisible}
          onToggle={onToggleBalances}
          label="Show account balances"
        />
      </div>
      <ul className="dash-ui__accounts">
        {accounts.map(({ account, displayBalance }) => (
          <li key={account.id} className="dash-ui__account-card">
            <span className="dash-ui__account-name">{account.name}</span>
            <span className="dash-ui__account-bank">{account.bank}</span>
            <span
              className={
                account.balance < 0
                  ? 'dash-ui__account-balance dash-ui__account-balance--spend'
                  : 'dash-ui__account-balance'
              }
            >
              {displayBalance}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
