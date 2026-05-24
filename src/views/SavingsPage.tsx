'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { goalProgress } from '@/lib/savings'
import { formatAmountWhole } from '@/lib/v3Format'
import { V3Icons, V3StatusBar } from '@/components/v3/V3Icons'
import type { SavingsPlan } from '@/types'
import type { PlaidAccount } from '@/lib/plaidApi'

const GOAL_STYLES = [
  { emoji: '✈️', bg: 'rgba(212,146,42,0.18)' },
  { emoji: '🏠', bg: 'rgba(28,43,107,0.10)' },
  { emoji: '🛟', bg: 'rgba(201,71,42,0.15)' },
  { emoji: '💻', bg: 'rgba(42,157,143,0.18)' },
]

function liveSavedAmount(plan: SavingsPlan, plaidAccounts: PlaidAccount[]): number {
  if (!plan.linkedAccountId) return plan.savedAmount
  const account = plaidAccounts.find((a) => a.id === plan.linkedAccountId)
  if (!account) return plan.savedAmount
  return account.balance.current ?? account.balance.available ?? plan.savedAmount
}

export function SavingsPage() {
  const { user } = useAuth()
  const { savingsPlans, addSavingsGoal, plaidSnapshot } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')

  const resolvedPlans = useMemo(
    () =>
      savingsPlans.map((p) => ({
        ...p,
        savedAmount: liveSavedAmount(p, plaidSnapshot?.accounts ?? []),
      })),
    [savingsPlans, plaidSnapshot],
  )

  const totalSaved = resolvedPlans.reduce((s, g) => s + g.savedAmount, 0)
  const totalTarget = resolvedPlans.reduce((s, g) => s + g.targetAmount, 0)
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const amount = Number(target)
    if (!name || !deadline || amount <= 0) return
    addSavingsGoal({
      goal: name,
      targetAmount: amount,
      savedAmount: 0,
      deadline,
      monthlyContribution: Math.ceil(amount / 12),
    })
    setShowForm(false)
    setName('')
    setTarget('')
    setDeadline('')
  }

  if (!user) return null

  return (
    <div>
      <V3StatusBar />
      <div className="screen-head">
        <div>
          <p className="greet">
            {resolvedPlans.length} active goal{resolvedPlans.length !== 1 ? 's' : ''}
          </p>
          <h1>Savings</h1>
        </div>
        <button type="button" className="btn" onClick={() => setShowForm(true)}>
          {V3Icons.plus} New goal
        </button>
      </div>

      <div className="hero">
        <div className="label-row">
          <span className="label">Total saved</span>
          <span className="delta">{overallPct}% complete</span>
        </div>
        <div className="amount">
          ${formatAmountWhole(totalSaved)}
          <span className="cents">.00</span>
        </div>
        <p style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>
          of ${formatAmountWhole(totalTarget)} across {resolvedPlans.length} goals
        </p>
      </div>

      {showForm ? (
        <form className="card pad" onSubmit={handleAdd} style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 700, marginBottom: 14 }}>New goal</p>
          <div className="field">
            <label htmlFor="goal-name">Goal name</label>
            <input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field-pair">
            <div className="field">
              <label htmlFor="goal-target">Target ($)</label>
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
          </div>
          <button type="submit" className="btn block">
            Save goal
          </button>
        </form>
      ) : null}

      <div className="sec">
        <span className="lbl">Your goals</span>
        <span className="act">Reorder</span>
      </div>
      <div className="goal-grid">
        {resolvedPlans.map((plan, i) => {
          const style = GOAL_STYLES[i % GOAL_STYLES.length]!
          const pct = goalProgress(plan)
          return (
            <div className="goal" key={plan.id}>
              <div className="head">
                <div className="emoji" style={{ background: style.bg }}>
                  {style.emoji}
                </div>
                <div className="info">
                  <p className="n">{plan.goal}</p>
                  <p className="d">By {plan.deadline}</p>
                </div>
                <span className="pct">{pct}%</span>
              </div>
              <div className="bar">
                <div className="fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="foot">
                <span className="s">${formatAmountWhole(plan.savedAmount)} saved</span>
                <span>of ${formatAmountWhole(plan.targetAmount)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
