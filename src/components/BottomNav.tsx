import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/spending', label: 'Spending' },
  { to: '/savings', label: 'Savings' },
  { to: '/advice', label: 'Advice' },
] as const

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
