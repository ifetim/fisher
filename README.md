# ClearMint

Personal finance dashboard (hackathon). See **[PLAN.md](./PLAN.md)** for scope, screens, JSON schemas, and design.

## Stack

**Next.js** (App Router) + React + TypeScript + CSS. Plaid and Gemini API routes live in `src/app/api/`.

## Quick start

```bash
npm install
cp .env.example .env.local   # add Plaid sandbox keys (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — dashboard, spending, savings, advice. Plaid sandbox test: [http://localhost:3000/plaid-test](http://localhost:3000/plaid-test).

```bash
npm run build   # production build
npm run start   # run production build locally
npm run lint
```

## Environment (`.env.local`)

Copy from `.env.example`:

- `PLAID_CLIENT_ID` / `PLAID_SECRET` / `PLAID_ENV=sandbox` — from [Plaid Dashboard → Keys](https://dashboard.plaid.com/developers/keys)

If you previously used `server/.env`, paste the same values into `.env.local` at the repo root.

## Project layout

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js routes and `api/` handlers |
| `src/views/` | Screen components (dashboard, spending, …) |
| `src/components/` | Shared UI |
| `src/data/` | Demo JSON |
| `src/lib/plaid/` | Plaid server helpers |

## Team workflow

| Rule | Detail |
|------|--------|
| **Branches** | New feature → new branch off `main` (e.g. `feature/login`) |
| **Merge** | Merge when that screen/slice works end-to-end |
| **Plan** | `PLAN.md` is the source of truth |
| **Commits** | Plain messages — no `Co-authored-by: Cursor` trailers |

Cursor rules in `.cursor/rules/` mirror this for agents.

## Fake login (dev)

In development, the app auto-signs in as the first user in `users.json` (`fe@email.com`). Login screen coming on another branch.
