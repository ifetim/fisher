'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { BrandPane, V3Icons } from '@/components/v3/V3Icons'

export function LoginPage() {
  const { login, user, ready } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromSignup = searchParams.get('from') === 'signup'

  const [email, setEmail] = useState('fe@email.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    if (ready && user) router.replace('/dashboard')
  }, [ready, user, router])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const ok = login(email, password)
    if (!ok) {
      setError("Those credentials didn't match. Try the demo hint below.")
      return
    }
    setNavigating(true)
    const onboarded =
      typeof window !== 'undefined' && localStorage.getItem('clearmint-onboarded')
    router.replace(onboarded ? '/dashboard' : '/onboarding')
  }

  if (navigating) {
    return (
      <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Signing in…</p>
      </div>
    )
  }

  return (
    <div className="auth">
      <BrandPane
        tagline={
          <>
            Welcome <span className="accent">back.</span>
          </>
        }
        blurb="Pick up where you left off — your accounts, goals, and habits are waiting."
        features={[
          'Track spending across every account',
          'Grow savings with realistic goals',
          'Calm AI insights — only when you ask',
        ]}
      />

      <div className="auth-form-pane">
        <div className="auth-form-inner">
          <Link href="/" className="auth-back">
            {V3Icons.back} Back
          </Link>

          {fromSignup ? (
            <div className="auth-banner">
              {V3Icons.check}
              Account created. Sign in to get started.
            </div>
          ) : null}

          <h2 className="auth-heading">Sign in</h2>
          <p className="auth-sub">Use your ClearMint account to continue.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="li-email">Email</label>
              <input
                id="li-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <div className="field" style={{ position: 'relative' }}>
              <label htmlFor="li-pw">Password</label>
              <input
                id="li-pw"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute',
                  right: 12,
                  bottom: 12,
                  background: 'none',
                  border: 'none',
                  color: 'var(--soft)',
                  padding: 4,
                }}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? V3Icons.eyeOff : V3Icons.eye}
              </button>
            </div>

            {error ? <p className="auth-error">{error}</p> : null}

            <div className="auth-hint">
              Demo: <code>fe@email.com</code> / <code>password123</code>
            </div>

            <button type="submit" className="btn block">
              Sign in
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account? <Link href="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
