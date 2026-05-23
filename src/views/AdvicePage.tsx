'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { getAccountsForUser } from '@/data'
import { computeHealthScore } from '@/lib/healthScore'
import { StatementUpload } from '@/components/spending/StatementUpload'
import '@/components/shared/page.css'
import './AdvicePage.css'

type AdviceCard = { title: string; body: string }

const LITERACY = [
  {
    id: 'emergency',
    title: 'Emergency fund',
    body: 'An emergency fund is cash set aside for surprises — job changes, car repairs, medical bills. Start with one week of essential expenses, then build toward 1–3 months over time.',
  },
  {
    id: 'compound',
    title: 'Compound interest',
    body: 'When savings earn interest, that interest can earn more interest over time. Starting early matters more than starting big — consistency wins.',
  },
  {
    id: 'credit',
    title: 'Credit score basics',
    body: 'Payment history and credit utilization (how much of your limit you use) are the biggest factors. Pay on time and keep balances low relative to limits.',
  },
]

const CATEGORY_TIPS: Record<string, string> = {
  'Food & Dining':
    'Try a “delivery budget” — decide a dollar cap before opening the app. Meal prep twice a week often cuts food spend without feeling restrictive.',
  Transport:
    'Combine errands into one trip, check transit passes, and review insurance at renewal — small fixes add up monthly.',
  Shopping:
    'Use a 48-hour rule for non-essentials over $50. If you still want it after two days, buy with intention.',
}

export function AdvicePage() {
  const { user } = useAuth()
  const { transactions } = useFinance()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [cards, setCards] = useState<AdviceCard[]>([])
  const [loadingAdvice, setLoadingAdvice] = useState(false)

  const accounts = user ? getAccountsForUser(user.id) : []

  const health = useMemo(
    () => computeHealthScore(accounts, transactions),
    [accounts, transactions],
  )

  async function loadAdvice() {
    setLoadingAdvice(true)
    try {
      const res = await fetch('/api/gemini/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: health.score,
          factors: health.factors.map((f) => ({
            label: f.label,
            detail: f.detail,
          })),
        }),
      })
      const data = (await res.json()) as { cards?: AdviceCard[] }
      setCards(data.cards ?? [])
    } catch {
      setCards([])
    } finally {
      setLoadingAdvice(false)
    }
  }

  if (!user) return null

  const scoreColor =
    health.score >= 70
      ? 'var(--color-income)'
      : health.score >= 45
        ? 'var(--color-text)'
        : 'var(--color-spend)'

  return (
    <section className="page advice-page">
      <h1 className="page__title">Advice</h1>
      <p className="page__subtitle">
        Your health score is calculated from your data — AI only explains it.
      </p>

      <div className="advice-page__score card">
        <p className="page__section-title">Spending health score</p>
        <p className="advice-page__score-value" style={{ color: scoreColor }}>
          {health.score}
        </p>
        <p className="advice-page__score-out-of">out of 100</p>
        <ul className="advice-page__factors">
          {health.factors.map((f) => (
            <li key={f.id}>
              <strong>{f.label}</strong> — {f.detail}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="btn btn--primary advice-page__cta"
        disabled={loadingAdvice}
        onClick={() => void loadAdvice()}
      >
        {loadingAdvice ? 'Loading advice…' : 'Get personalized advice'}
      </button>

      <div className="advice-page__grid">
        {cards.length > 0
          ? cards.map((c) => (
              <article key={c.title} className="card advice-page__card">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))
          : null}

        {Object.entries(CATEGORY_TIPS).map(([cat, tip]) => (
          <article key={cat} className="card advice-page__tip">
            <h3>{cat}</h3>
            <p>{tip}</p>
          </article>
        ))}
      </div>

      <div className="page__section">
        <h2 className="page__section-title">Financial literacy</h2>
        {LITERACY.map((item) => (
          <div key={item.id} className="card advice-page__literacy">
            <button
              type="button"
              className="advice-page__literacy-head"
              onClick={() =>
                setExpanded((e) => (e === item.id ? null : item.id))
              }
            >
              {item.title}
              <span aria-hidden>{expanded === item.id ? '−' : '+'}</span>
            </button>
            {expanded === item.id ? (
              <p className="advice-page__literacy-body">{item.body}</p>
            ) : null}
          </div>
        ))}
      </div>

      <StatementUpload />
    </section>
  )
}
