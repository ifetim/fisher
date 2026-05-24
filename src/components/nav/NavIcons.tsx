import type { NavId } from './navLinks'
import { V3Icons } from '@/components/v3/V3Icons'

export function NavIcons({ id }: { id: NavId }) {
  switch (id) {
    case 'dashboard':
      return V3Icons.home
    case 'spending':
      return V3Icons.card
    case 'savings':
      return V3Icons.vault
    case 'advice':
      return V3Icons.spark
  }
}
