'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AppSidebar } from './nav/AppSidebar'
import { BottomNav } from './BottomNav'
import './AppShell.css'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, ready, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login')
    }
  }, [ready, user, router])

  if (!ready) {
    return (
      <div className="app-shell">
        <main className="app-shell__main app-shell__main--gate">
          <p className="app-shell__gate">Loading…</p>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="app-shell">
        <main className="app-shell__main app-shell__main--gate">
          <p className="app-shell__gate">Redirecting to sign in…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-shell__body">
        <header className="app-shell__header">
          <span className="app-shell__brand">ClearMint</span>
          <button
            type="button"
            className="app-shell__logout"
            onClick={() => {
              logout()
              router.replace('/login')
            }}
          >
            Sign out
          </button>
        </header>
        <main className="app-shell__main">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}
