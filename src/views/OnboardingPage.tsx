'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { PlaidConnect } from '@/components/plaid/PlaidConnect'
import './OnboardingPage.css'

const ONBOARDING_KEY = 'clearmint-onboarded'

const REASONS = [
  {
    id: 'overspend',
    emoji: '🔍',
    title: "I overspend and don't know where it goes",
    sub: 'Track every dollar automatically',
  },
  {
    id: 'save',
    emoji: '🌱',
    title: "I want to start saving but don't know how much",
    sub: 'Set goals and see a clear path',
  },
  {
    id: 'debt',
    emoji: '📉',
    title: "I'm trying to get on top of debt",
    sub: 'Understand your full picture first',
  },
  {
    id: 'overview',
    emoji: '🗂️',
    title: 'I just want everything in one place',
    sub: 'All your accounts and spending, unified',
  },
] as const

type ReasonId = (typeof REASONS)[number]['id']

export function OnboardingPage() {
  const router = useRouter()
  const { user, ready } = useAuth()
  const { plaidConnected } = useFinance()
  const [step, setStep] = useState(1)
  const [reason, setReason] = useState<ReasonId | null>(null)
  const [bankDone, setBankDone] = useState(false)

  useEffect(() => {
    if (plaidConnected) setBankDone(true)
  }, [plaidConnected])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (ready && !user) router.replace('/login')
  }, [ready, user, router])

  // Skip onboarding if already completed
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(ONBOARDING_KEY)) {
      router.replace('/dashboard')
    }
  }, [router])

  function finish() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, '1')
    }
    router.replace('/dashboard')
  }

  if (!ready || !user) return null

  return (
    <div className="ob-page">
      {/* ── Left brand panel ── */}
      <div className="ob-brand">
        <div className="ob-brand__inner">
          <div className="auth-brand__logo">
            <span className="auth-brand__logo-icon" aria-hidden>$</span>
            <span className="auth-brand__logo-name">ClearMint</span>
          </div>

          <p className="ob-brand__tagline">
            {step === 1 && <>Let's make your<br />money make sense.</>}
            {step === 2 && <>Connect once,<br />see everything.</>}
            {step === 3 && <>You're ready<br />to go.</>}
          </p>

          <div className="ob-steps" aria-label="Progress">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`ob-step-dot${n === step ? ' ob-step-dot--active' : ''}${n < step ? ' ob-step-dot--done' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right content panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-panel__inner ob-content">

          {/* Step 1 — Why are you here */}
          {step === 1 && (
            <div className="ob-step" key="step1">
              <p className="ob-step-label">Step 1 of 3</p>
              <h2 className="auth-heading">Why are you here?</h2>
              <p className="auth-subheading">Pick the one that fits best — it shapes how ClearMint guides you.</p>

              <div className="ob-reasons">
                {REASONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`ob-reason${reason === r.id ? ' ob-reason--selected' : ''}`}
                    onClick={() => setReason(r.id)}
                  >
                    <span className="ob-reason__emoji" aria-hidden>{r.emoji}</span>
                    <span className="ob-reason__body">
                      <span className="ob-reason__title">{r.title}</span>
                      <span className="ob-reason__sub">{r.sub}</span>
                    </span>
                    <span className="ob-reason__check" aria-hidden>
                      {reason === r.id ? '✓' : ''}
                    </span>
                  </button>
                ))}
              </div>

              <button
                className="auth-submit"
                disabled={!reason}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2 — Connect bank */}
          {step === 2 && (
            <div className="ob-step" key="step2">
              <p className="ob-step-label">Step 2 of 3</p>
              <h2 className="auth-heading">Connect your bank</h2>
              <p className="auth-subheading">
                We use Plaid — read-only, bank-level security. Your credentials never touch our servers.
              </p>

              <div className="ob-plaid-wrap">
                <PlaidConnect />
              </div>

              <button
                className="auth-submit"
                onClick={() => setStep(3)}
              >
                {bankDone ? 'Looks good — continue' : 'Skip for now, use demo data'}
              </button>

              <button
                type="button"
                className="ob-back"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step 3 — All set */}
          {step === 3 && (
            <div className="ob-step ob-step--final" key="step3">
              <p className="ob-step-label">Step 3 of 3</p>

              <div className="ob-final-icon" aria-hidden>✦</div>

              <h2 className="auth-heading ob-final-heading">You're all set</h2>
              <p className="auth-subheading">
                {bankDone
                  ? 'Your bank is connected. ClearMint will keep your transactions in sync.'
                  : "You're starting with demo data — you can connect a real bank any time from the Spending screen."}
              </p>

              <div className="ob-summary">
                <div className="ob-summary__row">
                  <span className="ob-summary__icon">🎯</span>
                  <span className="ob-summary__text">
                    {REASONS.find((r) => r.id === reason)?.title ?? 'Goal set'}
                  </span>
                </div>
                <div className="ob-summary__row">
                  <span className="ob-summary__icon">{bankDone ? '🏦' : '🗂️'}</span>
                  <span className="ob-summary__text">
                    {bankDone ? 'Bank connected via Plaid' : 'Using demo data'}
                  </span>
                </div>
              </div>

              <button className="auth-submit ob-final-btn" onClick={finish}>
                Open my dashboard →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
