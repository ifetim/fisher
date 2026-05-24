'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { goalProgress, monthlyNeeded } from '@/lib/savings'
import { formatCurrency } from '@/lib/format'
import type { SavingsPlan } from '@/types'
import type { PlaidAccount } from '@/lib/plaidApi'

const GOAL_STYLES = [
  { emoji: '✈️', bg: 'rgba(59,130,246,0.15)' },
  { emoji: '🏠', bg: 'rgba(134,59,255,0.15)' },
  { emoji: '🛟', bg: 'rgba(245,158,11,0.15)' },
  { emoji: '💻', bg: 'rgba(34,197,94,0.15)'  },
  { emoji: '🎯', bg: 'rgba(239,68,68,0.12)'  },
]

/**
 * Look up the live balance for a linked Plaid account. Used to override
 * `savedAmount` on plans the user has connected to a real savings account,
 * so the progress bar reflects actual money in the bank.
 */
function liveSavedAmount(
  plan: SavingsPlan,
  plaidAccounts: PlaidAccount[],
): number {
  if (!plan.linkedAccountId) return plan.savedAmount
  const account = plaidAccounts.find((a) => a.id === plan.linkedAccountId)
  if (!account) return plan.savedAmount
  return account.balance.current ?? account.balance.available ?? plan.savedAmount
}

export function SavingsPage() {
  const { user } = useAuth()
  const { savingsPlans, addSavingsGoal, plaidConnected, plaidSnapshot } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [name, setName]               = useState('')
  const [target, setTarget]           = useState('')
  const [deadline, setDeadline]       = useState('')
  const [linkedAccountId, setLinkedAccountId] = useState('')

  // Only savings-type Plaid accounts can be linked to a goal (no checking, credit, loans)
  const linkableAccounts = useMemo<PlaidAccount[]>(() => {
    if (!plaidConnected || !plaidSnapshot) return []
    return plaidSnapshot.accounts.filter(
      (a) => a.type === 'depository' && (a.subtype === 'savings' || a.subtype === 'cd' || a.subtype === 'money market'),
    )
  }, [plaidConnected, plaidSnapshot])

  // Resolve each plan's "actually saved" amount — live from Plaid if linked
  const resolvedPlans = useMemo(
    () =>
      savingsPlans.map((p) => ({
        ...p,
        savedAmount: liveSavedAmount(p, plaidSnapshot?.accounts ?? []),
      })),
    [savingsPlans, plaidSnapshot],
  )

  const totalSaved  = resolvedPlans.reduce((s, g) => s + g.savedAmount, 0)
  const totalTarget = resolvedPlans.reduce((s, g) => s + g.targetAmount, 0)
  const overallPct  = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const amount = Number(target)
    if (!name || !deadline || amount <= 0) return

    // If linked, savedAmount is just a fallback (live balance takes priority)
    const startingSaved = linkedAccountId
      ? linkableAccounts.find((a) => a.id === linkedAccountId)?.balance.current ?? 0
      : 0

    addSavingsGoal({
      goal: name,
      targetAmount: amount,
      savedAmount: startingSaved,
      deadline,
      monthlyContribution: Math.ceil(amount / 12),
      linkedAccountId: linkedAccountId || undefined,
    })

    setShowForm(false)
    setName(''); setTarget(''); setDeadline(''); setLinkedAccountId('')
  }

  if (!user) return null

  return (
    <div>
      <div className="screen-header">
        <div className="greeting">
          <p>{resolvedPlans.length} active goal{resolvedPlans.length !== 1 ? 's' : ''}</p>
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
          <span className="hero-tag">of {formatCurrency(totalTarget)} across {resolvedPlans.length} goal{resolvedPlans.length !== 1 ? 's' : ''}</span>
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

          {/* Optional Plaid account link — only shows if user has eligible accounts */}
          {linkableAccounts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)' }}>
                Link to bank account <span style={{ fontWeight: 400 }}>(optional — auto-tracks your saved amount)</span>
              </label>
              <select
                value={linkedAccountId}
                onChange={(e) => setLinkedAccountId(e.target.value)}
                style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', background: 'white' }}
              >
                <option value="">Track manually</option>
                {linkableAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}{a.mask ? ` ··${a.mask}` : ''}{' '}— {formatCurrency(a.balance.current ?? 0)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

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
        {resolvedPlans.map((plan, i) => (
          <GoalCard
            key={plan.id}
            plan={plan}
            style={GOAL_STYLES[i % GOAL_STYLES.length]!}
            linkedAccountName={
              plan.linkedAccountId
                ? plaidSnapshot?.accounts.find((a) => a.id === plan.linkedAccountId)?.name ?? null
                : null
            }
          />
        ))}
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{ marginTop: 20, background: 'none', border: '1.5px dashed var(--border)', borderRadius: 12, padding: '14px 24px', fontSize: '0.85rem', color: 'var(--muted)', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Add another goal
        </button>
      )}
    </div>
  )
}

function GoalCard({
  plan,
  style,
  linkedAccountName,
}: {
  plan: SavingsPlan
  style: { emoji: string; bg: string }
  linkedAccountName: string | null
}) {
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
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--muted)' }}>
        ~{formatCurrency(needed)}/mo needed
      </p>
      {linkedAccountName ? (
        <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: 'var(--green)', fontWeight: 600 }}>
          🔗 Auto-tracking from {linkedAccountName}
        </p>
      ) : null}
    </div>
  )
}
