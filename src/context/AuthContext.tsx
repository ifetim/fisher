'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { users } from '../data'
import type { User } from '../types'

const STORAGE_KEY = 'clearmint-user-id'

type AuthContextValue = {
  user: User | null
  ready: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  switchDemo: (userId: number) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadStoredUser(): User | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  const id = Number(raw)
  return users.find((u) => u.id === id) ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setUser(loadStoredUser())
    setReady(true)
  }, [])

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

  const switchDemo = useCallback((userId: number) => {
    const match = users.find((u) => u.id === userId)
    if (!match) return
    sessionStorage.setItem(STORAGE_KEY, String(match.id))
    setUser(match)
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, logout, switchDemo }),
    [user, ready, login, logout, switchDemo],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
