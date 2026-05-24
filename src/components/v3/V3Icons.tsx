/** Shared SVG icons for ClearMint v3 (Navy Hero theme). */

import type { ReactNode } from 'react'

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const V3Icons = {
  home: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M3 9.5L12 3l9 6.5V20a2 2 0 01-2 2h-4v-7H10v7H6a2 2 0 01-2-2V9.5z" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <line x1="2" y1="11" x2="22" y2="11" />
    </svg>
  ),
  vault: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="4" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="20" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  up: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 15 12 9 18 15" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  coffee: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="5" />
      <line x1="10" y1="2" x2="10" y2="5" />
      <line x1="14" y1="2" x2="14" y2="5" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  bus: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="16" cy="19" r="2" />
      <line x1="4" y1="11" x2="20" y2="11" />
    </svg>
  ),
  wage: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  bank: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <line x1="3" y1="22" x2="21" y2="22" />
      <polyline points="3 10 12 3 21 10" />
      <line x1="5" y1="10" x2="5" y2="22" />
      <line x1="9" y1="10" x2="9" y2="22" />
      <line x1="15" y1="10" x2="15" y2="22" />
      <line x1="19" y1="10" x2="19" y2="22" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  bullseye: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  out: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
}

export function V3StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="icons">
        <svg viewBox="0 0 18 12" fill="currentColor">
          <path d="M1 8h2v3H1zM5 6h2v5H5zM9 4h2v7H9zM13 2h2v9h-2z" />
        </svg>
        <svg viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 5.5a11 11 0 0 1 16 0M3.5 8a7 7 0 0 1 11 0M6 10.5a3 3 0 0 1 6 0" />
        </svg>
        <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="1" y="1" width="20" height="10" rx="2" />
          <rect x="3" y="3" width="14" height="6" fill="currentColor" />
          <rect x="22" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}

export function BrandPane({
  tagline,
  blurb,
  features,
  foot,
}: {
  tagline: ReactNode
  blurb: string
  features?: string[]
  foot?: ReactNode
}) {
  return (
    <div className="auth-brand">
      <div className="auth-logo">
        <div className="icon">$</div>
        <div className="wordmark">ClearMint</div>
      </div>

      <div>
        <h1 className="auth-tagline">{tagline}</h1>
        <p className="auth-blurb">{blurb}</p>

        {features && features.length > 0 ? (
          <ul className="auth-features">
            {features.map((f) => (
              <li key={f}>
                <span className="check">{V3Icons.check}</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="auth-foot">
        {foot ?? (
          <>
            <strong>Demo build</strong> · no real money moves · data stays on this device
          </>
        )}
      </div>
    </div>
  )
}
