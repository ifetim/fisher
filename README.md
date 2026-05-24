# ClearMint

A calm personal finance dashboard for everyday people — understand where money goes and how to spend smarter, without guilt.

**Problem:** Most finance apps overwhelm users or shame them. **Solution:** ClearMint hides balances by default, shows real spending patterns, and offers coach-style advice grounded in your data.

See **[PLAN.md](./PLAN.md)** for full scope and schemas.

## Stack

Next.js (App Router) · React · TypeScript · CSS · Recharts · Gemini API (on user action) · Plaid sandbox (optional)

## Quick start

```bash
npm install
cp .env.example .env.local   # add Plaid sandbox keys
npm run dev
```

- **Landing:** [http://localhost:3000](http://localhost:3000) — scroll marketing page (navy/orange)
- **App login:** [http://localhost:3000/login](http://localhost:3000/login)

**Demo login:** `fe@email.com` / `password123`

## Screens

| Screen | Route | Highlights |
|--------|-------|------------|
| Login | `/login` | Fake auth against `users.json` |
| Dashboard | `/dashboard` | Net worth, accounts, spending month, insights |
| Spending | `/spending` | Filters, donut + bar charts, tx list, statement upload |
| Savings | `/savings` | Goals, progress bars, contribution chart, AI suggestions |
| Advice | `/advice` | Rule-based health score (0–100), AI cards, literacy tips |

## Environment (`.env.local`)

| Variable | Purpose |
|----------|---------|
| `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` | Live bank connect (sandbox) |
| `GEMINI_API_KEY` | Real statement parse + advice (stubs work without it) |

## AI usage (fair play)

Gemini is called **only** when the user taps a button (upload, spending alert, savings tips, advice). The **health score is computed in code** — AI explains it, never invents the number.

## Submission checklist (hackathon)

- [ ] Public GitHub repo
- [ ] 5 screenshots: Login, Dashboard, Spending, Savings, Advice
- [ ] Pitch: calm coach for everyday spenders; privacy-first balances; real data + optional Plaid

## Team workflow

Feature branches off `main` · merge when a screen works · `PLAN.md` is source of truth.
