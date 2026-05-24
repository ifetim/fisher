'use client'

import { useRef, useState } from 'react'
import { useFinance } from '@/context/FinanceContext'
import type { Transaction } from '@/types'
import '../shared/page.css'
import './StatementUpload.css'

type Props = {
  accountId?: number
}

export function StatementUpload({ accountId = 1 }: Props) {
  const { addUploadedTransactions } = useFinance()
  const inputRef = useRef<HTMLInputElement>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleFile(file: File) {
    setAnalyzing(true)
    setMessage(null)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/gemini/statement', {
        method: 'POST',
        body: form,
      })
      const data = (await res.json()) as {
        transactions?: Omit<Transaction, 'id'>[]
        message?: string
        error?: string
      }

      if (!res.ok || !data.transactions) {
        setMessage(data.error ?? 'Could not read that file.')
        return
      }

      addUploadedTransactions(
        data.transactions.map((t) => ({ ...t, accountId: t.accountId ?? accountId })),
      )
      setMessage(data.message ?? `Added ${data.transactions.length} transactions.`)
    } catch {
      setMessage('Upload failed. Try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="statement-upload card card--surface">
      <p className="statement-upload__label">Upload statement</p>
      <p className="statement-upload__hint">PDF or image — we extract transactions on your request.</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="statement-upload__input"
        disabled={analyzing}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        className="btn btn--secondary"
        disabled={analyzing}
        onClick={() => inputRef.current?.click()}
      >
        {analyzing ? 'Analyzing…' : 'Choose file'}
      </button>
      {message ? <p className="statement-upload__msg">{message}</p> : null}
    </div>
  )
}
