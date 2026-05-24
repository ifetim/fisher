import type { Account, Transaction } from '../types'
import { computeMonthSpending } from './dashboard'

export type HealthFactor = {
  id: string
  label: string
  impact: 'positive' | 'neutral' | 'negative'
  detail: string
  points: number
}

export type HealthScoreResult = {
  score: number
  factors: HealthFactor[]
}

export function computeHealthScore(
  accounts: Account[],
  transactions: Transaction[],
): HealthScoreResult {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const monthSpend = computeMonthSpending(transactions, year, month)
  const monthIncome = transactions
    .filter((t) => {
      const [y, m] = t.date.split('-').map(Number)
      return y === year && m === month && t.amount > 0
    })
    .reduce((s, t) => s + t.amount, 0)

  const savingsBalance = accounts
    .filter((a) => a.type === 'savings')
    .reduce((s, a) => s + a.balance, 0)

  const creditBalance = accounts
    .filter((a) => a.type === 'credit')
    .reduce((s, a) => s + Math.abs(Math.min(0, a.balance)), 0)

  const foodSpend = transactions
    .filter((t) => {
      const [y, m] = t.date.split('-').map(Number)
      return (
        y === year &&
        m === month &&
        t.amount < 0 &&
        t.category === 'Food & Dining'
      )
    })
    .reduce((s, t) => s + Math.abs(t.amount), 0)

  const factors: HealthFactor[] = []
  let score = 50

  if (monthIncome > 0) {
    const savingsRate = (monthIncome - monthSpend) / monthIncome
    const pts = Math.round(Math.min(25, Math.max(-15, savingsRate * 40)))
    score += pts
    factors.push({
      id: 'savings-rate',
      label: 'Monthly cash flow',
      impact: pts >= 10 ? 'positive' : pts <= 0 ? 'negative' : 'neutral',
      detail:
        savingsRate >= 0.1
          ? `You kept about ${Math.round(savingsRate * 100)}% of income after spending.`
          : `Spending is close to or above income this month.`,
      points: pts,
    })
  }

  const emergencyMonths =
    monthSpend > 0 ? savingsBalance / monthSpend : savingsBalance > 0 ? 3 : 0
  const emergencyPts = Math.round(Math.min(20, emergencyMonths * 7))
  score += emergencyPts - 10
  factors.push({
    id: 'emergency',
    label: 'Emergency cushion',
    impact: emergencyMonths >= 2 ? 'positive' : emergencyMonths < 1 ? 'negative' : 'neutral',
    detail: `Savings could cover ~${emergencyMonths.toFixed(1)} months of current spending.`,
    points: emergencyPts - 10,
  })

  const foodPct = monthSpend > 0 ? foodSpend / monthSpend : 0
  const foodPts = foodPct > 0.35 ? -12 : foodPct < 0.2 ? 8 : 0
  score += foodPts
  factors.push({
    id: 'food',
    label: 'Food spending share',
    impact: foodPts > 0 ? 'positive' : foodPts < 0 ? 'negative' : 'neutral',
    detail: `Food is ${Math.round(foodPct * 100)}% of spending this month.`,
    points: foodPts,
  })

  const creditPts =
    creditBalance > 2000 ? -15 : creditBalance > 500 ? -5 : creditBalance > 0 ? 0 : 10
  score += creditPts
  factors.push({
    id: 'credit',
    label: 'Credit card balance',
    impact: creditPts >= 0 ? 'positive' : 'negative',
    detail:
      creditBalance > 0
        ? `About $${creditBalance.toFixed(0)} on credit cards.`
        : 'No credit card balance on file.',
    points: creditPts,
  })

  const clamped = Math.max(0, Math.min(100, Math.round(score)))

  return { score: clamped, factors }
}
