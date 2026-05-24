import fs from 'fs'
import path from 'path'
import type { NormalizedTransaction } from '@/lib/plaid/normalizeTransaction'
import { mergePlaidTransactions } from '@/lib/plaid/mergeTransactions'

type PlaidSession = {
  accessToken: string
  itemId: string
  cursor: string | null
  transactions?: NormalizedTransaction[]
}

type SessionMap = Record<string, PlaidSession>

const SESSION_FILE = path.resolve(process.cwd(), '.plaid-sessions.json')

function readFile(): SessionMap {
  try {
    if (!fs.existsSync(SESSION_FILE)) return {}
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8')) as SessionMap
  } catch {
    return {}
  }
}

function writeFile(sessions: SessionMap) {
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2), 'utf8')
  } catch (err) {
    console.error('sessionStore: could not write', SESSION_FILE, err)
  }
}

export function saveSession(userId: string, accessToken: string, itemId: string) {
  const sessions = readFile()
  sessions[userId] = { accessToken, itemId, cursor: null, transactions: [] }
  writeFile(sessions)
}

export function getSession(userId: string): PlaidSession | undefined {
  return readFile()[userId]
}

export function updateCursor(userId: string, cursor: string | null) {
  const sessions = readFile()
  if (sessions[userId]) {
    sessions[userId]!.cursor = cursor
    writeFile(sessions)
  }
}

export function mergeSessionTransactions(
  userId: string,
  incoming: NormalizedTransaction[],
  removedIds: string[] = [],
): NormalizedTransaction[] {
  const sessions = readFile()
  const session = sessions[userId]
  if (!session) return []

  const merged = mergePlaidTransactions(session.transactions ?? [], incoming, removedIds)
  session.transactions = merged
  writeFile(sessions)
  return merged
}

export function getSessionTransactions(userId: string): NormalizedTransaction[] {
  return readFile()[userId]?.transactions ?? []
}

export function hasSession(userId: string): boolean {
  return Boolean(readFile()[userId])
}

export function deleteSession(userId: string) {
  const sessions = readFile()
  delete sessions[userId]
  writeFile(sessions)
}
