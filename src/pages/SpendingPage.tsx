import { useAuth } from '../context/AuthContext'
import { getTransactionsForUser } from '../data'
import './PlaceholderPage.css'

export function SpendingPage() {
  const { user } = useAuth()
  if (!user) return null

  const transactions = getTransactionsForUser(user.id)

  return (
    <section className="page">
      <h1 className="page__title">Spending</h1>
      <p className="page__lead">{transactions.length} transactions loaded from JSON.</p>
      <p className="page__note">Next: filters, charts, transaction list.</p>
    </section>
  )
}
