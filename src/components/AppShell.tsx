'use client'

import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { BottomNav } from './BottomNav'
import './AppShell.css'

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="app-shell">
        <main className="app-shell__main app-shell__main--gate">
          <p className="app-shell__gate">
            Sign in required — login is handled on another branch.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <main className="app-shell__main">{children}</main>
      <BottomNav />
    </div>
  )
}
