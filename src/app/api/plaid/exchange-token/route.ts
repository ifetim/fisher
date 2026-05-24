import { NextResponse } from 'next/server'
import { getPlaidClient } from '@/lib/plaid/plaidClient'
import { refreshTransactionsIfEmpty } from '@/lib/plaid/refreshTransactions'
import { saveSession } from '@/lib/plaid/sessionStore'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: string
      publicToken?: string
    }
    const userId = String(body?.userId ?? '')
    const publicToken = String(body?.publicToken ?? '')

    if (!userId || !publicToken) {
      return NextResponse.json(
        { error: 'userId and publicToken are required' },
        { status: 400 },
      )
    }

    const exchange = await getPlaidClient().itemPublicTokenExchange({
      public_token: publicToken,
    })

    await saveSession(userId, exchange.data.access_token, exchange.data.item_id)

    // Custom sandbox users often return 0 txs until refresh runs.
    await refreshTransactionsIfEmpty(exchange.data.access_token, 0)

    return NextResponse.json({
      connected: true,
      itemId: exchange.data.item_id,
    })
  } catch (error) {
    console.error('exchange-token error', error)
    return NextResponse.json(
      { error: 'Failed to exchange public token' },
      { status: 500 },
    )
  }
}
