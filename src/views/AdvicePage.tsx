'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { getAccountsForUser } from '@/data'
import { computeHealthScore } from '@/lib/healthScore'
import { V3Icons, V3StatusBar } from '@/components/v3/V3Icons'

type AdviceCard = {
  kind: 'win' | 'watch' | 'tip'
  tag: string
  title: string
  body: string
  cta: string
}

const STATIC_ADVICE: AdviceCard[] = [
  {
    kind: 'win',
    tag: 'Win',
    title: "You're saving 22% of income",
    body: 'Above the recommended 20%. That puts you on track to hit your emergency fund a month early.',
    cta: 'See breakdown',
  },
  {
    kind: 'watch',
    tag: 'Watch',
    title: 'Dining out crept up',
    body: "That's worth a look. Want to set a soft cap for next month?",
    cta: 'Set a cap',
  },
  {
    kind: 'tip',
    tag: 'Tip',
    title: 'Move extra cash to savings',
    body: 'Your chequing has been steady. Moving the excess could help your goals.',
    cta: 'Transfer now',
  },
  {
    kind: 'tip',
    tag: 'Tip',
    title: 'Cancel one streaming service?',
    body: "Review subscriptions you haven't used lately — small wins add up.",
    cta: 'Review subscriptions',
  },
]

const CTA_ROUTES: Record<string, string> = {
  'See breakdown':        '/dashboard',
  'Set a cap':            '/dashboard',
  'Transfer now':         '/savings',
  'Review subscriptions': '/dashboard',
  'Learn more':           '/dashboard',
}

export function AdvicePage() {
  const router = useRouter()
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
        body: JSON.stringify({
          score: health.score,
          factors: health.factors.map((f) => ({ label: f.label, detail: f.detail })),
        }),
      })
      const data = (await res.json()) as { cards?: { title: string; body: string }[] }
      if (data.cards) {
        setAiCards(
          data.cards.map((c, i) => ({
            kind: i === 0 ? 'win' : i === 1 ? 'watch' : 'tip',
            tag: i === 0 ? 'Win' : i === 1 ? 'Watch' : 'Tip',
            title: c.title,
            body: c.body,
            cta: 'Learn more',
          })),
        )
      }
    } catch {
      /* keep static */
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const C = 2 * Math.PI * 38
  const score = health.score
  const scoreLabel =
    health.score >= 70 ? 'Looking strong' : health.score >= 45 ? 'Making progress' : 'Needs attention'

  return (
    <div>
      <V3StatusBar />
      <div className="screen-head">
        <div>
          <p className="greet">AI-powered insights</p>
          <h1>Advice</h1>
        </div>
        <div className="head-avatar spark">{V3Icons.spark}</div>
      </div>

      <div className="health">
        <div className="ring">
          <svg width="100%" height="100%" viewBox="0 0 86 86" preserveAspectRatio="xMidYMid meet">
            <circle
              cx="43"
              cy="43"
              r="38"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="7"
              fill="none"
            />
            <circle
              cx="43"
              cy="43"
              r="38"
              stroke="currentColor"
              strokeWidth="7"
              fill="none"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - score / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="score">{score}</div>
        </div>
        <div className="body">
          <p className="label">Financial health</p>
          <p className="title">{scoreLabel}</p>
          <p className="sub">
            {health.factors[0]?.detail ?? 'Keep saving and watch dining.'}
          </p>
        </div>
      </div>

      <div className="sec">
        <span className="lbl">For you this week</span>
        <span
          className="act"
          onClick={() => void loadAiAdvice()}
          role="button"
          tabIndex={0}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Thinking…' : 'Refresh'}
        </span>
      </div>
      <div className="advice-grid">
        {cards.map((c, i) => (
          <div className="advice" key={i}>
            <div className="head">
              <span className={`badge ${c.kind}`}>{c.tag}</span>
            </div>
            <p className="title">{c.title}</p>
            <p className="body">{c.body}</p>
            <button
              type="button"
              className="cta"
              onClick={() => router.push(CTA_ROUTES[c.cta] ?? '/advice')}
            >
              {c.cta} {V3Icons.arrow}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
