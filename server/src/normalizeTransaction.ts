import type { Transaction as PlaidTransaction } from 'plaid'

export type NormalizedTransaction = {
  id: string
  accountId: string
  date: string
  merchant: string
  category: string
  amount: number
  type: 'debit' | 'credit'
}

export function normalizePlaidTransaction(
  tx: PlaidTransaction,
): NormalizedTransaction {
  const amount = tx.amount
  const isCredit = amount < 0

  return {
    id: tx.transaction_id,
    accountId: tx.account_id,
    date: tx.date,
    merchant: tx.merchant_name ?? tx.name,
    category:
      tx.personal_finance_category?.primary?.replace(/_/g, ' ') ??
      tx.category?.[0] ??
      'Uncategorized',
    amount: isCredit ? Math.abs(amount) : -Math.abs(amount),
    type: isCredit ? 'credit' : 'debit',
  }
}
