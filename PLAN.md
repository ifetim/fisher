# ClearMint — Project Plan

> Personal finance dashboard for a hackathon. **Plan only** — build one screen at a time.

## Workflow

- Work in **feature branches**; merge to `main` only when that slice works.
- Suggested branch names: `feature/login`, `feature/dashboard`, `feature/spending`, etc.
- This document lives on `main` (or `docs/plan`) as the source of truth for scope and design.

---

## One-line description

A simple, clean personal finance dashboard that helps everyday people understand where their money goes and how to spend smarter.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Frontend | **Vite + React + TypeScript** |
| Styling | **CSS** (keep it simple) |
| Charts | **Recharts** |
| AI | **Gemini API** (insights on user action only) |
| Data | **Local JSON files** (no backend for v1) |

**Not in v1:** Plaid, real auth, database, backend API.

---

## Fake data (JSON)

### `users.json` (fake login)

```json
[
  {
    "id": 1,
    "name": "Fe Martinez",
    "email": "fe@email.com",
    "password": "password123",
    "avatar": "FM"
  }
]
```

### `accounts.json`

```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Chequing",
    "bank": "RBC",
    "balance": 2847.50,
    "type": "chequing"
  },
  {
    "id": 2,
    "userId": 1,
    "name": "Savings",
    "bank": "RBC",
    "balance": 5200.00,
    "type": "savings"
  },
  {
    "id": 3,
    "userId": 1,
    "name": "Credit Card",
    "bank": "TD",
    "balance": -843.20,
    "type": "credit"
  }
]
```

### `transactions.json` (50+ rows, last 3 months)

Convention: **negative = spending**, **positive = income**.

```json
[
  {
    "id": 1,
    "accountId": 1,
    "date": "2026-05-20",
    "merchant": "DoorDash",
    "category": "Food & Dining",
    "amount": -38.40,
    "type": "debit"
  },
  {
    "id": 2,
    "accountId": 1,
    "date": "2026-05-19",
    "merchant": "Shell Gas Station",
    "category": "Transport",
    "amount": -52.30,
    "type": "debit"
  },
  {
    "id": 3,
    "accountId": 1,
    "date": "2026-05-18",
    "merchant": "Employer Inc",
    "category": "Income",
    "amount": 2100.00,
    "type": "credit"
  }
]
```

### `savingsPlans.json`

```json
[
  {
    "id": 1,
    "userId": 1,
    "goal": "Italy Trip",
    "targetAmount": 3000,
    "savedAmount": 850,
    "deadline": "2026-12-01",
    "monthlyContribution": 250
  }
]
```

---

## Screens (5)

Bottom nav (after login): **Dashboard · Spending · Savings · Advice**

### Screen 1: Login

- Clean, minimal form (email + password)
- Fake auth against `users.json`
- Logo + app name, “Welcome back” feel
- On success → Dashboard

### Screen 2: Dashboard (home)

Wealthsimple-style: clean, minimal, calm.

- Greeting: “Good morning, Fe”
- **Net worth** across accounts — hidden by default (`••••••`), eye icon to reveal
- **Accounts row** — small cards per account; balances hidden by default (per-card or global eye)
- **Spending this month** — hidden by default
- **Quick insights** — 3 short AI tips (e.g. “You spent 40% more on food this month”)
- Bottom nav

### Screen 3: Spending

- **Filters:** account, time period (week / month / last month / 3 months / custom), category
- **Donut chart** — categories (Recharts); tap slice → filter list below
- **Trend chart** — bar chart, spending vs income over time
- **Transaction list** — merchant, category, date, amount (green income, red spending); tap → detail modal
- **Upload statement** — PDF/image → Gemini extracts transactions → merge into list; “Analyzing…” state
- **Smart alert (AI)** — gentle comparison vs last month (e.g. food spend up 60%)

### Screen 4: Savings

- **Goals** — name, progress bar, saved vs target, deadline, monthly contribution needed
- **Add goal** — name, target, deadline
- **Savings suggestions (AI)** — cut-back ideas tied to real spending (e.g. less DoorDash → faster goal)
- **History** — line chart of monthly contributions

### Screen 5: Advice

- **Spending health score** — 0–100 from rules in code (Gemini explains, does not invent the number)
- **AI advice cards** — food, emergency fund, credit payoff, etc.
- **Category tips** — Food, Transport, Shopping
- **Upload statement** (second entry point, same as Spending)
- **Literacy cards** — emergency fund, compound interest, credit score (expandable, plain English)

---

## Gemini API (3 triggers only)

Call Gemini **only** when the user triggers it — not on every page load.

1. **Upload statement** — read image/PDF → return transactions as JSON
2. **Spending alerts** — “you spend too much on X, here’s how to fix it”
3. **Savings suggestions** — “if you cut X you save Y” toward goals

Dashboard quick insights: use a **button** or prewritten fallbacks until the user asks for fresh advice.

---

## Design rules

- **Colors:** white background, dark navy text; green = income, red = spending, blue = savings goals
- **Font:** Inter or system sans-serif
- **Balances hidden by default** everywhere; eye icon to reveal
- **No clutter** — max 3–4 elements per section
- **Mobile-first**
- **Tone:** calm coach, not guilt or scary alerts

---

## Build order

1. Scaffold Vite + React + TS; add JSON files and types
2. **Login** + routing
3. **Dashboard** (no AI yet)
4. **Spending** (charts + filters + list)
5. **Savings**
6. **Advice** + wire Gemini

After each screen works on its branch, merge to `main`.

---

## Cursor kickoff (copy when starting code)

> We are building ClearMint, a personal finance dashboard web app using Vite + React + TypeScript + CSS. No backend — all data comes from local JSON files (users.json, accounts.json, transactions.json, savingsPlans.json). We use the Gemini API for AI insights. The app has 5 screens: Login, Dashboard, Spending, Savings, and Advice. Balances are hidden by default like Wealthsimple with an eye icon to reveal. The design is clean, minimal, calm — no clutter. Build one screen at a time starting with Login.

Then: **“Screen 1 is done. Now build Screen 2.”**

---

## Team / scope notes

- Target: **24 hours**, **~3 people**
- One person: JSON + types + analytics helpers
- One person: UI / screens / CSS
- One person: Recharts + Gemini integration
- Agree on transaction schema and categories in the first 30 minutes
