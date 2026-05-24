import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/plaid/sessionStore'

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: string }
  const userId = String(body?.userId ?? '')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  await deleteSession(userId)
  return NextResponse.json({ disconnected: true })
}
