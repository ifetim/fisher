'use client'

import { FormEvent, useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { formatCurrency, formatTooltipValue } from '@/lib/format'
import {
  buildContributionHistory,
  goalProgress,
  monthlyNeeded,
} from '@/lib/savings'
import type { SavingsPlan } from '@/types'
import '@/components/shared/page.css'
import './SavingsPage.css'

export function SavingsPage() {
  const { user } = useAuth()
  const { savingsPlans, addSavingsGoal, transactions } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingTips, setLoadingTips] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')

  const primary = savingsPlans[0]

  const chartData = useMemo(
    () => (primary ? buildContributionHistory(primary) : []),
    [primary],
  )

  const topMerchants = useMemo(() => {
    const totals = new Map<string, number>()
    for (const t of transactions) {
      if (t.amount >= 0) continue
      totals.set(t.merchant, (totals.get(t.merchant) ?? 0) + Math.abs(t.amount))
    }
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([m]) => m)
  }, [transactions])

  async function loadSuggestions(plan: SavingsPlan) {
    setLoadingTips(true)
    try {
      const res = await fetch('/api/gemini/savings-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: plan.goal,
          merchants: topMerchants,
          monthlyNeeded: monthlyNeeded(plan),
        }),
      })
      const data = (await res.json()) as { suggestions?: string[] }
      setSuggestions(data.suggestions ?? [])
    } catch {
      setSuggestions(['Try reducing one recurring subscription this month.'])
    } finally {
      setLoadingTips(false)
    }
  }

  function handleAddGoal(e: FormEvent) {
    e.preventDefault()
    const targetAmount = Number(target)
    if (!name || !deadline || targetAmount <= 0) return

    addSavingsGoal({
      goal: name,
      targetAmount,
      savedAmount: 0,
      deadline,
      monthlyContribution: Math.ceil(targetAmount / 12),
    })
    setShowForm(false)
    setName('')
    setTarget('')
    setDeadline('')
  }

  if (!user) return null

  return (
    <section className="page savings-page">
      <h1 className="page__title">Savings</h1>
      <p className="page__subtitle">Track goals and see how small cuts speed things up.</p>

      <div className="savings-page__goals-grid">
        {savingsPlans.map((plan) => (
          <GoalCard key={plan.id} plan={plan} />
        ))}
      </div>

      {showForm ? (
        <form className="card savings-page__form" onSubmit={handleAddGoal}>
          <h2 className="page__section-title">New goal</h2>
          <div className="field">
            <label htmlFor="goal-name">Goal name</label>
            <input
              id="goal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="goal-target">Target amount ($)</label>
            <input
              id="goal-target"
              type="number"
              min={1}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="goal-deadline">Deadline</label>
            <input
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary">
            Save goal
          </button>
          <button
            type="button"
            className="btn btn--ghost savings-page__cancel"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          className="btn btn--secondary savings-page__add"
          onClick={() => setShowForm(true)}
        >
          Add goal
        </button>
      )}

      {primary ? (
        <>
          <div className="page__section">
            <h2 className="page__section-title">Contribution history</h2>
            <div className="chart-wrap card">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={formatTooltipValue} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--color-savings)"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button
            type="button"
            className="btn btn--primary savings-page__tips"
            disabled={loadingTips}
            onClick={() => void loadSuggestions(primary)}
          >
            {loadingTips ? 'Thinking…' : 'Savings suggestions'}
          </button>
          {suggestions.length > 0 ? (
            <ul className="savings-page__suggestions card">
              {suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </section>
  )
}

function GoalCard({ plan }: { plan: SavingsPlan }) {
  const pct = goalProgress(plan)
  const needed = monthlyNeeded(plan)

  return (
    <article className="card savings-page__goal">
      <h2 className="savings-page__goal-name">{plan.goal}</h2>
      <p className="savings-page__goal-amounts">
        {formatCurrency(plan.savedAmount)} of {formatCurrency(plan.targetAmount)}
      </p>
      <div className="savings-page__bar" role="progressbar" aria-valuenow={pct}>
        <div className="savings-page__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="savings-page__meta">
        {pct}% · Deadline {plan.deadline} · ~{formatCurrency(needed)}/mo needed
      </p>
    </article>
  )
}
