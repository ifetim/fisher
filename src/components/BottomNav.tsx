'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { appNavLinks, isNavActive } from './nav/navLinks'
import { NAV_ICON_MAP } from './nav/NavIcons'
import './BottomNav.css'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav" aria-label="Main">
      {appNavLinks.map(({ href, label }) => {
        const active = isNavActive(pathname, href)
        const Icon = NAV_ICON_MAP[href]
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav__link${active ? ' bottom-nav__link--active' : ''}`}
          >
            {Icon && <Icon />}
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
