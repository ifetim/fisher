export function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <rect x="1.5" y="1.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="10" y="1.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="1.5" y="10" width="6.5" height="6.5" rx="1.5" />
      <rect x="10" y="10" width="6.5" height="6.5" rx="1.5" />
    </svg>
  )
}

export function IconBars() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <rect x="1.5" y="10.5" width="3.5" height="6" rx="1" />
      <rect x="7.25" y="7" width="3.5" height="9.5" rx="1" />
      <rect x="13" y="3.5" width="3.5" height="13" rx="1" />
    </svg>
  )
}

export function IconGrowth() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9.5" r="5.75" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M9 12.5V7M6.75 9.25l2.25-2.25 2.25 2.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconBulb() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 2.5a4.5 4.5 0 0 1 3 7.8c-.3.25-.3.5-.3.75v.45a.9.9 0 0 1-.9.9H7.2a.9.9 0 0 1-.9-.9v-.45c0-.25-.02-.5-.3-.75A4.5 4.5 0 0 1 9 2.5z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path d="M7 15.5h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export const NAV_ICON_MAP: Record<string, () => React.ReactElement> = {
  '/dashboard': IconGrid,
  '/spending': IconBars,
  '/savings': IconGrowth,
  '/advice': IconBulb,
}
