# ClearMint

Personal finance dashboard (hackathon). See **[PLAN.md](./PLAN.md)** for full scope, screens, JSON schemas, and design.

## Quick start

```bash
npm install
cp .env.example .env   # add Gemini key when you wire AI
npm run dev
```

```bash
npm run build   # typecheck + production build
npm run lint
```

## Team workflow

| Rule | Detail |
|------|--------|
| **Branches** | New feature → new branch off `main` (e.g. `feature/login`). Don’t commit features on `main`. |
| **Merge** | Merge when that screen/slice works end-to-end. |
| **Plan** | `PLAN.md` on `main` is the source of truth — update it if scope or schemas change. |
| **Build order** | Login → Dashboard → Spending → Savings → Advice (one screen at a time). |
| **Parallel work** | Agree on JSON schemas and categories in the first ~30 min; then split by screen/area. |

Cursor rules in `.cursor/rules/` mirror this for agents.

## Who does what (suggested)

- **Data:** JSON files, TypeScript types, analytics helpers
- **UI:** Screens, routing, CSS
- **Charts + AI:** Recharts, Gemini (3 triggers only — see PLAN)

## Secrets

- Put `VITE_GEMINI_API_KEY` in `.env` (gitignored).
- Never commit API keys or real credentials.

## Fake login (dev)

See `users.json` in PLAN — e.g. `fe@email.com` / `password123` once login exists.
