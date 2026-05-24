import OpenAI from 'openai'

/** Cheapest model for JSON advice — good for hackathon budgets. */
export const OPENAI_TEXT_MODEL = 'gpt-4o-mini'

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) return null
  return new OpenAI({ apiKey })
}

export function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}

type JsonChatOptions = {
  system?: string
  maxTokens?: number
}

/** Text-only JSON completion. Returns null if no API key or empty response. */
export async function completeJson<T>(
  prompt: string,
  options: JsonChatOptions = {},
): Promise<T | null> {
  const client = getOpenAIClient()
  if (!client) return null

  const response = await client.chat.completions.create({
    model: OPENAI_TEXT_MODEL,
    temperature: 0.3,
    max_tokens: options.maxTokens ?? 512,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: options.system ?? 'You are a helpful assistant. Reply with valid JSON only.',
      },
      { role: 'user', content: prompt },
    ],
  })

  const raw = response.choices[0]?.message?.content?.trim()
  if (!raw) return null
  return JSON.parse(raw) as T
}
