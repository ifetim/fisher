import { NextResponse } from 'next/server'
import type { Transaction as PlaidTransaction } from 'plaid'
import { getPlaidClient } from '@/lib/plaid/plaidClient'
import {
  normalizePlaidTransaction,
  reCategorizeNormalized,
} from '@/lib/plaid/normalizeTransaction'
import { refreshTransactionsIfEmpty } from '@/lib/plaid/refreshTransactions'
import {
  getSession,
  getSessionTransactions,
  mergeSessionTransactions,
  updateCursor,
} from '@/lib/plaid/sessionStore'

async function syncPlaidTransactions(
  accessToken: string,
  startCursor?: string,
): Promise<{ incoming: ReturnType<typeof normalizePlaidTransaction>[]; removed: string[]; nextCursor: string | null }> {
  const collected: PlaidTransaction[] = []
  const removed: string[] = []
  let cursor = startCursor
  let hasMore = true

  while (hasMore) {
    const response = await getPlaidClient().transactionsSync({
      access_token: accessToken,
      cursor,
    })

    collected.push(...response.data.added, ...response.data.modified)
    removed.push(...response.data.removed.map((tx) => tx.transaction_id))
    cursor = response.data.next_cursor
    hasMore = response.data.has_more
  }

  return {
    incoming: collected.map((tx) => normalizePlaidTransaction(tx)),
    removed,
    nextCursor: cursor ?? null,
  }
}

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get('userId') ?? ''
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const session = await getSession(userId)
    if (!session) {
      return NextResponse.json(
        { error: 'No Plaid connection for this user' },
        { status: 401 },
      )
    }

    let { incoming, removed, nextCursor } = await syncPlaidTransactions(
      session.accessToken,
      session.cursor ?? undefined,
    )

    await updateCursor(userId, nextCursor)

    let transactions = await mergeSessionTransactions(userId, incoming, removed)

    // Existing sessions may have a cursor but no cached txs yet — bootstrap once.
    if (transactions.length === 0 && incoming.length === 0 && session.cursor) {
      await updateCursor(userId, null)
      const bootstrap = await syncPlaidTransactions(session.accessToken, undefined)
      await updateCursor(userId, bootstrap.nextCursor)
      transactions = await mergeSessionTransactions(userId, bootstrap.incoming, bootstrap.removed)
    }

    // Prefer cached history if incremental sync returned nothing new.
    if (transactions.length === 0) {
      await refreshTransactionsIfEmpty(session.accessToken, 0)
      const retry = await syncPlaidTransactions(session.accessToken, session.cursor ?? undefined)
      await updateCursor(userId, retry.nextCursor)
      transactions = await mergeSessionTransactions(userId, retry.incoming, retry.removed)
    }

    if (transactions.length === 0) {
      transactions = await getSessionTransactions(userId)
    }

    // Re-apply the merchant heuristic so cached transactions (normalized with
    // an older ruleset) pick up improved categories/signs without needing a
    // Plaid disconnect + reconnect.
    transactions = transactions.map(reCategorizeNormalized)

    return NextResponse.json({ transactions, count: transactions.length })
  } catch (error) {
    console.error('transactions error', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    )
  }
}
