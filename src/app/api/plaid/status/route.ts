import { NextResponse } from 'next/server'
import { hasSession } from '@/lib/plaid/sessionStore'

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get('userId') ?? ''
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }
  return NextResponse.json({ connected: hasSession(userId) })
}
