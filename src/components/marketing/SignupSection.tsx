'use client'

import { useRouter } from 'next/navigation'

export default function SignupSection() {
  const router = useRouter()

  return (
    <section className="signup-section" id="signup">
      <h2 className="signup-headline">Sign up to see your spending habits</h2>
      <p className="signup-sub">Let&apos;s save your wallet together.</p>

      <div className="signup-form">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input className="form-input" id="name" type="text" placeholder="Alex Tremblay" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input className="form-input" id="email" type="email" placeholder="you@email.com" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="uni">
            School or city
          </label>
          <input className="form-input" id="uni" type="text" placeholder="e.g. University of Alberta" />
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => router.push('/login')}
        >
          Connect My Spending →
        </button>
        <p className="signup-plaid-note">
          We use Plaid for secure, read-only bank access. Your data is never sold.
        </p>
      </div>
    </section>
  )
}
