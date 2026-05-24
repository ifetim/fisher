/** Whole-dollar formatting for v3 hero amounts (CAD). */
export function formatAmountWhole(n: number): string {
  return new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 }).format(Math.round(n))
}

export function accountTone(type: string): '' | 'mint' | 'orange' {
  if (type === 'savings') return 'mint'
  if (type === 'credit') return 'orange'
  return ''
}

export function bankCode(bank: string): string {
  const letters = bank.replace(/[^a-zA-Z]/g, '').toUpperCase()
  return letters.slice(0, 2) || 'AC'
}
