# Student Saver

A personal finance app for **students** who want to understand their money — not another spreadsheet or guilt-trip budget app.

**Live site:** [student-saver-sand.vercel.app](https://student-saver-sand.vercel.app)

**The pain.** Managing money in school is hard. Paycheques and OSAP land, rent and subscriptions go out, and by mid-month you're wondering where it all went. A lot of us don't have a clear picture of *how* we spent or *where* the money actually went — and most finance apps either dump raw numbers on you or make you feel worse. That's a pain point all three of us on this team could relate to.

**The fix.** Student Saver connects your accounts (Plaid), groups spending by what you actually bought, surfaces recurring subscriptions, shows how much you have left per day until payday, and lets you **ask questions in plain English** ("Can I afford this concert?") against your real data. Balances stay hidden until you choose to look. Advice is opt-in. The tone is a calm coach — clarity, not shame.

---

## What's different

These are the choices we made on purpose, against the grain of every other finance app:

- **Balances hidden by default.** Eye icon to reveal. You shouldn't have to feel your net worth every time you open an app.
- **AI is opt-in, per action.** OpenAI runs when you ask a question in dashboard chat, tap "Refresh advice", or "Get savings tips" — never on page load. Less spend, fewer hallucinations, no anxiety nudges.
- **The health score is real code, not vibes.** `src/lib/healthScore.ts` computes a 0–100 score from your actual ratios (savings rate, spending vs income, account diversity). GPT *explains* the number — it never invents it.
- **Merchant-name re-categorization.** Plaid's `personal_finance_category` collapses to `TRANSFER_OUT` / `OTHER` for sandbox custom users (and is coarse in production). We re-classify by merchant name after fetching, so Loblaws goes to Groceries and "E-Transfer from Mom" goes to Income — see `src/lib/plaid/categorizeMerchant.ts`.
- **Live Plaid sandbox, not fake JSON.** We connect through Plaid Link, exchange tokens, and run `/transactions/sync` with cursor pagination. Sessions persist in Redis on Vercel (local file fallback in dev).

---

## Try it live

1. Open **[student-saver-sand.vercel.app](https://student-saver-sand.vercel.app)** — marketing landing page with hero, student stats, and savings calculator
2. **Sign up** or **Log in** from the nav
3. Use demo credentials below, or connect a Plaid sandbox bank on Spending

**Demo login:** `test@gmail.com`, `alex@gmail.com`, or `jordan@gmail.com` — password `password123`

**Plaid sandbox (First Platypus Bank):** password `pass_good` for all users below

| Username | Persona |
|---|---|
| `user_good` | Default Plaid test user |
| `custom_richhistory` | Fe — steady paycheck, 3 accounts, 12 mo history |
| `custom_brokestudent` | Alex — broke student, tight budget, delivery-heavy |
| `custom_manyacc` | Sam — many accounts across banks |

**Best demo flow for judges:** landing page → sign in → **Dashboard** → **Ask AI** → *"Can I afford a $200 concert?"* → switch personas in the sidebar.

---

## Run locally

```bash
git clone https://github.com/ifetim/student-saver.git
cd student-saver
npm install
cp .env.example .env.local   # add Plaid sandbox + OpenAI keys (both optional)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the same landing page, or jump straight to `/login`.

The app runs **without any API keys** in demo mode — bundled JSON + prewritten advice cards and short chat replies. On Vercel, add `PLAID_*`, `OPENAI_API_KEY`, and `REDIS_URL` in project settings for full Plaid + AI + session persistence. See [DEPLOY.md](./DEPLOY.md).

---

## Demo personas (for judges)

The sidebar has a **Demo Switcher** that flips between three built-in demo users (or connect Plaid sandbox personas — see `src/data/plaid-test-users/README.md`):

| Name | Tagline | Snapshot |
|------|---------|----------|
| **Fe Martinez** | Recent grad · steady paycheck | Chequing + savings + credit, Italy trip goal |
| **Alex Chen** | Broke student · part-time job | Tight chequing, line of credit, delivery-heavy month |
| **Jordan Smith** | Tech intern · big spender | High income, multiple accounts, luxury spending |

Each profile keeps its own cached Plaid data in `localStorage`, so switching is instant. Subscription detection and daily-budget math update immediately per persona.

---

## Screens

| Screen | Route | What's there |
|--------|-------|--------------|
| Landing | `/` | Full marketing page — STUDENT$SAVER hero, “Being a student is…”, university savings calculator, signup CTA |
| Login | `/login` | Email + password against `users.json` |
| Dashboard | `/dashboard` | Net worth (hidden), accounts, monthly budget bar, **daily budget** ("$X left · $Y/day until June 1"), **subscription detector** (recurring merchants + monthly total), quick insights, week summary, **Ask AI** floating chat |
| Spending | `/spending` | Period + category filters, transactions grouped by day, category bar breakdown, vs-last-month delta |
| Savings | `/savings` | Goals with live progress (linked Plaid balances), add-goal form, overall % complete |
| Advice | `/advice` | Health-score ring (0–100), "For you this week" cards (on-demand AI), literacy nudges |

---

## How the AI is wired

All OpenAI calls are server-side routes under `src/app/api/ai/`. The browser never sees the key.

| Route | Trigger | Model | Output |
|-------|---------|-------|--------|
| `/api/ai/chat` | **Ask AI** on Dashboard (each message) | `gpt-4o-mini` | Natural-language answer using net worth, month income/spend, categories, subscriptions, recent txs, savings goals |
| `/api/ai/advice` | "Refresh" button on Advice | `gpt-4o-mini` | 4 advice cards grounded in the **code-computed** health score |
| `/api/ai/spending-alert` | User taps category alert | `gpt-4o-mini` | Short comparison vs prior month |
| `/api/ai/savings-suggestions` | User taps "Get tips" on Savings | `gpt-4o-mini` | Cut-back ideas tied to real transactions |

**Dashboard chat** sends a compact context bundle built client-side (`MoneyChat.tsx` → `paydayBudget`, `detectSubscriptions`, top categories). Example: *"Can I afford a $100 concert?"* → model subtracts from remaining balance and recalculates per-day spend for days left in the month.

**Subscriptions** are detected in code (`src/lib/subscriptions.ts`) — known merchants (Netflix, Spotify, Apple, etc.) plus same merchant + similar amount in 2+ months. No AI required for the list; AI can reference the total in chat.

If `OPENAI_API_KEY` is missing, chat and advice routes degrade to hand-written fallbacks. The UI never breaks.

---

## Tech

- **Next.js 15** App Router + **React 19** + **TypeScript** (strict)
- **Plaid Node SDK** + `react-plaid-link` for live bank connections
- **OpenAI Node SDK** (`gpt-4o-mini`, server-side only)
- **Recharts** for category bars and trend lines
- Plain CSS — no Tailwind, no UI kit
- Plaid sessions in **Redis** on Vercel (`REDIS_URL`); `.plaid-sessions.json` locally (gitignored)

```text
src/
  app/
    (marketing)/    landing page
    (main)/         dashboard · spending · savings · advice (auth-gated)
    api/
      ai/           openai routes
      plaid/        link-token · exchange · sync · snapshot · disconnect
  components/       AppShell, BottomNav, MoneyChat, PaydayCard, SubscriptionsCard, demo switcher
  context/          AuthContext, FinanceContext (per-user cached Plaid data)
  lib/
    plaid/          categorizeMerchant, normalizeTransaction, sessionStore
    paydayBudget.ts month income − spend → daily allowance
    subscriptions.ts recurring charge detection
    healthScore.ts  code-computed 0–100 score
    openai/         thin gpt-4o-mini wrapper
  views/            page components per screen
  data/             demo JSON + 3 Plaid sandbox personas
```

---

## Environment

```dotenv
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
OPENAI_API_KEY=sk-...
```

All four are optional. The app boots and runs in demo mode without any of them.

---

## Built for the Cursor Calgary Hackathon

~24 hours, team of three (SAIT). We built what we wished we had in school: see where the money went, catch subscriptions you forgot about, and get a straight answer before you spend on something you can't afford. The full slice from scaffold → Next.js + Plaid + OpenAI + multi-persona demo lives in the commit history.
