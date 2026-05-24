import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid'

let plaidClient: PlaidApi | null = null

export function getPlaidClient(): PlaidApi {
  if (plaidClient) return plaidClient

  const clientId = process.env.PLAID_CLIENT_ID
  const secret = process.env.PLAID_SECRET
  const env = process.env.PLAID_ENV ?? 'sandbox'

  if (!clientId || !secret) {
    throw new Error('Missing PLAID_CLIENT_ID or PLAID_SECRET in .env.local')
  }

  const basePath =
    env === 'production'
      ? PlaidEnvironments.production
      : env === 'development'
        ? PlaidEnvironments.development
        : PlaidEnvironments.sandbox

  plaidClient = new PlaidApi(
    new Configuration({
      basePath,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    }),
  )

  return plaidClient
}

// Products requested at Link time. All are enabled by default in Plaid Sandbox.
// Identity gives us account holder name/email/phone; Transactions covers
// accounts/balances/transactions. Add Liabilities/Investments later if needed.
export const plaidProducts = [Products.Transactions, Products.Identity]
export const plaidCountryCodes = [CountryCode.Ca, CountryCode.Us]
