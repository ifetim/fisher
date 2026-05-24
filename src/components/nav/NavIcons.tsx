import type { NavId } from './navLinks'

export function NavIcons({ id }: { id: NavId }) {
  switch (id) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a2 2 0 01-2 2h-4v-7H10v7H6a2 2 0 01-2-2V9.5z"/>
        </svg>
      )
    case 'spending':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="13" rx="2"/>
          <line x1="2" y1="11" x2="22" y2="11"/>
        </svg>
      )
    case 'savings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2z"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
          <path d="M12 7v4m0 0v4m0-4h4m-4 0H8"/>
        </svg>
      )
    case 'advice':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c0 .8.5 1.3 1 1.3h6c.5 0 1-.5 1-1.3A7 7 0 0012 2z"/>
        </svg>
      )
  }
}
