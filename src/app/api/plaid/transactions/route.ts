import { NextResponse } from 'next/server'
import { getPlaidClient } from '@/lib/plaid/plaidClient'
import { normalizePlaidTransaction } from '@/lib/plaid/normalizeTransaction'
import { getSession, updateCursor } from '@/lib/plaid/sessionStore'

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get('userId') ?? ''
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const session = getSession(userId)
    if (!session) {
      return NextResponse.json(
        { error: 'No Plaid connection for this user' },
        { status: 401 },
      )
    }

    const collected = []
    let cursor = session.cursor ?? undefined
    let hasMore = true

    while (hasMore) {
      const response = await getPlaidClient().transactionsSync({
        access_token: session.accessToken,
        cursor,
      })

      collected.push(...response.data.added, ...response.data.modified)
      cursor = response.data.next_cursor
      hasMore = response.data.has_more
    }

    updateCursor(userId, cursor ?? null)

    const transactions = collected
      .map((tx) => normalizePlaidTransaction(tx))
      .sort((a, b) => b.date.localeCompare(a.date))

    return NextResponse.json({ transactions, count: transactions.length })
  } catch (error) {
    console.error('transactions error', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    )
  }
}
