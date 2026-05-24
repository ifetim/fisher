'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { navLinks } from './navLinks'
import { NavIcons } from './NavIcons'
import { V3Icons } from '@/components/v3/V3Icons'
import { DemoSwitcher } from './DemoSwitcher'

export function AppSidebar({ active }: { active: string }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const initials = user?.avatar ?? user?.name?.slice(0, 1).toUpperCase() ?? 'U'

  function signOut() {
    logout()
    router.replace('/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo">$</div>
        <div className="name">Student Saver</div>
      </div>

      {navLinks.map((link) => {
        const isActive =
          active === link.href ||
          (link.href !== '/dashboard' && active.startsWith(link.href))
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-item${isActive ? ' active' : ''}`}
          >
            <NavIcons id={link.id} />
            <span>{link.label}</span>
          </Link>
        )
      })}

      <DemoSwitcher />

      <div className="sidebar-foot">
        <div className="avatar">{initials}</div>
        <div className="info">
          <p className="name">{user?.name ?? 'User'}</p>
          <p className="sub">Free plan</p>
        </div>
        <button type="button" className="out" onClick={signOut} aria-label="Sign out">
          {V3Icons.out}
        </button>
      </div>
    </aside>
  )
}
