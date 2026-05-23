import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      score?: number
      factors?: { label: string; detail: string }[]
    }

    const score = body.score ?? 50

    const cards = [
      {
        title: 'Food spending',
        body:
          score >= 60
            ? 'Your food share looks reasonable. Keep meal planning light — one grocery list per week is enough.'
            : 'Food may be taking a larger slice of your budget. Try capping delivery to twice a week.',
      },
      {
        title: 'Emergency fund',
        body:
          'Aim for 1–3 months of essential expenses in savings. Even $25/week builds the habit.',
      },
      {
        title: 'Credit payoff',
        body:
          'Pay more than the minimum on your highest-rate balance first — that saves the most interest.',
      },
      {
        title: 'Your health score',
        body: `Your score of ${score} comes from your real spending patterns — not a guess. Focus on one factor at a time.`,
      },
    ]

    return NextResponse.json({ cards })
  } catch {
    return NextResponse.json({ error: 'Failed to generate advice' }, { status: 500 })
  }
}
