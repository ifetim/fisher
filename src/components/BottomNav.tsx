'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './BottomNav.css'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/spending', label: 'Spending' },
  { href: '/savings', label: 'Savings' },
  { href: '/advice', label: 'Advice' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav" aria-label="Main">
      {links.map(({ href, label }) => {
        const isActive =
          pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
