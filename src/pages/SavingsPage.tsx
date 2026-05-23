import { useAuth } from '../context/AuthContext'
import { getSavingsPlansForUser } from '../data'
import './PlaceholderPage.css'

export function SavingsPage() {
  const { user } = useAuth()
  if (!user) return null

  const goals = getSavingsPlansForUser(user.id)

  return (
    <section className="page">
      <h1 className="page__title">Savings</h1>
      <p className="page__lead">
        {goals[0]?.goal ?? 'No goals'} — ${goals[0]?.savedAmount ?? 0} saved.
      </p>
      <p className="page__note">Next: progress bars, AI savings tips.</p>
    </section>
  )
}
