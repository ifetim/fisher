import { useCallback, useState } from 'react'
import { formatCurrency } from '../lib/format'

export function useBalanceVisibility(initialVisible = false) {
  const [balancesVisible, setBalancesVisible] = useState(initialVisible)

  const toggleBalances = useCallback(() => {
    setBalancesVisible((v) => !v)
  }, [])

  const displayAmount = useCallback(
    (amount: number) =>
      balancesVisible ? formatCurrency(amount) : '••••••',
    [balancesVisible],
  )

  return { balancesVisible, toggleBalances, displayAmount }
}
