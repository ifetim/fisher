import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  getAccountsForUser,
  getSavingsPlansForUser,
  getTransactionsForUser,
} from '../data'
import './PlaceholderPage.css'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  const accounts = getAccountsForUser(user.id)
  const transactions = getTransactionsForUser(user.id)
  const goals = getSavingsPlansForUser(user.id)

  return (
    <section className="page">
      <h1 className="page__title">Dashboard</h1>
      <p className="page__lead">Hi {user.name.split(' ')[0]} — foundation is linked.</p>
      <ul className="page__stats">
        <li>{accounts.length} accounts</li>
        <li>{transactions.length} transactions</li>
        <li>{goals.length} savings goal</li>
      </ul>
      <p className="page__note">Next: net worth, hidden balances, insights.</p>
      <button
        type="button"
        className="page__logout"
        onClick={() => {
          logout()
          navigate('/login')
        }}
      >
        Sign out
      </button>
    </section>
  )
}
