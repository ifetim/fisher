import type { Account } from '../../types'

/** Props contract for the Dashboard UI layer — swap files in `ui/` without touching logic. */
export type DashboardGreetingProps = {
  greeting: string
}

export type BalanceToggleProps = {
  balancesVisible: boolean
  onToggle: () => void
  label?: string
}

export type NetWorthSectionProps = {
  netWorth: number
  displayAmount: (amount: number) => string
  balancesVisible: boolean
  onToggleBalances: () => void
}

export type AccountCardModel = {
  account: Account
  displayBalance: string
}

export type AccountsRowProps = {
  accounts: AccountCardModel[]
  balancesVisible: boolean
  onToggleBalances: () => void
}

export type SpendingThisMonthProps = {
  amount: number
  displayAmount: (amount: number) => string
}

export type QuickInsightsProps = {
  insights: string[]
}

export type DashboardViewProps = {
  greeting: string
  netWorth: number
  accounts: Account[]
  spendingThisMonth: number
  quickInsights: string[]
  balancesVisible: boolean
  toggleBalances: () => void
  displayAmount: (amount: number) => string
}
