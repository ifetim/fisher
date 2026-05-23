import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('fe@email.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (login(email, password)) {
      navigate('/dashboard')
      return
    }
    setError('Email or password is incorrect.')
  }

  return (
    <div className="login-page">
      <header className="login-page__header">
        <div className="login-page__logo" aria-hidden="true">
          CM
        </div>
        <h1 className="login-page__title">ClearMint</h1>
        <p className="login-page__subtitle">Welcome back</p>
      </header>

      <form className="login-page__form" onSubmit={handleSubmit}>
        <label className="login-page__label">
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="login-page__label">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="login-page__error">{error}</p> : null}
        <button type="submit" className="login-page__submit">
          Sign in
        </button>
      </form>

      <p className="login-page__hint">Demo: fe@email.com / password123</p>
    </div>
  )
}
