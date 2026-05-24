import fs from 'fs'
import path from 'path'
import { createClient } from 'redis'
import { Redis } from '@upstash/redis'
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

function sessionKey(userId: string): string {
  return `plaid:session:${userId}`
}

function getUpstashRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

let nodeRedisClient: Awaited<ReturnType<typeof createClient>> | null = null
let nodeRedisConnect: Promise<Awaited<ReturnType<typeof createClient>>> | null = null

async function getNodeRedis(): Promise<Awaited<ReturnType<typeof createClient>> | null> {
  const url = process.env.REDIS_URL
  if (!url) return null
  if (nodeRedisClient?.isOpen) return nodeRedisClient
  if (!nodeRedisConnect) {
    nodeRedisConnect = (async () => {
      const client = createClient({ url })
      client.on('error', (err) => console.error('sessionStore: redis error', err))
      await client.connect()
      nodeRedisClient = client
      return client
    })()
  }
  return nodeRedisConnect
}

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

async function readSession(userId: string): Promise<PlaidSession | undefined> {
  const upstash = getUpstashRedis()
  if (upstash) {
    const session = await upstash.get<PlaidSession>(sessionKey(userId))
    return session ?? undefined
  }

  const nodeRedis = await getNodeRedis()
  if (nodeRedis) {
    const raw = await nodeRedis.get(sessionKey(userId))
    if (!raw) return undefined
    return JSON.parse(raw) as PlaidSession
  }

  return readFile()[userId]
}

async function writeSession(userId: string, session: PlaidSession): Promise<void> {
  const upstash = getUpstashRedis()
  if (upstash) {
    await upstash.set(sessionKey(userId), session)
    return
  }

  const nodeRedis = await getNodeRedis()
  if (nodeRedis) {
    await nodeRedis.set(sessionKey(userId), JSON.stringify(session))
    return
  }

  const sessions = readFile()
  sessions[userId] = session
  writeFile(sessions)
}

async function removeSession(userId: string): Promise<void> {
  const upstash = getUpstashRedis()
  if (upstash) {
    await upstash.del(sessionKey(userId))
    return
  }

  const nodeRedis = await getNodeRedis()
  if (nodeRedis) {
    await nodeRedis.del(sessionKey(userId))
    return
  }

  const sessions = readFile()
  delete sessions[userId]
  writeFile(sessions)
}

export async function saveSession(
  userId: string,
  accessToken: string,
  itemId: string,
): Promise<void> {
  await writeSession(userId, { accessToken, itemId, cursor: null, transactions: [] })
}

export async function getSession(userId: string): Promise<PlaidSession | undefined> {
  return readSession(userId)
}

export async function updateCursor(userId: string, cursor: string | null): Promise<void> {
  const session = await readSession(userId)
  if (!session) return
  await writeSession(userId, { ...session, cursor })
}

export async function mergeSessionTransactions(
  userId: string,
  incoming: NormalizedTransaction[],
  removedIds: string[] = [],
): Promise<NormalizedTransaction[]> {
  const session = await readSession(userId)
  if (!session) return []

  const merged = mergePlaidTransactions(session.transactions ?? [], incoming, removedIds)
  await writeSession(userId, { ...session, transactions: merged })
  return merged
}

export async function getSessionTransactions(
  userId: string,
): Promise<NormalizedTransaction[]> {
  const session = await readSession(userId)
  return session?.transactions ?? []
}

export async function hasSession(userId: string): Promise<boolean> {
  return Boolean(await readSession(userId))
}

export async function deleteSession(userId: string): Promise<void> {
  await removeSession(userId)
}
