'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useFinance } from '@/context/FinanceContext'
import { ObPlaidStep } from '@/components/v3/ObPlaidStep'
import { V3Icons } from '@/components/v3/V3Icons'

const ONBOARDING_KEY = 'student-saver-onboarded'

const REASONS = [
  {
    id: 'overspend',
    icon: V3Icons.bullseye,
    title: "I overspend and don't know where it goes",
    sub: 'Track every dollar automatically',
  },
  {
    id: 'save',
    icon: V3Icons.vault,
    title: "I want to start saving but don't know how much",
    sub: 'Set goals and see a clear path',
  },
  {
    id: 'debt',
    icon: V3Icons.down,
    title: "I'm trying to get on top of debt",
    sub: 'Understand your full picture first',
  },
  {
    id: 'overview',
    icon: V3Icons.card,
    title: 'I just want everything in one place',
    sub: 'Accounts and spending, unified',
  },
] as const

type ReasonId = (typeof REASONS)[number]['id']

function StepLeftPane({ step }: { step: number }) {
  const taglines: Record<number, ReactNode> = {
    1: (
      <>
        Let&apos;s make your money <span className="accent">make sense.</span>
      </>
    ),
    2: (
      <>
        Connect once, <span className="accent">see everything.</span>
      </>
    ),
    3: (
      <>
        You&apos;re <span className="accent">ready to go.</span>
      </>
    ),
  }
  const blurbs: Record<number, string> = {
    1: 'Pick the goal that fits — Student Saver adapts so the advice you see is actually for you.',
    2: 'Plaid-secured, read-only access. We never see your password and never move money.',
    3: 'Everything is set up. You can adjust anything later from Settings.',
  }

  return (
    <div className="auth-brand">
      <div className="auth-logo">
        <div className="icon">$</div>
        <div className="wordmark">Student Saver</div>
      </div>

      <div>
        <h1 className="auth-tagline">{taglines[step]}</h1>
        <p className="auth-blurb">{blurbs[step]}</p>

        <div className="ob-steps" aria-label={`Step ${step} of 3`}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`ob-dot ${n < step ? 'done' : ''} ${n === step ? 'active' : ''}`.trim()}
            />
          ))}
        </div>
      </div>

      <div className="auth-foot">
        Step <strong>{step}</strong> of 3 · about a minute
      </div>
    </div>
  )
}

export function OnboardingPage() {
  const router = useRouter()
  const { user, ready } = useAuth()
  const { plaidConnected } = useFinance()
  const [step, setStep] = useState(1)
  const [reason, setReason] = useState<ReasonId | null>(null)
  const [bankConnected, setBankConnected] = useState(false)

  useEffect(() => {
    if (plaidConnected) setBankConnected(true)
  }, [plaidConnected])

  useEffect(() => {
    if (ready && !user) router.replace('/login')
  }, [ready, user, router])

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(ONBOARDING_KEY)) {
      router.replace('/dashboard')
    }
  }, [router])

  function finish() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, '1')
      if (reason) localStorage.setItem('student-saver-reason', reason)
    }
    router.replace('/dashboard')
  }

  if (!ready || !user) return null

  const firstName = user.name.split(' ')[0] ?? user.name
  const reasonObj = REASONS.find((r) => r.id === reason)

  return (
    <div className="auth">
      <StepLeftPane step={step} />

      <div className="auth-form-pane">
        <div className="auth-form-inner">
          {step === 1 && (
            <>
              <p className="ob-step-label">Step 1 of 3</p>
              <h2 className="auth-heading">Why are you here?</h2>
              <p className="auth-sub">
                Pick the one that fits best — it shapes how Student Saver guides you.
              </p>

              <div className="ob-reasons">
                {REASONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`ob-reason${reason === r.id ? ' selected' : ''}`}
                    onClick={() => setReason(r.id)}
                  >
                    <div className="ico">{r.icon}</div>
                    <div className="body">
                      <p className="title">{r.title}</p>
                      <p className="sub">{r.sub}</p>
                    </div>
                    <div className="check">{reason === r.id ? V3Icons.check : null}</div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn block"
                disabled={!reason}
                style={!reason ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="ob-step-label">Step 2 of 3</p>
              <h2 className="auth-heading">Connect your bank</h2>
              <p className="auth-sub">
                Plaid-secured, read-only access. Your credentials never touch our servers.
              </p>

              <ObPlaidStep connected={bankConnected} />

              <button type="button" className="btn block" onClick={() => setStep(3)}>
                {bankConnected ? 'Looks good — continue →' : 'Skip for now, use demo data →'}
              </button>

              <button type="button" className="ob-back" onClick={() => setStep(1)}>
                {V3Icons.back} Back
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="ob-step-label">Step 3 of 3</p>

              <div className="ob-final">
                <div className="check-ring">{V3Icons.check}</div>

                <h2 className="auth-heading">You&apos;re all set, {firstName}.</h2>
                <p className="auth-sub">
                  {bankConnected
                    ? "Your bank's connected and we're syncing your transactions in the background."
                    : "You're starting with demo data — you can connect a real bank any time from Spending."}
                </p>

                <div className="ob-summary">
                  <div className="row done">
                    <div className="ico">{V3Icons.bullseye}</div>
                    <span className="text">{reasonObj ? reasonObj.title : 'Goal saved'}</span>
                  </div>
                  <div className="row">
                    <div
                      className="ico"
                      style={
                        bankConnected
                          ? { background: 'var(--mint-soft)', color: 'var(--mint)' }
                          : undefined
                      }
                    >
                      {bankConnected ? V3Icons.check : V3Icons.bank}
                    </div>
                    <span className="text">
                      {bankConnected ? 'Bank connected via Plaid' : 'Using demo data for now'}
                    </span>
                  </div>
                </div>

                <button type="button" className="btn block" onClick={finish}>
                  Open my dashboard {V3Icons.arrow}
                </button>
              </div>

              <button type="button" className="ob-back" onClick={() => setStep(2)}>
                {V3Icons.back} Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
