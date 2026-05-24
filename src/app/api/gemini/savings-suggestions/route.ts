import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      goal?: string
      merchants?: string[]
      monthlyNeeded?: number
    }

    const goal = body.goal ?? 'your goal'
    const top = body.merchants?.[0] ?? 'dining out'
    const needed = body.monthlyNeeded ?? 250

    const suggestions = [
      `Cutting back on ${top} by ~$40/month could free up cash toward ${goal}.`,
      `You need about $${needed}/month to stay on track — try moving that on payday.`,
      `Round up small purchases to savings once a week for a painless boost.`,
    ]

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
