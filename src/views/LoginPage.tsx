'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import './LoginPage.css'

export function LoginPage() {
  const { login, user, ready } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromSignup = searchParams.get('from') === 'signup'

  const [email, setEmail] = useState('fe@email.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    if (ready && user) router.replace('/dashboard')
  }, [ready, user, router])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const ok = login(email, password)
    if (!ok) {
      setError("Those credentials didn't match. Use the demo hint below.")
      return
    }
    setNavigating(true)
    router.replace('/dashboard')
  }

  if (navigating) {
    return (
      <div style={{ minHeight: '100dvh', background: '#f6f6fa', display: 'grid', placeItems: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Signing in…</p>
      </div>
    )
  }

  return (
    <div className="auth-page" style={{ background: '#f6f6fa' }}>
      <div className="auth-brand">
        <div className="auth-brand__inner">
          <div className="auth-brand__logo">
            <span className="auth-brand__logo-icon" aria-hidden>$</span>
            <span className="auth-brand__logo-name">ClearMint</span>
          </div>
          <p className="auth-brand__tagline">See your money,<br />clearly.</p>
          <ul className="auth-brand__features">
            <li>Track spending across all accounts</li>
            <li>Grow savings with smart goals</li>
            <li>Calm AI insights when you need them</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-panel__inner">
          <Link href="/" className="auth-back">← Back to home</Link>

          {fromSignup && (
            <div className="auth-success-banner" role="status">
              Account created — sign in to get started.
            </div>
          )}

          <h2 className="auth-heading">Welcome back</h2>
          <p className="auth-subheading">Sign in to your account</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="auth-error" role="alert">{error}</p>
            )}

            <div className="auth-demo-hint">
              Demo: <code>fe@email.com</code> / <code>password123</code>
            </div>

            <button type="submit" className="auth-submit">
              Sign in
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link href="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
