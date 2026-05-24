import type { User, Account, Transaction, SavingsPlan } from '../types'

export const users: User[] = [
  {
    id: 1,
    name: 'Fe Martinez',
    email: 'fe@email.com',
    password: 'password123',
    avatar: 'FM',
  },
]

const accounts: Account[] = [
  { id: 1, userId: 1, name: 'Chequing', bank: 'RBC', balance: 2847.50, type: 'chequing' },
  { id: 2, userId: 1, name: 'Savings',  bank: 'RBC', balance: 5200.00, type: 'savings' },
  { id: 3, userId: 1, name: 'Credit Card', bank: 'TD', balance: -843.20, type: 'credit' },
]

const transactions: Transaction[] = [
  // May 2026
  { id: 1,  accountId: 1, date: '2026-05-20', merchant: 'DoorDash',         category: 'Food & Dining', amount: -38.40,  type: 'debit'  },
  { id: 2,  accountId: 1, date: '2026-05-19', merchant: 'Shell Gas Station', category: 'Transport',     amount: -52.30,  type: 'debit'  },
  { id: 3,  accountId: 1, date: '2026-05-18', merchant: 'Employer Inc',      category: 'Income',        amount: 2100.00, type: 'credit' },
  { id: 4,  accountId: 1, date: '2026-05-17', merchant: 'Loblaws',           category: 'Groceries',     amount: -94.60,  type: 'debit'  },
  { id: 5,  accountId: 1, date: '2026-05-15', merchant: 'Netflix',           category: 'Entertainment', amount: -17.99,  type: 'debit'  },
  { id: 6,  accountId: 1, date: '2026-05-14', merchant: 'Tim Hortons',       category: 'Food & Dining', amount: -6.85,   type: 'debit'  },
  { id: 7,  accountId: 1, date: '2026-05-13', merchant: 'Uber',              category: 'Transport',     amount: -18.40,  type: 'debit'  },
  { id: 8,  accountId: 1, date: '2026-05-12', merchant: 'Amazon',            category: 'Shopping',      amount: -63.99,  type: 'debit'  },
  { id: 9,  accountId: 1, date: '2026-05-11', merchant: 'Spotify',           category: 'Entertainment', amount: -11.99,  type: 'debit'  },
  { id: 10, accountId: 1, date: '2026-05-10', merchant: 'SkipTheDishes',     category: 'Food & Dining', amount: -41.20,  type: 'debit'  },
  { id: 11, accountId: 1, date: '2026-05-09', merchant: 'Transit Pass',      category: 'Transport',     amount: -150.00, type: 'debit'  },
  { id: 12, accountId: 1, date: '2026-05-08', merchant: 'Shoppers Drug Mart',category: 'Health',        amount: -32.10,  type: 'debit'  },
  { id: 13, accountId: 2, date: '2026-05-07', merchant: 'Transfer In',       category: 'Income',        amount: 250.00,  type: 'credit' },
  { id: 14, accountId: 1, date: '2026-05-06', merchant: 'H&M',               category: 'Shopping',      amount: -79.95,  type: 'debit'  },
  { id: 15, accountId: 1, date: '2026-05-05', merchant: 'Starbucks',         category: 'Food & Dining', amount: -9.45,   type: 'debit'  },
  { id: 16, accountId: 1, date: '2026-05-04', merchant: 'Rogers Wireless',   category: 'Bills',         amount: -85.00,  type: 'debit'  },
  { id: 17, accountId: 3, date: '2026-05-03', merchant: 'Zara',              category: 'Shopping',      amount: -112.00, type: 'debit'  },
  { id: 18, accountId: 1, date: '2026-05-02', merchant: 'Petro-Canada',      category: 'Transport',     amount: -61.70,  type: 'debit'  },
  { id: 19, accountId: 1, date: '2026-05-01', merchant: 'Employer Inc',      category: 'Income',        amount: 2100.00, type: 'credit' },

  // April 2026
  { id: 20, accountId: 1, date: '2026-04-29', merchant: 'DoorDash',          category: 'Food & Dining', amount: -27.80,  type: 'debit'  },
  { id: 21, accountId: 1, date: '2026-04-27', merchant: 'Costco',            category: 'Groceries',     amount: -183.40, type: 'debit'  },
  { id: 22, accountId: 1, date: '2026-04-25', merchant: 'LCBO',              category: 'Shopping',      amount: -44.90,  type: 'debit'  },
  { id: 23, accountId: 1, date: '2026-04-23', merchant: 'Shell Gas Station', category: 'Transport',     amount: -50.10,  type: 'debit'  },
  { id: 24, accountId: 1, date: '2026-04-21', merchant: 'Employer Inc',      category: 'Income',        amount: 2100.00, type: 'credit' },
  { id: 25, accountId: 1, date: '2026-04-20', merchant: 'SkipTheDishes',     category: 'Food & Dining', amount: -33.60,  type: 'debit'  },
  { id: 26, accountId: 1, date: '2026-04-18', merchant: 'Netflix',           category: 'Entertainment', amount: -17.99,  type: 'debit'  },
  { id: 27, accountId: 1, date: '2026-04-17', merchant: 'Uber',              category: 'Transport',     amount: -22.30,  type: 'debit'  },
  { id: 28, accountId: 3, date: '2026-04-16', merchant: 'Amazon',            category: 'Shopping',      amount: -89.99,  type: 'debit'  },
  { id: 29, accountId: 1, date: '2026-04-15', merchant: 'Tim Hortons',       category: 'Food & Dining', amount: -7.20,   type: 'debit'  },
  { id: 30, accountId: 1, date: '2026-04-14', merchant: 'Shoppers Drug Mart',category: 'Health',        amount: -21.50,  type: 'debit'  },
  { id: 31, accountId: 1, date: '2026-04-12', merchant: 'Spotify',           category: 'Entertainment', amount: -11.99,  type: 'debit'  },
  { id: 32, accountId: 2, date: '2026-04-10', merchant: 'Transfer In',       category: 'Income',        amount: 250.00,  type: 'credit' },
  { id: 33, accountId: 1, date: '2026-04-09', merchant: 'Loblaws',           category: 'Groceries',     amount: -101.20, type: 'debit'  },
  { id: 34, accountId: 1, date: '2026-04-08', merchant: 'Rogers Wireless',   category: 'Bills',         amount: -85.00,  type: 'debit'  },
  { id: 35, accountId: 1, date: '2026-04-07', merchant: 'Transit Pass',      category: 'Transport',     amount: -150.00, type: 'debit'  },
  { id: 36, accountId: 1, date: '2026-04-05', merchant: 'Starbucks',         category: 'Food & Dining', amount: -8.75,   type: 'debit'  },
  { id: 37, accountId: 3, date: '2026-04-04', merchant: 'Indigo',            category: 'Shopping',      amount: -36.99,  type: 'debit'  },
  { id: 38, accountId: 1, date: '2026-04-03', merchant: 'Petro-Canada',      category: 'Transport',     amount: -58.40,  type: 'debit'  },
  { id: 39, accountId: 1, date: '2026-04-01', merchant: 'Employer Inc',      category: 'Income',        amount: 2100.00, type: 'credit' },

  // March 2026
  { id: 40, accountId: 1, date: '2026-03-29', merchant: 'DoorDash',          category: 'Food & Dining', amount: -22.50,  type: 'debit'  },
  { id: 41, accountId: 1, date: '2026-03-27', merchant: 'Loblaws',           category: 'Groceries',     amount: -87.30,  type: 'debit'  },
  { id: 42, accountId: 1, date: '2026-03-25', merchant: 'Shell Gas Station', category: 'Transport',     amount: -47.90,  type: 'debit'  },
  { id: 43, accountId: 1, date: '2026-03-23', merchant: 'Amazon',            category: 'Shopping',      amount: -54.99,  type: 'debit'  },
  { id: 44, accountId: 1, date: '2026-03-21', merchant: 'Employer Inc',      category: 'Income',        amount: 2100.00, type: 'credit' },
  { id: 45, accountId: 1, date: '2026-03-20', merchant: 'Netflix',           category: 'Entertainment', amount: -17.99,  type: 'debit'  },
  { id: 46, accountId: 1, date: '2026-03-18', merchant: 'Tim Hortons',       category: 'Food & Dining', amount: -5.95,   type: 'debit'  },
  { id: 47, accountId: 1, date: '2026-03-17', merchant: 'Uber',              category: 'Transport',     amount: -19.80,  type: 'debit'  },
  { id: 48, accountId: 1, date: '2026-03-15', merchant: 'Spotify',           category: 'Entertainment', amount: -11.99,  type: 'debit'  },
  { id: 49, accountId: 2, date: '2026-03-10', merchant: 'Transfer In',       category: 'Income',        amount: 250.00,  type: 'credit' },
  { id: 50, accountId: 1, date: '2026-03-09', merchant: 'Rogers Wireless',   category: 'Bills',         amount: -85.00,  type: 'debit'  },
  { id: 51, accountId: 1, date: '2026-03-08', merchant: 'Transit Pass',      category: 'Transport',     amount: -150.00, type: 'debit'  },
  { id: 52, accountId: 3, date: '2026-03-07', merchant: 'H&M',               category: 'Shopping',      amount: -67.00,  type: 'debit'  },
  { id: 53, accountId: 1, date: '2026-03-06', merchant: 'Shoppers Drug Mart',category: 'Health',        amount: -28.40,  type: 'debit'  },
  { id: 54, accountId: 1, date: '2026-03-05', merchant: 'Starbucks',         category: 'Food & Dining', amount: -7.60,   type: 'debit'  },
  { id: 55, accountId: 1, date: '2026-03-03', merchant: 'Petro-Canada',      category: 'Transport',     amount: -53.20,  type: 'debit'  },
  { id: 56, accountId: 1, date: '2026-03-01', merchant: 'Employer Inc',      category: 'Income',        amount: 2100.00, type: 'credit' },
]

const savingsPlans: SavingsPlan[] = [
  {
    id: 1,
    userId: 1,
    goal: 'Italy Trip',
    targetAmount: 3000,
    savedAmount: 850,
    deadline: '2026-12-01',
    monthlyContribution: 250,
  },
  {
    id: 2,
    userId: 1,
    goal: 'Emergency Fund',
    targetAmount: 5000,
    savedAmount: 2200,
    deadline: '2027-06-01',
    monthlyContribution: 200,
  },
]

export function getAccountsForUser(userId: number): Account[] {
  return accounts.filter((a) => a.userId === userId)
}

export function getTransactionsForUser(userId: number): Transaction[] {
  const userAccountIds = new Set(
    accounts.filter((a) => a.userId === userId).map((a) => a.id),
  )
  return transactions.filter((t) => userAccountIds.has(t.accountId))
}

export function getSavingsPlansForUser(userId: number): SavingsPlan[] {
  return savingsPlans.filter((p) => p.userId === userId)
}
