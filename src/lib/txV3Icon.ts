import type { ReactNode } from 'react'
import { V3Icons } from '@/components/v3/V3Icons'

export function txV3Icon(category: string, amount: number): { ico: string; svg: ReactNode } {
  if (amount > 0) return { ico: 'inc', svg: V3Icons.wage }
  const c = category.toLowerCase()
  if (c.includes('food') || c.includes('dining')) return { ico: 'food', svg: V3Icons.coffee }
  if (c.includes('groc')) return { ico: 'groc', svg: V3Icons.cart }
  if (c.includes('bill') || c.includes('util')) return { ico: 'bill', svg: V3Icons.bolt }
  if (c.includes('entertain') || c.includes('subscription')) return { ico: 'sub', svg: V3Icons.music }
  if (c.includes('transport') || c.includes('transit')) return { ico: '', svg: V3Icons.bus }
  if (c.includes('shop')) return { ico: '', svg: V3Icons.bag }
  return { ico: '', svg: V3Icons.card }
}

export function categoryBarTone(name: string): '' | 'mint' | 'rose' | 'text' {
  const c = name.toLowerCase()
  if (c.includes('groc')) return 'mint'
  if (c.includes('bill')) return 'rose'
  if (c.includes('shop')) return 'text'
  return ''
}
