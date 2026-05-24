'use client'

import Link from 'next/link'

export function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="logo">$</div>
        <h1>
          Your spending,
          <br />
          <span className="accent">finally clear.</span>
        </h1>
        <p>
          A calm finance coach for students and everyday people — no shame, no guilt, just
          clarity on where your money goes.
        </p>
        <div className="landing-ctas">
          <Link href="/signup" className="btn lg">
            Get started — it&apos;s free
          </Link>
          <Link href="/login" className="btn ghost lg">
            I already have an account
          </Link>
        </div>
        <p className="landing-foot">Built for Canadian students 🍁 · Powered by Plaid</p>
      </div>
    </div>
  )
}
