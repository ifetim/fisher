'use client'

// src/views/StudentSaverPage.tsx
// Matches clearmint-v3.css exactly: shell, card, btn, sec/lbl, tx rows,
// ico colours, DM Sans + Fraunces fonts, navy/orange/mint palette.

import { useCallback, useRef, useState } from 'react'
import type { AnalysisResult, MatchedTransaction } from '@/lib/analyzeStatement'
import './StudentSaverPage.css'
import CampusMap from '@/components/CampusMap'   // ← add here

const CAMPUSES = [
  'Auto-detect',
  'University of Toronto',
  'McGill University',
  'University of Waterloo',
  'University of British Columbia',
  'University of Calgary',
  'McMaster University',
  'Western University',
  "Queen's University",
]

// ── Icons (inline SVG, matches V3Icons style) ─────────────────────────────────

const UploadIcon = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v1A1.5 1.5 0 004.5 19h11A1.5 1.5 0 0017 17.5v-1M10 1v12m0-12L6.5 4.5M10 1l3.5 3.5" />
  </svg>
)

const ChevronIcon = (open: boolean) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
  </svg>
)

const CoinIcon = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="10" cy="10" r="8" />
    <path strokeLinecap="round" d="M10 7v6m-2-4h3a1 1 0 010 2H9" />
  </svg>
)

// ── Main component ────────────────────────────────────────────────────────────

export function StudentSaverPage() {
  const [file, setFile]         = useState<File | null>(null)
  const [campus, setCampus]     = useState('Auto-detect')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [result, setResult]     = useState<AnalysisResult | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef                = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File | null) => {
    setError(null)
    setResult(null)
    if (!f) return
    if (f.type !== 'application/pdf') { setError('Please upload a PDF file.'); return }
    setFile(f)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0] ?? null)
  }, [handleFile])

  async function handleSubmit() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const form = new FormData()
    form.append('statement', file)
    if (campus !== 'Auto-detect') form.append('campus', campus)

    try {
      const res  = await fetch('/api/student-saver', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? 'Something went wrong.')
      else setResult(data)
    } catch {
      setError('Network error — make sure the dev server is running.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFile(null)
    setResult(null)
    setError(null)
    setCampus('Auto-detect')
  }

  return (
    <div className="ss-page">

      {/* ── Page header ── */}
      <div className="sec" style={{ marginTop: 4 }}>
        <span className="lbl">Student Saver</span>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="ss-title">Campus spending insights</h1>
        <p className="ss-sub">
          Upload your bank statement and we'll show you which on-campus spots are costing you the most — and cheaper alternatives right on campus.
        </p>
      </div>

      {!result ? (
        <UploadCard
          file={file}
          campus={campus}
          loading={loading}
          error={error}
          dragging={dragging}
          inputRef={inputRef}
          onFile={handleFile}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onCampusChange={setCampus}
          onSubmit={handleSubmit}
        />
      ) : (
        <Results result={result} onReset={reset} />
      )}
    </div>
  )
}

// ── Upload card ───────────────────────────────────────────────────────────────

