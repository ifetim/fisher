export const appNavLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/spending', label: 'Spending' },
  { href: '/savings', label: 'Savings' },
  { href: '/advice', label: 'Advice' },
] as const

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
}
