'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { BottomNav } from './BottomNav'
import { AppSidebar } from './nav/AppSidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login')
    }
  }, [ready, user, router])

  if (!user) {
    return (
      <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#f6f6fa' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div className="app">
      <AppSidebar active={pathname} />
      <main className="main">
        <div className="main-inner">{children}</div>
      </main>
      <BottomNav />
    </div>
  )
}
