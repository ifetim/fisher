const PLAID_CLIENT_ID_PATTERN = /^[a-f0-9]{24}$/i

export function validatePlaidClientId(clientId: string): {
  ok: boolean
  message?: string
} {
  if (!clientId.trim()) {
    return { ok: false, message: 'PLAID_CLIENT_ID is missing in .env.local' }
  }
  if (!PLAID_CLIENT_ID_PATTERN.test(clientId)) {
    return {
      ok: false,
      message: `PLAID_CLIENT_ID looks wrong (got ${clientId.length} chars; Plaid expects exactly 24 hex characters). Re-copy from Plaid Dashboard → Keys → Sandbox.`,
    }
  }
  return { ok: true }
}

export function plaidErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'error_message' in error.response.data
  ) {
    return String(error.response.data.error_message)
  }
  return fallback
}
