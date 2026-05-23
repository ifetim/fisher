'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { appNavLinks, isNavActive } from './navLinks'
import { NAV_ICON_MAP } from './NavIcons'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="app-sidebar" aria-label="Main navigation">
      <Link href="/dashboard" className="app-sidebar__brand">
        <span className="app-sidebar__brand-dot" aria-hidden>$</span>
        ClearMint
      </Link>
      <nav className="app-sidebar__nav">
        {appNavLinks.map(({ href, label }) => {
          const active = isNavActive(pathname, href)
          const Icon = NAV_ICON_MAP[href]
          return (
            <Link
              key={href}
              href={href}
              className={`app-sidebar__link${active ? ' app-sidebar__link--active' : ''}`}
            >
              {Icon && <Icon />}
              {label}
            </Link>
          )
        })}
      </nav>
      <Link href="/" className="app-sidebar__home">
        ← Home
      </Link>
    </aside>
  )
}
