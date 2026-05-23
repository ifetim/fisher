import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BottomNav } from './BottomNav'
import './AppShell.css'

export function AppShell() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-shell">
      <main className="app-shell__main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
