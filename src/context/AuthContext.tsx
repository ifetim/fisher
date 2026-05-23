'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { users } from '../data'
import type { User } from '../types'

const STORAGE_KEY = 'clearmint-user-id'

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadStoredUser(): User | null {
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'development') return users[0] ?? null
    return null
  }

  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (raw) {
    const id = Number(raw)
    const stored = users.find((u) => u.id === id)
    if (stored) return stored
  }
  if (process.env.NODE_ENV === 'development') return users[0] ?? null
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadStoredUser())

  const login = useCallback((email: string, password: string) => {
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    )
    if (!match) return false
    sessionStorage.setItem(STORAGE_KEY, String(match.id))
    setUser(match)
    return true
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
