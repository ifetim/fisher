import type { SavingsPlan } from '../types'

export function goalProgress(plan: SavingsPlan): number {
  if (plan.targetAmount <= 0) return 0
  return Math.min(100, Math.round((plan.savedAmount / plan.targetAmount) * 100))
}

export function monthsUntilDeadline(deadline: string, from = new Date()): number {
  const end = new Date(deadline)
  const months =
    (end.getFullYear() - from.getFullYear()) * 12 +
    (end.getMonth() - from.getMonth())
  return Math.max(1, months)
}

export function monthlyNeeded(plan: SavingsPlan): number {
  const remaining = Math.max(0, plan.targetAmount - plan.savedAmount)
  const months = monthsUntilDeadline(plan.deadline)
  return Math.ceil(remaining / months)
}

export type ContributionPoint = { month: string; amount: number }

/** Mock monthly contribution history for charts (demo). */
export function buildContributionHistory(
  plan: SavingsPlan,
  months = 6,
): ContributionPoint[] {
  const points: ContributionPoint[] = []
  const now = new Date()
  let remaining = plan.savedAmount
  const perMonth = plan.monthlyContribution

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('en-CA', { month: 'short' })
    const amount =
      i === 0
        ? remaining
        : Math.min(perMonth, remaining)
    remaining = Math.max(0, remaining - amount)
    points.push({ month: label, amount: Math.round(amount) })
  }

  return points
}
