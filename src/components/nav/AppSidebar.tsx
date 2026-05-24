'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { navLinks } from './navLinks'
import { NavIcons } from './NavIcons'

export function AppSidebar({ active }: { active: string }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const initials = user?.avatar ?? user?.name?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">F</div>
        <div className="sidebar-brand-name">Fisher</div>
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

      <div className="sidebar-foot">
        <div className="avatar">{initials}</div>
        <div className="info">
          <p className="name">{user?.name ?? 'User'}</p>
          <p className="sub">
            <button
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.72rem', color: 'var(--muted)' }}
              onClick={() => { logout(); router.replace('/login') }}
            >
              Sign out
            </button>
          </p>
        </div>
      </div>
    </aside>
  )
}
