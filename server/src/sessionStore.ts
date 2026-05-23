type PlaidSession = {
  accessToken: string
  itemId: string
  cursor: string | null
}

const sessions = new Map<string, PlaidSession>()

export function saveSession(userId: string, accessToken: string, itemId: string) {
  sessions.set(userId, { accessToken, itemId, cursor: null })
}

export function getSession(userId: string): PlaidSession | undefined {
  return sessions.get(userId)
}

export function updateCursor(userId: string, cursor: string | null) {
  const session = sessions.get(userId)
  if (session) {
    session.cursor = cursor
  }
}

export function hasSession(userId: string): boolean {
  return sessions.has(userId)
}
