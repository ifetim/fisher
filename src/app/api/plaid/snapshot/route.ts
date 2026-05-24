import { NextResponse } from 'next/server'
import { CountryCode } from 'plaid'
import { getPlaidClient } from '@/lib/plaid/plaidClient'
import { getSession } from '@/lib/plaid/sessionStore'

/**
 * Returns everything Plaid knows about the user in one shot:
 *   - accounts (with live balances, mask, type/subtype)
 *   - institution (bank name, primary color, website, logo)
 *   - identity (account holder names, emails, phone numbers, addresses)
 *
 * Each section is fetched independently — if Identity fails (e.g. unsupported
 * institution), the other sections still come back.
 */
export async function GET(request: Request) {
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

  const client = getPlaidClient()
  const accessToken = session.accessToken

  const [accountsRes, identityRes, itemRes] = await Promise.allSettled([
    client.accountsBalanceGet({ access_token: accessToken }),
    client.identityGet({ access_token: accessToken }),
    client.itemGet({ access_token: accessToken }),
  ])

  // Accounts + balances
  const accounts =
    accountsRes.status === 'fulfilled'
      ? accountsRes.value.data.accounts.map((a) => ({
          id: a.account_id,
          name: a.name,
          officialName: a.official_name ?? null,
          mask: a.mask ?? null,
          type: a.type,
          subtype: a.subtype ?? null,
          balance: {
            available: a.balances.available,
            current: a.balances.current,
            limit: a.balances.limit,
            currency: a.balances.iso_currency_code ?? 'USD',
          },
        }))
      : []

  // Identity (account holders) — keyed by accountId
  const identity =
    identityRes.status === 'fulfilled'
      ? identityRes.value.data.accounts.flatMap((a) =>
          a.owners.map((o) => ({
            accountId: a.account_id,
            names: o.names ?? [],
            emails: (o.emails ?? []).map((e) => e.data),
            phones: (o.phone_numbers ?? []).map((p) => p.data),
            addresses: (o.addresses ?? []).map((addr) => ({
              street: addr.data.street ?? '',
              city: addr.data.city ?? '',
              region: addr.data.region ?? '',
              postalCode: addr.data.postal_code ?? '',
              country: addr.data.country ?? '',
            })),
          })),
        )
      : []

  // Institution lookup needs the institution_id from the Item
  let institution: {
    id: string
    name: string
    primaryColor: string | null
    url: string | null
    logo: string | null
  } | null = null

  if (itemRes.status === 'fulfilled' && itemRes.value.data.item.institution_id) {
    try {
      const instRes = await client.institutionsGetById({
        institution_id: itemRes.value.data.item.institution_id,
        country_codes: [CountryCode.Us, CountryCode.Ca],
        options: { include_optional_metadata: true },
      })
      const inst = instRes.data.institution
      institution = {
        id: inst.institution_id,
        name: inst.name,
        primaryColor: inst.primary_color ?? null,
        url: inst.url ?? null,
        logo: inst.logo ? `data:image/png;base64,${inst.logo}` : null,
      }
    } catch {
      institution = null
    }
  }

  return NextResponse.json({
    accounts,
    identity,
    institution,
    itemId: itemRes.status === 'fulfilled' ? itemRes.value.data.item.item_id : null,
  })
}
