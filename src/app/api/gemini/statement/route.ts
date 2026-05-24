import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

type ParsedTx = {
  accountId: number
  date: string
  merchant: string
  category: string
  amount: number
  type: 'debit' | 'credit'
}

const STUB_TRANSACTIONS: ParsedTx[] = [
  {
    accountId: 1,
    date: new Date().toISOString().slice(0, 10),
    merchant: 'Statement Import Cafe',
    category: 'Food & Dining',
    amount: -24.5,
    type: 'debit',
  },
  {
    accountId: 1,
    date: new Date().toISOString().slice(0, 10),
    merchant: 'Statement Import Transit',
    category: 'Transport',
    amount: -18.0,
    type: 'debit',
  },
]

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      })

      const bytes = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')
      const mimeType = (file.type || 'application/pdf') as string

      const prompt = `You are a bank statement parser. Extract every transaction from this statement.
Return a JSON object with this exact shape:
{
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "merchant": "merchant name",
      "category": "one of: Food & Dining, Transport, Shopping, Entertainment, Health, Utilities, Travel, Income, Transfer, Other",
      "amount": -12.34,
      "type": "debit or credit"
    }
  ],
  "message": "Parsed N transactions from your statement."
}
Rules:
- amount is negative for debits (money out), positive for credits (money in)
- type is "debit" if amount < 0, "credit" if amount >= 0
- If no transactions are found, return an empty array and a message explaining why
- Do not include account numbers or sensitive data in merchant names`

      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType, data: base64 } },
      ])

      const raw = result.response.text()
      const parsed = JSON.parse(raw) as { transactions: Omit<ParsedTx, 'accountId'>[]; message: string }

      const transactions: ParsedTx[] = parsed.transactions.map((tx) => ({
        ...tx,
        accountId: 1,
      }))

      return NextResponse.json({ transactions, message: parsed.message })
    }

    await new Promise((r) => setTimeout(r, 800))

    return NextResponse.json({
      transactions: STUB_TRANSACTIONS,
      message: 'Parsed 2 transactions from your statement (demo mode).',
    })
  } catch {
    return NextResponse.json({ error: 'Failed to parse statement' }, { status: 500 })
  }
}
