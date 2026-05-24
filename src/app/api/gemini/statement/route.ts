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

    // Optional: frontend can append location via formData.append('location', '...')
    const location = formData.get('location')?.toString() ?? null

    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: 'application/json' },
      })

      const bytes = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')
      const mimeType = (file.type || 'application/pdf') as string

      const locationLine = location
        ? `The user is located in: ${location}.`
        : 'You do not have the user\'s exact location — suggest well-known cheaper alternatives by name anyway.'

      const prompt = `Analyze this bank statement and do the following:
1. Extract every transaction into a structured list.
2. Categorize all transactions and calculate total spending per category.
3. Identify the single category the user spends the most money on.
4. Suggest specific cheaper alternatives to help the user save money in that category.

${locationLine}

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
  "topCategory": "category name",
  "topCategoryTotal": 123.45,
  "message": "summary of findings and suggestions"
}

Rules for transactions:
- amount is negative for debits (money out), positive for credits (money in)
- type is "debit" if amount < 0, "credit" if amount >= 0

Rules for message:
- Start with: "Your highest spending category is [category] at $[total]."
- Then list 3–5 specific, named cheaper alternatives (real business names or well-known options) to replace what they're currently spending on
- If location is known, tailor suggestions to that area
- Keep it concise — 3–6 sentences total`

      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType, data: base64 } },
      ])

      const raw = result.response.text().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
      const parsed = JSON.parse(raw) as {
        transactions: Omit<ParsedTx, 'accountId'>[]
        topCategory: string
        topCategoryTotal: number
        message: string
      }

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
  } catch (err) {
    console.error('[statement route]', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Failed to parse statement: ${message}` }, { status: 500 })
  }
}
