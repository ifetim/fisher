import { NextResponse } from 'next/server'
import { completeJson, hasOpenAIKey } from '@/lib/openai/client'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      goal?: string
      merchants?: string[]
      monthlyNeeded?: number
    }

    const goal = body.goal ?? 'your goal'
    const merchants = body.merchants ?? []
    const monthlyNeeded = body.monthlyNeeded ?? 250

    if (hasOpenAIKey()) {
      const merchantList = merchants.length
        ? merchants.slice(0, 5).join(', ')
        : 'various merchants'

      const prompt = `You are a practical savings coach. A user is saving toward "${goal}" and needs $${monthlyNeeded}/month to stay on track.

Their top spending merchants are: ${merchantList}.

Return a JSON object with this exact shape:
{
  "suggestions": [
    "suggestion one",
    "suggestion two",
    "suggestion three"
  ]
}

Rules:
- Exactly 3 suggestions
- Each is 1 sentence, specific to their actual merchants and goal
- Mention actual merchant names or categories from the list
- Include a dollar figure in at least 2 of the 3 suggestions
- No generic advice — tie each tip directly to their data
- Tone: practical, not preachy`

      const parsed = await completeJson<{ suggestions: string[] }>(prompt, { maxTokens: 280 })

      if (parsed?.suggestions?.length) {
        return NextResponse.json({ suggestions: parsed.suggestions })
      }
    }

    const top = merchants[0] ?? 'dining out'
    const suggestions = [
      `Cutting back on ${top} by ~$40/month could free up cash toward ${goal}.`,
      `You need about $${monthlyNeeded}/month to stay on track — try moving that on payday.`,
      `Round up small purchases to savings once a week for a painless boost.`,
    ]

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
