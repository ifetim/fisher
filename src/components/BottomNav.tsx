'use client'

import { useRouter, usePathname } from 'next/navigation'
import { navLinks } from './nav/navLinks'
import { NavIcons } from './nav/NavIcons'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="bnav" aria-label="Main">
      {navLinks.map(({ id, href, label }) => {
        const isActive =
          pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <button
            key={href}
            type="button"
            className={`item${isActive ? ' active' : ''}`}
            onClick={() => router.push(href)}
            aria-label={label}
          >
            <NavIcons id={id} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
