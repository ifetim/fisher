import { NextResponse } from 'next/server'
import { completeJson, hasOpenAIKey } from '@/lib/openai/client'

type CompactTx = {
  date: string
  merchant: string
  category: string
  amount: number
}

type ChatBody = {
  message?: string
  context?: {
    netWorth?: number
    monthIncome?: number
    monthSpent?: number
    remaining?: number
    daysLeft?: number
    topCategories?: { category: string; total: number }[]
    subscriptionsTotal?: number
    recentTransactions?: CompactTx[]
    savingsGoals?: { goal: string; saved: number; target: number }[]
  }
}

function buildFallback(message: string, ctx: ChatBody['context']): string {
  const remaining = ctx?.remaining ?? 0
  const perDay = ctx?.daysLeft ? remaining / ctx.daysLeft : 0
  const lower = (message ?? '').toLowerCase()

  if (/afford|buy|get|should i/.test(lower)) {
    if (remaining <= 0) {
      return "You're already at zero for this month — I'd hold off until your next paycheck lands."
    }
    return `You have about $${Math.round(remaining)} left this month — roughly $${Math.round(perDay)}/day. If the purchase is under that, you can swing it without dipping into savings.`
  }
  if (/save|saving|goal/.test(lower)) {
    return 'Pick one goal and route a fixed amount the day you get paid. Even $25/week becomes $1,300 a year.'
  }
  if (/why|where|spend/.test(lower)) {
    const top = ctx?.topCategories?.[0]
    if (top) {
      return `Your biggest category this month is ${top.category} at $${Math.round(top.total)}. That's usually the easiest place to find quick savings.`
    }
    return 'Open Spending and tap a slice on the donut — that drills into where the money actually went.'
  }
  return "I can answer questions about your spending, savings, or whether you can afford something. Try: \"Can I afford a $200 concert?\" or \"Why did I spend so much this month?\""
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatBody
    const message = (body.message ?? '').trim()
    const ctx = body.context ?? {}

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (hasOpenAIKey()) {
      const topCats =
        ctx.topCategories?.slice(0, 4).map((c) => `- ${c.category}: $${Math.round(c.total)}`).join('\n') ||
        '(no spending yet this month)'

      const goals =
        ctx.savingsGoals
          ?.slice(0, 3)
          .map((g) => `- ${g.goal}: $${Math.round(g.saved)} / $${Math.round(g.target)}`)
          .join('\n') || '(no goals set)'

      const recent =
        ctx.recentTransactions
          ?.slice(0, 12)
          .map((t) => `${t.date} ${t.merchant} (${t.category}) ${t.amount.toFixed(2)}`)
          .join('\n') || '(no recent transactions)'

      const prompt = `You are ClearMint, a calm money coach for students. Answer the user's question using ONLY the data below. Be concrete with numbers, never preachy. Reply in 2-4 short sentences.

User question: "${message}"

THIS MONTH SO FAR
- Income: $${Math.round(ctx.monthIncome ?? 0)}
- Spent: $${Math.round(ctx.monthSpent ?? 0)}
- Remaining: $${Math.round(ctx.remaining ?? 0)}
- Days left in month: ${ctx.daysLeft ?? 0}
- Net worth across accounts: $${Math.round(ctx.netWorth ?? 0)}
- Estimated subscriptions: $${Math.round(ctx.subscriptionsTotal ?? 0)} / month

TOP CATEGORIES THIS MONTH
${topCats}

SAVINGS GOALS
${goals}

RECENT TRANSACTIONS
${recent}

Return JSON: { "reply": "your answer here" }
Rules:
- Use real numbers from the context.
- If the question is about affording something, do the math: remaining minus the cost, and whether they'll still have a daily budget after.
- If the data can't answer the question, say so briefly and suggest one thing they could check.
- Keep the tone warm, never judgmental, never use exclamation points.`

      const parsed = await completeJson<{ reply: string }>(prompt, {
        maxTokens: 220,
      })
      if (parsed?.reply) {
        return NextResponse.json({ reply: parsed.reply })
      }
    }

    return NextResponse.json({ reply: buildFallback(message, ctx) })
  } catch {
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 })
  }
}
