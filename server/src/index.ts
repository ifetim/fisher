import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { normalizePlaidTransaction } from './normalizeTransaction.js'
import {
  plaidClient,
  plaidCountryCodes,
  plaidProducts,
} from './plaidClient.js'
import {
  getSession,
  hasSession,
  saveSession,
  updateCursor,
} from './sessionStore.js'

const app = express()
const port = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/plaid/link-token', async (req, res) => {
  try {
    const userId = String(req.body?.userId ?? 'demo-user')
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'ClearMint',
      products: plaidProducts,
      country_codes: plaidCountryCodes,
      language: 'en',
    })
    res.json({ linkToken: response.data.link_token })
  } catch (error: unknown) {
    const plaidMessage =
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'error_message' in error.response.data
        ? String(error.response.data.error_message)
        : null
    console.error('link-token error', error)
    res.status(500).json({
      error: plaidMessage ?? 'Failed to create link token',
    })
  }
})

app.post('/api/plaid/exchange-token', async (req, res) => {
  try {
    const userId = String(req.body?.userId ?? '')
    const publicToken = String(req.body?.publicToken ?? '')

    if (!userId || !publicToken) {
      res.status(400).json({ error: 'userId and publicToken are required' })
      return
    }

    const exchange = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })

    saveSession(userId, exchange.data.access_token, exchange.data.item_id)

    res.json({ connected: true, itemId: exchange.data.item_id })
  } catch (error) {
    console.error('exchange-token error', error)
    res.status(500).json({ error: 'Failed to exchange public token' })
  }
})

app.get('/api/plaid/status', (req, res) => {
  const userId = String(req.query.userId ?? '')
  if (!userId) {
    res.status(400).json({ error: 'userId is required' })
    return
  }
  res.json({ connected: hasSession(userId) })
})

app.get('/api/plaid/transactions', async (req, res) => {
  try {
    const userId = String(req.query.userId ?? '')
    if (!userId) {
      res.status(400).json({ error: 'userId is required' })
      return
    }

    const session = getSession(userId)
    if (!session) {
      res.status(401).json({ error: 'No Plaid connection for this user' })
      return
    }

    const collected = []
    let cursor = session.cursor ?? undefined
    let hasMore = true

    while (hasMore) {
      const response = await plaidClient.transactionsSync({
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

    res.json({ transactions, count: transactions.length })
  } catch (error) {
    console.error('transactions error', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

app.listen(port, () => {
  console.log(`ClearMint Plaid server listening on http://localhost:${port}`)
})
