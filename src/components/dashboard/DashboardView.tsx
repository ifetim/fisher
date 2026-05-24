import type { DashboardViewProps } from './types'
import { AccountsRow } from './ui/AccountsRow'
import { DashboardGreeting } from './ui/DashboardGreeting'
import { NetWorthSection } from './ui/NetWorthSection'
import { QuickInsights } from './ui/QuickInsights'
import { SpendingThisMonth } from './ui/SpendingThisMonth'
import './ui/dashboard-ui.css'

/**
 * Presentation layer for Screen 2. Logic lives in `useDashboard`.
 * UI teammate: restyle or replace components under `dashboard/ui/`.
 */
export function DashboardView({
  greeting,
  netWorth,
  accounts,
  spendingThisMonth,
  quickInsights,
  balancesVisible,
  toggleBalances,
  displayAmount,
}: DashboardViewProps) {
  const accountCards = accounts.map((account) => ({
    account,
    displayBalance: displayAmount(account.balance),
  }))

  return (
    <div className="dashboard-page">
      <DashboardGreeting greeting={greeting} />
      <NetWorthSection
        netWorth={netWorth}
        displayAmount={displayAmount}
        balancesVisible={balancesVisible}
        onToggleBalances={toggleBalances}
      />
      <AccountsRow
        accounts={accountCards}
        balancesVisible={balancesVisible}
        onToggleBalances={toggleBalances}
      />
      <SpendingThisMonth
        amount={spendingThisMonth}
        displayAmount={displayAmount}
        balancesVisible={balancesVisible}
        onToggleBalances={toggleBalances}
      />
      <QuickInsights insights={quickInsights} />
    </div>
  )
}
