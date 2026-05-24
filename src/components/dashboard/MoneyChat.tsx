'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { SavingsPlan, Transaction } from '@/types'
import { paydayBudget } from '@/lib/paydayBudget'
import { spendingByCategory } from '@/lib/transactions'
import { detectSubscriptions, totalMonthlySubscriptions } from '@/lib/subscriptions'
import { V3Icons } from '@/components/v3/V3Icons'

type Props = {
  transactions: Transaction[]
  savingsPlans: SavingsPlan[]
  netWorth: number
}

type Message =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string }
  | { role: 'assistant'; text: string; pending: true }

const STARTERS = [
  'Can I afford a $200 concert?',
  'Why did I spend so much this month?',
  'Where can I cut back?',
  "How am I doing on savings?",
]

export function MoneyChat({ transactions, savingsPlans, netWorth }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Focus input on open + lock body scroll on mobile while modal is up
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    const { body } = document
    const prev = body.style.overflow
    body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      body.style.overflow = prev
    }
  }, [open])

  // Auto-scroll on new message
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  // Esc to close
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const context = useMemo(() => {
    const budget = paydayBudget(transactions)
    const cats = spendingByCategory(transactions).slice(0, 5)
    const subs = detectSubscriptions(transactions)
    const recent = [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 12)
      .map((t) => ({
        date: t.date,
        merchant: t.merchant,
        category: t.category,
        amount: t.amount,
      }))

    return {
      netWorth,
      monthIncome: Math.round(budget.monthIncome),
      monthSpent: Math.round(budget.monthSpent),
      remaining: Math.round(budget.remaining),
      daysLeft: budget.daysLeft,
      topCategories: cats.map((c) => ({ category: c.category, total: Math.round(c.total) })),
      subscriptionsTotal: Math.round(totalMonthlySubscriptions(subs)),
      recentTransactions: recent,
      savingsGoals: savingsPlans.map((g) => ({
        goal: g.goal,
        saved: g.savedAmount,
        target: g.targetAmount,
      })),
    }
  }, [transactions, savingsPlans, netWorth])

  async function send(text: string) {
    const message = text.trim()
    if (!message || busy) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: message },
      { role: 'assistant', text: '…', pending: true },
    ])
    setDraft('')
    setBusy(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      })
      const data = (await res.json()) as { reply?: string; error?: string }
      const reply = data.reply ?? "I couldn't reach the AI just now. Try again in a moment."
      setMessages((prev) => {
        const next = [...prev]
        // Replace the last pending placeholder with the real reply
        for (let i = next.length - 1; i >= 0; i--) {
          const m = next[i]
          if (m.role === 'assistant' && 'pending' in m) {
            next[i] = { role: 'assistant', text: reply }
            break
          }
        }
        return next
      })
    } catch {
      setMessages((prev) => {
        const next = [...prev]
        for (let i = next.length - 1; i >= 0; i--) {
          const m = next[i]
          if (m.role === 'assistant' && 'pending' in m) {
            next[i] = { role: 'assistant', text: 'Hmm, that didn’t go through. Try again?' }
            break
          }
        }
        return next
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`chat-fab${open ? ' chat-fab--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close money chat' : 'Open money chat'}
      >
        {open ? V3Icons.back : V3Icons.chat}
        <span className="chat-fab__label">Ask AI</span>
      </button>

      {open ? (
        <div
          className="chat-overlay"
          role="dialog"
          aria-label="Ask your money anything"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="chat-panel">
            <header className="chat-panel__head">
              <div className="chat-panel__brand">
                <div className="chat-panel__icon">{V3Icons.spark}</div>
                <div>
                  <p className="chat-panel__title">Ask your money</p>
                  <p className="chat-panel__sub">
                    Powered by your real transactions · stays on this session
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="chat-panel__close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <div className="chat-panel__body" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="chat-panel__empty">
                  <p className="chat-panel__hello">
                    Hey — ask me anything about your money. I look at your real spending.
                  </p>
                  <div className="chat-panel__starters">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="chat-panel__starter"
                        onClick={() => send(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`chat-bubble chat-bubble--${m.role}${
                      'pending' in m && m.pending ? ' chat-bubble--pending' : ''
                    }`}
                  >
                    {'pending' in m && m.pending ? (
                      <span className="chat-bubble__dots">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      m.text
                    )}
                  </div>
                ))
              )}
            </div>

            <form
              className="chat-panel__form"
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
            >
              <input
                ref={inputRef}
                className="chat-panel__input"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Can I afford a $200 concert?"
                disabled={busy}
                aria-label="Ask a question"
              />
              <button
                type="submit"
                className="chat-panel__send"
                disabled={busy || !draft.trim()}
                aria-label="Send"
              >
                {V3Icons.arrow}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
