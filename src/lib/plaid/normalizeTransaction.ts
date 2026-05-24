import type { Transaction as PlaidTransaction } from 'plaid'
import { categorizeMerchant } from './categorizeMerchant'
import { mapToBudgetCategory } from '@/lib/mapBudgetCategory'

export type NormalizedTransaction = {
  id: string
  accountId: string
  date: string
  merchant: string
  category: string
  amount: number
  type: 'debit' | 'credit'
}

/**
 * Convert a raw Plaid transaction to the app's NormalizedTransaction shape.
 *
 * Sign convention in our app:
 *   amount > 0 = money INTO the account (income / refund / transfer in)
 *   amount < 0 = money OUT of the account (spending)
 *
 * For known merchants (Loblaws, Spotify, Payroll, etc.) we trust the
 * merchant-name heuristic from `categorizeMerchant` for BOTH category and
 * sign — this works reliably for Plaid Sandbox custom users where the
 * `personal_finance_category` field is unhelpful. For unknown merchants we
 * fall back to Plaid's PFC + its native sign convention (positive = out).
 */
export function normalizePlaidTransaction(
  tx: PlaidTransaction,
): NormalizedTransaction {
  const merchant = tx.merchant_name ?? tx.name ?? 'Unknown'
  const guess = categorizeMerchant(merchant)
  const absAmount = Math.abs(tx.amount)

  if (guess) {
    return {
      id: tx.transaction_id,
      accountId: tx.account_id,
      date: tx.date,
      merchant,
      category: guess.category,
      amount: guess.isIncome ? absAmount : -absAmount,
      type: guess.isIncome ? 'credit' : 'debit',
    }
  }

  // Fallback: trust Plaid's sign + PFC mapping
  const plaidIsCredit = tx.amount < 0 // Plaid: negative = money in
  const rawPfc =
    tx.personal_finance_category?.primary?.replace(/_/g, ' ') ??
    tx.category?.[0] ??
    ''
  const isIncome = plaidIsCredit || /^income|^transfer in/i.test(rawPfc)
  const category = isIncome
    ? 'Income'
    : (rawPfc ? mapToBudgetCategory(rawPfc) : null) ?? 'Other'

  return {
    id: tx.transaction_id,
    accountId: tx.account_id,
    date: tx.date,
    merchant,
    category,
    amount: isIncome ? absAmount : -absAmount,
    type: isIncome ? 'credit' : 'debit',
  }
}

/**
 * Re-apply the merchant heuristic to an already-normalized transaction.
 * Used to refresh categories/signs on cached Plaid data without needing the
 * user to disconnect + reconnect. No-op when no rule matches the merchant.
 */
export function reCategorizeNormalized(
  tx: NormalizedTransaction,
): NormalizedTransaction {
  const guess = categorizeMerchant(tx.merchant)
  if (!guess) return tx
  const abs = Math.abs(tx.amount)
  const amount = guess.isIncome ? abs : -abs
  const type = guess.isIncome ? 'credit' : 'debit'
  if (tx.category === guess.category && tx.amount === amount && tx.type === type) {
    return tx
  }
  return { ...tx, category: guess.category, amount, type }
}
