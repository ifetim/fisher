import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid'

const clientId = process.env.PLAID_CLIENT_ID
const secret = process.env.PLAID_SECRET
const env = process.env.PLAID_ENV ?? 'sandbox'

if (!clientId || !secret) {
  throw new Error('Missing PLAID_CLIENT_ID or PLAID_SECRET in server/.env')
}

const basePath =
  env === 'production'
    ? PlaidEnvironments.production
    : env === 'development'
      ? PlaidEnvironments.development
      : PlaidEnvironments.sandbox

export const plaidClient = new PlaidApi(
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

export const plaidProducts = [Products.Transactions]
export const plaidCountryCodes = [CountryCode.Ca, CountryCode.Us]
