import type { Account, SavingsPlan, Transaction, User } from '../types'
import accountsData from './accounts.json'
import savingsPlansData from './savingsPlans.json'
import transactionsData from './transactions.json'
import usersData from './users.json'

export const users = usersData as User[]
export const accounts = accountsData as Account[]
export const transactions = transactionsData as Transaction[]
export const savingsPlans = savingsPlansData as SavingsPlan[]

export function getAccountsForUser(userId: number): Account[] {
  return accounts.filter((a) => a.userId === userId)
}

export function getTransactionsForUser(userId: number): Transaction[] {
  const accountIds = new Set(getAccountsForUser(userId).map((a) => a.id))
  return transactions.filter((t) => accountIds.has(t.accountId))
}

export function getSavingsPlansForUser(userId: number): SavingsPlan[] {
  return savingsPlans.filter((p) => p.userId === userId)
}
