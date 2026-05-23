export type User = {
  id: number
  name: string
  email: string
  password: string
  avatar: string
}

export type Account = {
  id: number
  userId: number
  name: string
  bank: string
  balance: number
  type: 'chequing' | 'savings' | 'credit'
}

export type Transaction = {
  id: number
  accountId: number
  date: string
  merchant: string
  category: string
  amount: number
  type: 'debit' | 'credit'
}

export type SavingsPlan = {
  id: number
  userId: number
  goal: string
  targetAmount: number
  savedAmount: number
  deadline: string
  monthlyContribution: number
}
