import { NextResponse } from 'next/server'

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
