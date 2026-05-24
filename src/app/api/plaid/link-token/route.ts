import { NextResponse } from 'next/server'
import {
  getPlaidClient,
  plaidCountryCodes,
  plaidProducts,
} from '@/lib/plaid/plaidClient'
import { plaidErrorMessage, validatePlaidClientId } from '@/lib/plaid/validateEnv'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { userId?: string }
    const userId = String(body?.userId ?? 'demo-user')
    const format = validatePlaidClientId(process.env.PLAID_CLIENT_ID ?? '')
    if (!format.ok) {
      return NextResponse.json({ error: format.message }, { status: 500 })
    }

    const response = await getPlaidClient().linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Student Saver',
      products: plaidProducts,
      country_codes: plaidCountryCodes,
      language: 'en',
      // Request up to 2 years of history on first link (Sandbox default is ~90 days).
      transactions: { days_requested: 730 },
    })

    return NextResponse.json({ linkToken: response.data.link_token })
  } catch (error: unknown) {
    console.error('link-token error', error)
    return NextResponse.json(
      { error: plaidErrorMessage(error, 'Failed to create link token') },
      { status: 500 },
    )
  }
}
