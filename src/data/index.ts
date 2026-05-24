import type { User, Account, Transaction, SavingsPlan } from '../types'

export const users: User[] = [
  {
    id: 1,
    name: 'Fe Martinez',
    email: 'fe@email.com',
    password: 'password123',
    avatar: 'FM',
  },
  {
    id: 2,
    name: 'Alex Chen',
    email: 'alex@email.com',
    password: 'password123',
    avatar: 'AC',
  },
  {
    id: 3,
    name: 'Jordan Smith',
    email: 'jordan@email.com',
    password: 'password123',
    avatar: 'JS',
  },
]

const accounts: Account[] = [
  // Fe Martinez — steady mid-income professional
  { id: 1, userId: 1, name: 'Chequing',    bank: 'RBC', balance: 2847.50,  type: 'chequing' },
  { id: 2, userId: 1, name: 'Savings',     bank: 'RBC', balance: 5200.00,  type: 'savings'  },
  { id: 3, userId: 1, name: 'Credit Card', bank: 'TD',  balance: -843.20,  type: 'credit'   },

  // Alex Chen — student, tight budget
  { id: 4, userId: 2, name: 'Chequing',    bank: 'TD',  balance: 342.80,   type: 'chequing' },
  { id: 5, userId: 2, name: 'Line of Credit', bank: 'TD', balance: -4200.00, type: 'credit' },

  // Jordan Smith — high earner, heavy spender
  { id: 6, userId: 3, name: 'Chequing',    bank: 'RBC', balance: 8240.00,  type: 'chequing' },
  { id: 7, userId: 3, name: 'Savings',     bank: 'BMO', balance: 34500.00, type: 'savings'  },
  { id: 8, userId: 3, name: 'Amex Gold',   bank: 'Amex',balance: -2180.50, type: 'credit'   },
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

// Alex Chen — student transactions (sparse, tight budget)
const alexTransactions: Transaction[] = [
  { id: 200, accountId: 4, date: '2026-05-20', merchant: 'Uber Eats',       category: 'Food & Dining', amount: -31.50,  type: 'debit'  },
  { id: 201, accountId: 4, date: '2026-05-18', merchant: 'Part-time Job',   category: 'Income',        amount: 620.00,  type: 'credit' },
  { id: 202, accountId: 4, date: '2026-05-17', merchant: 'Loblaws',         category: 'Groceries',     amount: -48.30,  type: 'debit'  },
  { id: 203, accountId: 4, date: '2026-05-15', merchant: 'Netflix',         category: 'Entertainment', amount: -17.99,  type: 'debit'  },
  { id: 204, accountId: 4, date: '2026-05-14', merchant: 'TTC Transit',     category: 'Transport',     amount: -143.00, type: 'debit'  },
  { id: 205, accountId: 4, date: '2026-05-12', merchant: 'Tim Hortons',     category: 'Food & Dining', amount: -5.25,   type: 'debit'  },
  { id: 206, accountId: 4, date: '2026-05-10', merchant: 'DoorDash',        category: 'Food & Dining', amount: -28.40,  type: 'debit'  },
  { id: 207, accountId: 4, date: '2026-05-08', merchant: 'Campus Bookstore',category: 'Shopping',      amount: -74.00,  type: 'debit'  },
  { id: 208, accountId: 4, date: '2026-05-01', merchant: 'Part-time Job',   category: 'Income',        amount: 580.00,  type: 'credit' },
  { id: 209, accountId: 4, date: '2026-04-20', merchant: 'Uber Eats',       category: 'Food & Dining', amount: -22.80,  type: 'debit'  },
  { id: 210, accountId: 4, date: '2026-04-15', merchant: 'Part-time Job',   category: 'Income',        amount: 600.00,  type: 'credit' },
  { id: 211, accountId: 4, date: '2026-04-10', merchant: 'Loblaws',         category: 'Groceries',     amount: -39.90,  type: 'debit'  },
  { id: 212, accountId: 4, date: '2026-04-07', merchant: 'Spotify',         category: 'Entertainment', amount: -11.99,  type: 'debit'  },
]

// Jordan Smith — high earner, heavy spender
const jordanTransactions: Transaction[] = [
  { id: 300, accountId: 6, date: '2026-05-20', merchant: 'Nobu Restaurant', category: 'Food & Dining', amount: -310.00, type: 'debit'  },
  { id: 301, accountId: 6, date: '2026-05-19', merchant: 'Salary Deposit',  category: 'Income',        amount: 8500.00, type: 'credit' },
  { id: 302, accountId: 8, date: '2026-05-18', merchant: 'Aritzia',         category: 'Shopping',      amount: -430.00, type: 'debit'  },
  { id: 303, accountId: 6, date: '2026-05-17', merchant: 'WestJet',         category: 'Transport',     amount: -890.00, type: 'debit'  },
  { id: 304, accountId: 8, date: '2026-05-15', merchant: 'Apple Store',     category: 'Shopping',      amount: -1249.00,type: 'debit'  },
  { id: 305, accountId: 6, date: '2026-05-14', merchant: 'Whole Foods',     category: 'Groceries',     amount: -184.60, type: 'debit'  },
  { id: 306, accountId: 8, date: '2026-05-12', merchant: 'Marriott Hotels', category: 'Transport',     amount: -640.00, type: 'debit'  },
  { id: 307, accountId: 6, date: '2026-05-11', merchant: 'Equinox Gym',     category: 'Health',        amount: -220.00, type: 'debit'  },
  { id: 308, accountId: 6, date: '2026-05-10', merchant: 'Uber Eats',       category: 'Food & Dining', amount: -68.40,  type: 'debit'  },
  { id: 309, accountId: 6, date: '2026-05-08', merchant: 'Rogers Wireless', category: 'Bills',         amount: -190.00, type: 'debit'  },
  { id: 310, accountId: 7, date: '2026-05-07', merchant: 'Transfer In',     category: 'Income',        amount: 1500.00, type: 'credit' },
  { id: 311, accountId: 6, date: '2026-05-05', merchant: 'Alo Yoga',        category: 'Shopping',      amount: -275.00, type: 'debit'  },
  { id: 312, accountId: 6, date: '2026-05-01', merchant: 'Salary Deposit',  category: 'Income',        amount: 8500.00, type: 'credit' },
  { id: 313, accountId: 8, date: '2026-04-28', merchant: 'Nordstrom',       category: 'Shopping',      amount: -560.00, type: 'debit'  },
  { id: 314, accountId: 6, date: '2026-04-21', merchant: 'Salary Deposit',  category: 'Income',        amount: 8500.00, type: 'credit' },
  { id: 315, accountId: 8, date: '2026-04-18', merchant: 'Air Canada',      category: 'Transport',     amount: -1240.00,type: 'debit'  },
  { id: 316, accountId: 6, date: '2026-04-15', merchant: 'Nobu Restaurant', category: 'Food & Dining', amount: -290.00, type: 'debit'  },
  { id: 317, accountId: 6, date: '2026-04-10', merchant: 'Whole Foods',     category: 'Groceries',     amount: -210.40, type: 'debit'  },
  { id: 318, accountId: 6, date: '2026-04-01', merchant: 'Salary Deposit',  category: 'Income',        amount: 8500.00, type: 'credit' },
]

const savingsPlans: SavingsPlan[] = [
  // Fe Martinez
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
  // Alex Chen
  {
    id: 3,
    userId: 2,
    goal: 'First Car',
    targetAmount: 8000,
    savedAmount: 420,
    deadline: '2027-09-01',
    monthlyContribution: 100,
  },
  // Jordan Smith
  {
    id: 4,
    userId: 3,
    goal: 'Beach House',
    targetAmount: 120000,
    savedAmount: 34500,
    deadline: '2028-06-01',
    monthlyContribution: 3000,
  },
  {
    id: 5,
    userId: 3,
    goal: 'Tesla Model S',
    targetAmount: 95000,
    savedAmount: 18000,
    deadline: '2027-03-01',
    monthlyContribution: 2500,
  },
]

const allTransactions = [...transactions, ...alexTransactions, ...jordanTransactions]

export function getAccountsForUser(userId: number): Account[] {
  return accounts.filter((a) => a.userId === userId)
}

export function getTransactionsForUser(userId: number): Transaction[] {
  const userAccountIds = new Set(
    accounts.filter((a) => a.userId === userId).map((a) => a.id),
  )
  return allTransactions.filter((t) => userAccountIds.has(t.accountId))
}

export function getSavingsPlansForUser(userId: number): SavingsPlan[] {
  return savingsPlans.filter((p) => p.userId === userId)
}

/** All users available for demo switching */
export const demoProfiles = users.map((u) => ({
  id: u.id,
  name: u.name,
  avatar: u.avatar,
  tag: u.id === 1 ? 'Mid-income' : u.id === 2 ? 'Student' : 'High earner',
}))
