'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { getAccountsForUser } from '@/data'
import { computeHealthScore } from '@/lib/healthScore'

type AdviceCard = { kind: 'win' | 'warn' | 'tip'; tag: string; emoji: string; title: string; body: string; cta: string }

const STATIC_ADVICE: AdviceCard[] = [
  { kind: 'win',  tag: 'Win',   emoji: '🎉', title: "You're saving regularly",       body: 'Consistent contributions are the #1 driver of long-term wealth. Keep the momentum.', cta: 'See goals' },
  { kind: 'warn', tag: 'Watch', emoji: '⚠️', title: 'Food & Dining spending is high', body: 'Try a weekly meal-prep day to cut delivery costs without feeling restrictive.', cta: 'View spending' },
  { kind: 'tip',  tag: 'Tip',   emoji: '💡', title: 'Review your subscriptions',      body: 'Small recurring charges add up fast. Audit once a month and cancel what you don\'t use.', cta: 'Review subs' },
  { kind: 'tip',  tag: 'Tip',   emoji: '🔁', title: 'Build your emergency fund',      body: 'Aim for 1–3 months of expenses in cash. It\'s your financial shock absorber.', cta: 'Add goal' },
]

export function AdvicePage() {
  const { user } = useAuth()
  const { transactions } = useFinance()
  const [aiCards, setAiCards] = useState<AdviceCard[]>([])
  const [loading, setLoading] = useState(false)

  const accounts = user ? getAccountsForUser(user.id) : []
  const health = useMemo(() => computeHealthScore(accounts, transactions), [accounts, transactions])

  const cards = aiCards.length > 0 ? aiCards : STATIC_ADVICE

  async function loadAiAdvice() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: health.score, factors: health.factors.map((f) => ({ label: f.label, detail: f.detail })) }),
      })
      const data = (await res.json()) as { cards?: { title: string; body: string }[] }
      if (data.cards) {
        setAiCards(data.cards.map((c, i) => ({
          kind: i === 0 ? 'win' : i === 1 ? 'warn' : 'tip',
          tag: i === 0 ? 'Win' : i === 1 ? 'Watch' : 'Tip',
          emoji: ['🎉', '⚠️', '💡', '🔁'][i] ?? '💡',
          title: c.title,
          body: c.body,
          cta: 'Learn more',
        } satisfies AdviceCard)))
      }
    } catch { /* keep static */ }
    finally { setLoading(false) }
  }

  if (!user) return null

  const ringCircumference = 2 * Math.PI * 44
  const scoreOffset = ringCircumference * (1 - health.score / 100)
  const scoreLabel = health.score >= 70 ? 'Looking strong' : health.score >= 45 ? 'Making progress' : 'Needs attention'

  return (
    <div>
      <div className="screen-header">
        <div className="greeting">
          <p>AI-powered insights</p>
          <h1>Advice</h1>
        </div>
        <div className="avatar" style={{ fontSize: 18 }}>✨</div>
      </div>

      {/* Health score */}
      <div className="health-card" style={{ marginBottom: 22 }}>
        <div className="health-ring">
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none"/>
            <circle cx="50" cy="50" r="44" stroke="#fff" strokeWidth="8" fill="none"
              strokeDasharray={ringCircumference}
              strokeDashoffset={scoreOffset}
              strokeLinecap="round"/>
          </svg>
          <div className="score">{health.score}</div>
        </div>
        <div className="meta">
          <p className="label">Financial Health</p>
          <p className="title">{scoreLabel}</p>
          <p className="sub">
            {health.factors[0]?.detail ?? 'Keep saving and watch your spending.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <div className="section-label" style={{ margin: 0 }}><span>For you this week</span></div>
        <button
          className="plaid-btn"
          style={{ fontSize: '0.75rem', padding: '0.45rem 0.9rem' }}
          disabled={loading}
          onClick={() => void loadAiAdvice()}
        >
          {loading ? 'Thinking…' : '✨ Refresh with AI'}
        </button>
      </div>

      <div className="advice-grid">
        {cards.map((c, i) => (
          <div className="advice-card" key={i}>
            <div className="advice-head">
              <span style={{ fontSize: 22 }}>{c.emoji}</span>
              <span className={`badge ${c.kind}`}>{c.tag}</span>
            </div>
            <p className="advice-title">{c.title}</p>
            <p className="advice-body">{c.body}</p>
            <button className="advice-cta">
              {c.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
