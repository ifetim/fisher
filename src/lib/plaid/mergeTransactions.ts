import type { NormalizedTransaction } from '@/lib/plaid/normalizeTransaction'

/** Merge Plaid sync deltas into an existing list (by transaction id). */
export function mergePlaidTransactions(
  existing: NormalizedTransaction[],
  incoming: NormalizedTransaction[],
  removedIds: string[] = [],
): NormalizedTransaction[] {
  if (incoming.length === 0 && removedIds.length === 0) return existing

  const map = new Map(existing.map((tx) => [tx.id, tx]))
  for (const id of removedIds) map.delete(id)
  for (const tx of incoming) map.set(tx.id, tx)

  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date))
}
