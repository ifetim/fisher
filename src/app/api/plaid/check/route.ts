import { NextResponse } from 'next/server'
import {
  getPlaidClient,
  plaidCountryCodes,
  plaidProducts,
} from '@/lib/plaid/plaidClient'
import { plaidErrorMessage, validatePlaidClientId } from '@/lib/plaid/validateEnv'

export async function GET() {
  const clientId = process.env.PLAID_CLIENT_ID ?? ''
  const format = validatePlaidClientId(clientId)
  if (!format.ok) {
    return NextResponse.json({ credentialsOk: false, issue: format.message })
  }

  try {
    await getPlaidClient().linkTokenCreate({
      user: { client_user_id: 'config-check' },
      client_name: 'ClearMint',
      products: plaidProducts,
      country_codes: plaidCountryCodes,
      language: 'en',
    })
    return NextResponse.json({ credentialsOk: true })
  } catch (error: unknown) {
    return NextResponse.json({
      credentialsOk: false,
      issue: plaidErrorMessage(error, 'Plaid rejected your sandbox keys'),
    })
  }
}
