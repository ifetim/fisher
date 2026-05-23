import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { AuthProvider } from './context/AuthContext'
import { AdvicePage } from './pages/AdvicePage'
import { DashboardPage } from './pages/DashboardPage'
import { PlaidTestPage } from './pages/PlaidTestPage'
import { SavingsPage } from './pages/SavingsPage'
import { SpendingPage } from './pages/SpendingPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/plaid-test" element={<PlaidTestPage />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/spending" element={<SpendingPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/advice" element={<AdvicePage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
