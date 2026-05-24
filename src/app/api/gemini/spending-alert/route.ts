import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      category?: string
      pctChange?: number
      current?: number
      previous?: number
    }

    const category = body.category ?? 'Food & Dining'
    const pct = body.pctChange ?? 0
    const current = body.current
    const previous = body.previous

    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      })

      const amountContext =
        current !== undefined && previous !== undefined
          ? `They spent $${previous.toFixed(2)} last month and $${current.toFixed(2)} this month.`
          : ''

      const direction = pct > 0 ? `up ${pct}%` : pct < 0 ? `down ${Math.abs(pct)}%` : 'unchanged'

      const prompt = `You are a concise personal finance coach. A user's spending in "${category}" is ${direction} vs last month. ${amountContext}

Return a JSON object with this exact shape:
{ "message": "your alert message here" }

Rules:
- 1-2 sentences max
- If spending increased: acknowledge it without shame, give one specific actionable tip
- If spending decreased: give genuine brief praise and one way to keep the momentum
- If unchanged: neutral observation, one small optimization
- Use the actual dollar amounts if provided
- Do not start with "I" or "Great news"
- Tone: direct, friendly coach`

      const result = await model.generateContent(prompt)
      const raw = result.response.text()
      const parsed = JSON.parse(raw) as { message: string }

      return NextResponse.json({ category, pctChange: pct, message: parsed.message })
    }

    let message: string
    if (pct > 10) {
      message = `You spent about ${pct}% more on ${category} this month than last month. Try one home-cooked meal swap this week — small steps add up.`
    } else if (pct < -10) {
      message = `Nice — ${category} spending is down ${Math.abs(pct)}% vs last month. Keep the momentum going.`
    } else {
      message = `${category} spending is steady compared to last month. You're on track.`
    }

    return NextResponse.json({ category, pctChange: pct, message })
  } catch {
    return NextResponse.json({ error: 'Failed to generate alert' }, { status: 500 })
  }
}
