'use client'

export default function Hero() {
  return (
    <section className="landing-hero" id="hero">
      <div className="hero-logo">
        <span className="grad-cap" aria-hidden="true">
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="40,4 78,22 40,40 2,22" fill="#f5a623" />
            <rect x="30" y="36" width="20" height="14" rx="2" fill="#f5a623" />
            <line x1="40" y1="22" x2="40" y2="36" stroke="#f5a623" strokeWidth="3" />
          </svg>
        </span>
        <h1 className="hero-title">
          <span className="hero-title-line">STUDENT</span>
          <span className="hero-title-line hero-title-accent">SAVER</span>
        </h1>
      </div>
      <p className="hero-subtitle">Save smarter. Spend with clarity.</p>

      <div className="scroll-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span>scroll down</span>
      </div>
    </section>
  )
}
