'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import './SignupPage.css'

export function SignupPage() {
  const { login, user, ready } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (ready && user) router.replace('/dashboard')
  }, [ready, user, router])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }

    // Demo app — auto-login with the demo account
    const ok = login('fe@email.com', 'password123')
    if (ok) {
      router.replace('/dashboard')
    } else {
      router.push('/login?from=signup')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand auth-brand--signup">
        <div className="auth-brand__inner">
          <div className="auth-brand__logo">
            <span className="auth-brand__logo-icon" aria-hidden>$</span>
            <span className="auth-brand__logo-name">ClearMint</span>
          </div>
          <p className="auth-brand__tagline">Your money,<br />finally clear.</p>
          <ul className="auth-brand__features">
            <li>No shame, no guilt — just clarity</li>
            <li>Understand where your money goes</li>
            <li>Build savings goals that actually stick</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-panel__inner">
          <Link href="/" className="auth-back">← Back to home</Link>

          <h2 className="auth-heading">Create an account</h2>
          <p className="auth-subheading">Free to use — no credit card needed</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Tremblay"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="auth-error" role="alert">{error}</p>
            )}

            <div className="auth-demo-hint">
              Demo app — any details work. Your data stays in this browser session.
            </div>

            <button type="submit" className="auth-submit">
              Create account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