function UploadCard({
  file, campus, loading, error, dragging, inputRef,
  onFile, onDrop, onDragOver, onDragLeave, onCampusChange, onSubmit,
}: {
  file: File | null
  campus: string
  loading: boolean
  error: string | null
  dragging: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  onFile: (f: File | null) => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onCampusChange: (c: string) => void
  onSubmit: () => void
}) {
  return (
    <div className="card pad">
      {/* Drop zone */}
      <div
        className={`ss-dropzone${dragging ? ' ss-dropzone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload PDF statement"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        <div className="ss-dropzone__icon">{UploadIcon}</div>
        {file ? (
          <>
            <p className="ss-dropzone__name">{file.name}</p>
            <p className="ss-dropzone__hint">{(file.size / 1024).toFixed(0)} KB · PDF · click to change</p>
          </>
        ) : (
          <>
            <p className="ss-dropzone__name">Drop your statement here</p>
            <p className="ss-dropzone__hint">or click to browse · PDF only</p>
          </>
        )}
      </div>
 {/* Demo file download hint */}
<p className="ss-dropzone__hint" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
  No statement handy?{' '}
  <a href="https://drive.google.com/uc?export=download&id=14oAiwbFSi2PB-wJ_UIDHW1lH42EERWXN"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: 'var(--mint)', textDecoration: 'underline' }}
    >
    Download the sample statement
  </a>{' '}
  to try the demo.
</p>
      {/* Campus picker */}
      <div className="ss-field">
        <label className="ss-label">Your campus</label>
        <select
          className="ss-select"
          value={campus}
          onChange={(e) => onCampusChange(e.target.value)}
        >
          {CAMPUSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="alert-banner" style={{ background: '#fff1f0', borderColor: '#fca5a5', marginBottom: '0.5rem' }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        className="btn block"
        disabled={!file || loading}
        style={!file || loading ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        onClick={onSubmit}
      >
        {loading ? 'Analyzing…' : 'Analyze statement'}
      </button>
    </div>
  )
}

// ── Results ───────────────────────────────────────────────────────────────────

function Results({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  return (
    <>
      {/* Summary hero card — uses the app's navy gradient */}
      <div className="ss-hero card">
        <p className="ss-hero__campus">
          {result.campus ?? 'Campus'} · Spending analysis
        </p>
        <p className="ss-hero__summary">{result.summary}</p>
        <div className="ss-hero__stats">
          <HeroStat label="Campus spend"    value={`$${result.campusSpend.toFixed(2)}`} />
          <HeroStat label="Could save"      value={`$${result.potentialSavings.toFixed(2)}`} highlight />
          <HeroStat label="Transactions"    value={String(result.matchedTransactions.length)} />
        </div>
      </div>
      {<div className="page__section">
        <div className="sec"><span className="lbl">Campus map</span></div>
        <CampusMap transactions={result.matchedTransactions} />
      </div>}
      {/* Category breakdown */}
      {Object.keys(result.categoryBreakdown).length > 0 && (
        <div className="page__section">
          <div className="sec">
            <span className="lbl">Spending by type</span>
          </div>
          <div className="card pad">
            <CategoryBars breakdown={result.categoryBreakdown} total={result.campusSpend} />
          </div>
        </div>
      )}

      {/* Transaction list */}
      <div className="page__section">
        <div className="sec">
          <span className="lbl">On-campus transactions</span>
          <span className="ss-count">{result.matchedTransactions.length}</span>
        </div>

        {result.matchedTransactions.length === 0 ? (
          <div className="card pad">
            <p className="ss-empty">
              No on-campus transactions detected. Make sure you uploaded a
              text-based PDF, not a scanned image.
            </p>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            {result.matchedTransactions.map((tx, i) => (
              <TxRow key={i} tx={tx} />
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      <button type="button" className="btn ghost block" onClick={onReset}
        style={{ marginBottom: '2rem' }}>
        Analyze another statement
      </button>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function HeroStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="ss-hero__stat">
      <span className={`ss-hero__val${highlight ? ' ss-hero__val--highlight' : ''}`}>{value}</span>
      <span className="ss-hero__lbl">{label}</span>
    </div>
  )
}

function CategoryBars({ breakdown, total }: { breakdown: Record<string, number>; total: number }) {
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1])
  const max = entries[0]?.[1] ?? 1
  return (
    <div className="cats">
      {entries.map(([name, amount]) => {
        const pct = total > 0 ? Math.round((amount / max) * 100) : 0
        return (
          <div className="cat" key={name}>
            <div className="top">
              <span className="name">{name}</span>
              <span className="val">${amount.toFixed(2)}</span>
            </div>
            <div className="bar">
              <div className="fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TxRow({ tx }: { tx: MatchedTransaction }) {
  const [open, setOpen] = useState(false)
  const hasSavings = tx.savings.length > 0
  const bestSaving = hasSavings ? Math.max(...tx.savings.map((s) => s.estimatedSavings)) : 0

  return (
    <div className="ss-tx-wrap">
      <button
        type="button"
        className="tx ss-tx-btn"
        onClick={() => hasSavings && setOpen((o) => !o)}
        style={{ cursor: hasSavings ? 'pointer' : 'default' }}
        aria-expanded={open}
      >
        <div className="ico food">{CoinIcon}</div>
        <div className="meta">
          <p className="merch">{tx.merchant}</p>
          <p className="cat">{tx.cuisine} · {tx.campus}</p>
        </div>
        <div className="ss-tx-right">
          <span className="amt">−${tx.amount.toFixed(2)}</span>
          {hasSavings && (
            <span className="ss-save-badge">save ${bestSaving.toFixed(2)}</span>
          )}
          {hasSavings && (
            <span className="ss-chevron">{ChevronIcon(open)}</span>
          )}
        </div>
      </button>

      {open && hasSavings && (
        <div className="ss-alternatives">
          <p className="ss-alt-label">Cheaper on-campus alternatives</p>
          {tx.savings.map((s, i) => (
            <div className="tx" key={i} style={{ paddingLeft: 16, background: 'var(--mint-soft)' }}>
              <div className="ico groc">{CoinIcon}</div>
              <div className="meta">
                <p className="merch">{s.name}</p>
                <p className="cat">{s.location}</p>
              </div>
              <div className="ss-tx-right">
                <span className="amt" style={{ color: 'var(--mint)' }}>~${s.avgMealCost}</span>
                <span className="ss-save-badge ss-save-badge--mint">−${s.estimatedSavings.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}