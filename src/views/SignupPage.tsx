'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { BrandPane, V3Icons } from '@/components/v3/V3Icons'

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

    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }

    const ok = login('fe@email.com', 'password123')
    if (ok) {
      router.replace('/onboarding')
    } else {
      router.push('/login?from=signup')
    }
  }

  return (
    <div className="auth">
      <BrandPane
        tagline={
          <>
            Money, <span className="accent">finally clear.</span>
          </>
        }
        blurb="ClearMint gives you the full picture — what's coming in, what's going out, what's actually left. Without the guilt trip."
        features={[
          'No shame, no guilt — just clarity',
          'Plaid-secured bank connections',
          'Free forever for students',
        ]}
      />

      <div className="auth-form-pane">
        <div className="auth-form-inner">
          <Link href="/" className="auth-back">
            {V3Icons.back} Back
          </Link>

          <h2 className="auth-heading">Create an account</h2>
          <p className="auth-sub">Free forever — no credit card needed.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="su-name">Full name</label>
              <input
                id="su-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Tremblay"
              />
            </div>
            <div className="field">
              <label htmlFor="su-email">Email</label>
              <input
                id="su-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <div className="field-pair">
              <div className="field">
                <label htmlFor="su-pw">Password</label>
                <input
                  id="su-pw"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                />
              </div>
              <div className="field">
                <label htmlFor="su-confirm">Confirm</label>
                <input
                  id="su-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat"
                />
              </div>
            </div>

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="btn block" style={{ marginTop: 8 }}>
              Create account →
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
