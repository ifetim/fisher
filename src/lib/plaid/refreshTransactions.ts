import { getPlaidClient } from '@/lib/plaid/plaidClient'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Custom Sandbox users need a refresh before transaction history is available. */
export async function refreshTransactionsIfEmpty(
  accessToken: string,
  currentCount: number,
): Promise<void> {
  if (currentCount > 0) return

  try {
    await getPlaidClient().transactionsRefresh({ access_token: accessToken })
    // Sandbox usually materializes txs within a few seconds after refresh.
    await sleep(3000)
  } catch (error) {
    console.error('transactionsRefresh failed', error)
  }
}
