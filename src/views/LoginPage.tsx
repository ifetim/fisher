'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import './LoginPage.css'

export function LoginPage() {
  const { login, user, ready } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('fe@email.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (ready && user) router.replace('/dashboard')
  }, [ready, user, router])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const ok = login(email, password)
    if (!ok) {
      setError('Email or password did not match. Try fe@email.com / password123')
      return
    }
    router.replace('/dashboard')
  }

  return (
    <div className="login-page-wrap">
      <div className="login">
        <Link href="/" className="login__back">
          ← Home
        </Link>
        <div className="login__brand">
          <span className="login__logo" aria-hidden>
            $
          </span>
          <h1 className="login__name">ClearMint</h1>
        </div>
        <p className="login__welcome">Welcome back</p>
        <p className="login__hint">
          Sign in to see your money clearly — no guilt, just calm guidance.
        </p>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? (
            <p className="login__error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn btn--primary login__submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
