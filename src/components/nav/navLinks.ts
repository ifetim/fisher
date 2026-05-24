export const navLinks = [
  { id: 'dashboard', href: '/dashboard', label: 'Dashboard' },
  { id: 'spending',  href: '/spending',  label: 'Spending'  },
  { id: 'savings',   href: '/savings',   label: 'Savings'   },
  { id: 'advice',    href: '/advice',    label: 'Advice'    },
] as const

export type NavId = typeof navLinks[number]['id']
