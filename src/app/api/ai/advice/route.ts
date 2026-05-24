import { NextResponse } from 'next/server'
import { completeJson, hasOpenAIKey } from '@/lib/openai/client'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      score?: number
      factors?: { label: string; detail: string }[]
    }

    const score = body.score ?? 50
    const factors = body.factors ?? []

    if (hasOpenAIKey()) {
      const factorLines = factors.length
        ? factors.map((f) => `- ${f.label}: ${f.detail}`).join('\n')
        : '(no specific factors provided)'

      const prompt = `You are a friendly personal finance advisor. A user has a spending health score of ${score}/100.

Their key financial factors are:
${factorLines}

Return a JSON object with this exact shape:
{
  "cards": [
    { "title": "short title (3-5 words)", "body": "2-3 sentence actionable tip" }
  ]
}

Rules:
- Return exactly 4 cards
- Be specific to their factors, not generic
- Tone: warm, direct, non-judgmental
- Each tip should be immediately actionable
- Reference actual numbers or categories from their factors where relevant
- Last card must always summarize their score with what it means and one priority action`

      const parsed = await completeJson<{ cards: { title: string; body: string }[] }>(prompt, {
        maxTokens: 550,
      })

      if (parsed?.cards?.length) {
        return NextResponse.json({ cards: parsed.cards })
      }
    }

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
        body: 'Aim for 1–3 months of essential expenses in savings. Even $25/week builds the habit.',
      },
      {
        title: 'Credit payoff',
        body: 'Pay more than the minimum on your highest-rate balance first — that saves the most interest.',
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
