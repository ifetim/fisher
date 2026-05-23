'use client'

import { DashboardView } from '../components/dashboard/DashboardView'
import { useDashboard } from '../hooks/useDashboard'

export function DashboardPage() {
  const dashboard = useDashboard()

  if (!dashboard.greeting) {
    return null
  }

  const {
    greeting,
    accounts,
    netWorth,
    spendingThisMonth,
    quickInsights,
    balancesVisible,
    toggleBalances,
    displayAmount,
  } = dashboard

  return (
    <DashboardView
      greeting={greeting}
      accounts={accounts!}
      netWorth={netWorth!}
      spendingThisMonth={spendingThisMonth!}
      quickInsights={quickInsights!}
      balancesVisible={balancesVisible}
      toggleBalances={toggleBalances}
      displayAmount={displayAmount}
    />
  )
}
