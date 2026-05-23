export type NormalizedTransaction = {
  id: string
  accountId: string
  date: string
  merchant: string
  category: string
  amount: number
  type: 'debit' | 'credit'
}

async function readApiError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    return data.error ?? fallback
  } catch {
    return fallback
  }
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health')
    return res.ok
  } catch {
    return false
  }
}

export async function createLinkToken(userId: string): Promise<string> {
  const res = await fetch('/api/plaid/link-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'Failed to create link token'))
  }
  const data = (await res.json()) as { linkToken: string }
  return data.linkToken
}

export async function exchangePublicToken(
  userId: string,
  publicToken: string,
): Promise<void> {
  const res = await fetch('/api/plaid/exchange-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, publicToken }),
  })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'Failed to exchange token'))
  }
}

export async function fetchPlaidStatus(userId: string): Promise<boolean> {
  const res = await fetch(`/api/plaid/status?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) return false
  const data = (await res.json()) as { connected: boolean }
  return data.connected
}

export async function fetchPlaidTransactions(
  userId: string,
): Promise<NormalizedTransaction[]> {
  const res = await fetch(
    `/api/plaid/transactions?userId=${encodeURIComponent(userId)}`,
  )
  if (!res.ok) {
    throw new Error(await readApiError(res, 'Failed to fetch Plaid transactions'))
  }
  const data = (await res.json()) as { transactions: NormalizedTransaction[] }
  return data.transactions
}
