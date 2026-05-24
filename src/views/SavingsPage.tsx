'use client'

import { FormEvent, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { goalProgress, monthlyNeeded } from '@/lib/savings'
import { formatCurrency } from '@/lib/format'
import type { SavingsPlan } from '@/types'

const GOAL_STYLES = [
  { emoji: '✈️', bg: 'rgba(59,130,246,0.15)' },
  { emoji: '🏠', bg: 'rgba(134,59,255,0.15)' },
  { emoji: '🛟', bg: 'rgba(245,158,11,0.15)' },
  { emoji: '💻', bg: 'rgba(34,197,94,0.15)'  },
  { emoji: '🎯', bg: 'rgba(239,68,68,0.12)'  },
]

export function SavingsPage() {
  const { user } = useAuth()
  const { savingsPlans, addSavingsGoal } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [name, setName]       = useState('')
  const [target, setTarget]   = useState('')
  const [deadline, setDeadline] = useState('')

  const totalSaved  = savingsPlans.reduce((s, g) => s + g.savedAmount, 0)
  const totalTarget = savingsPlans.reduce((s, g) => s + g.targetAmount, 0)
  const overallPct  = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const amount = Number(target)
    if (!name || !deadline || amount <= 0) return
    addSavingsGoal({ goal: name, targetAmount: amount, savedAmount: 0, deadline, monthlyContribution: Math.ceil(amount / 12) })
    setShowForm(false)
    setName(''); setTarget(''); setDeadline('')
  }

  if (!user) return null

  return (
    <div>
      <div className="screen-header">
        <div className="greeting">
          <p>{savingsPlans.length} active goal{savingsPlans.length !== 1 ? 's' : ''}</p>
          <h1>Savings</h1>
        </div>
        <button className="plaid-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => setShowForm(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New goal
        </button>
      </div>

      {/* Hero */}
      <div className="hero" style={{ marginBottom: 22 }}>
        <div className="hero-label"><span>Total Saved</span></div>
        <div className="hero-amount">{formatCurrency(totalSaved)}</div>
        <div className="hero-tags">
          <span className="hero-tag">of {formatCurrency(totalTarget)} across {savingsPlans.length} goal{savingsPlans.length !== 1 ? 's' : ''}</span>
          <span className="hero-tag" style={{ background: 'rgba(255,255,255,0.1)' }}>{overallPct}% complete</span>
        </div>
      </div>

      {/* Add goal form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>New goal</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)' }}>Goal name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)' }}>Target ($)</label>
              <input type="number" min={1} value={target} onChange={(e) => setTarget(e.target.value)} required
                style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)' }}>Deadline</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required
                style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button type="submit" className="plaid-btn">Save goal</button>
            <button type="button" onClick={() => setShowForm(false)}
              style={{ padding: '0.55rem 1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', background: 'transparent', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="section-label"><span>Your goals</span></div>
      <div className="goal-grid">
        {savingsPlans.map((plan, i) => (
          <GoalCard key={plan.id} plan={plan} style={GOAL_STYLES[i % GOAL_STYLES.length]!} />
        ))}
      </div>
    </div>
  )
}

function GoalCard({ plan, style }: { plan: SavingsPlan; style: { emoji: string; bg: string } }) {
  const pct = goalProgress(plan)
  const needed = monthlyNeeded(plan)

  return (
    <div className="goal-card">
      <div className="goal-head">
        <div className="goal-emoji" style={{ background: style.bg }}>{style.emoji}</div>
        <div className="info">
          <p className="name">{plan.goal}</p>
          <p className="target">By {plan.deadline}</p>
        </div>
        <div className="goal-pct">{pct}%</div>
      </div>
      <div className="goal-bar">
        <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="goal-foot">
        <span className="saved">{formatCurrency(plan.savedAmount)} saved</span>
        <span>of {formatCurrency(plan.targetAmount)}</span>
      </div>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--muted)' }}>~{formatCurrency(needed)}/mo needed</p>
    </div>
  )
}
