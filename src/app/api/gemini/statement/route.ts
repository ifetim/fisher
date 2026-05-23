import { NextResponse } from 'next/server'

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
      // Placeholder for live Gemini — same response shape for UI
      // Team can swap in @google/generative-ai when key is ready
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
