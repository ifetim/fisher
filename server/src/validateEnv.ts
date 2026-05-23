const PLAID_CLIENT_ID_PATTERN = /^[a-f0-9]{24}$/i

export function validatePlaidClientId(clientId: string): {
  ok: boolean
  message?: string
} {
  if (!clientId.trim()) {
    return { ok: false, message: 'PLAID_CLIENT_ID is missing in server/.env' }
  }
  if (!PLAID_CLIENT_ID_PATTERN.test(clientId)) {
    return {
      ok: false,
      message: `PLAID_CLIENT_ID looks wrong (got ${clientId.length} chars; Plaid expects exactly 24 hex characters). Re-copy from Plaid Dashboard → Keys → Sandbox.`,
    }
  }
  return { ok: true }
}

export function logPlaidEnvOnStartup() {
  const clientId = process.env.PLAID_CLIENT_ID ?? ''
  const check = validatePlaidClientId(clientId)
  if (!check.ok) {
    console.warn(`\n⚠️  Plaid credentials: ${check.message}\n`)
  }
}
