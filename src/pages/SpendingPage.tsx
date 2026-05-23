import { useAuth } from '../context/AuthContext'
import { getTransactionsForUser } from '../data'
import { PlaidConnect } from '../components/plaid/PlaidConnect'
import './PlaceholderPage.css'

export function SpendingPage() {
  const { user } = useAuth()
  if (!user) return null

  const jsonTransactions = getTransactionsForUser(user.id)

  return (
    <section className="page">
      <h1 className="page__title">Spending</h1>
      <PlaidConnect />
      <p className="page__lead">
        {jsonTransactions.length} transactions from JSON (fallback).
      </p>
      <p className="page__note">Plaid list above is temp UI — polish later.</p>
    </section>
  )
}
