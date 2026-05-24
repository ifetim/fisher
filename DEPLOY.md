# Deploy Student Saver to Vercel

Step-by-step guide for shipping Student Saver with working Plaid sessions in production.

## Prerequisites

- Code builds locally: `npm run build`
- Repo pushed to GitHub (`ifetim/fisher`)
- Plaid sandbox keys from [Plaid Dashboard](https://dashboard.plaid.com)
- OpenAI API key (optional, for AI features)

## Phase 1 — Prep

```bash
npm run build
git status   # working tree clean, on main or feature branch
```

## Phase 2 — Vercel project

1. Sign up at [vercel.com](https://vercel.com) with GitHub (Hobby / free plan).
2. **Add New → Project** → import `fisher`.
3. Add environment variables (apply to **Production**, **Preview**, and **Development**):

| Name | Value |
|---|---|
| `PLAID_CLIENT_ID` | from `.env.local` |
| `PLAID_SECRET` | from `.env.local` |
| `PLAID_ENV` | `sandbox` |
| `OPENAI_API_KEY` | from `.env.local` (optional) |

4. Click **Deploy**. First deploy may succeed but Plaid won't persist until Redis is connected.

## Phase 3 — Redis for Plaid sessions

Vercel's old KV product is deprecated. Use **Upstash Redis** from the Vercel marketplace:

1. In your Vercel project → **Storage** (or **Integrations**) → **Upstash Redis**.
2. Create a database and **Connect** it to your project.
3. Vercel auto-adds env vars like:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

Legacy `KV_REST_API_URL` / `KV_REST_API_TOKEN` also work if present.

Without Redis, the app falls back to `.plaid-sessions.json` on disk — fine locally, **broken on Vercel**.

## Phase 4 — Local test with Redis (optional)

1. In Vercel → your Redis database → copy env vars to `.env.local`.
2. Restart dev server: `npm run dev`.
3. Connect **First Platypus Bank** in Plaid Link — username `user_good` or a custom user (`custom_richhistory`, `custom_brokestudent`, `custom_manyacc`); password `pass_good` for all.
4. Refresh the page — connection should persist.
5. In Upstash/Vercel data browser, look for keys like `plaid:session:<userId>`.

## Phase 5 — Ship

```bash
git checkout main
git merge feature/deploy-vercel-kv
git push origin main
```

Vercel redeploys automatically (~2 min). Open your `*.vercel.app` URL and test Plaid Link.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails on Vercel | Run `npm run build` locally; fix TypeScript errors first |
| "No Plaid connection" after linking | Redis not connected or env vars missing |
| AI features empty | `OPENAI_API_KEY` not set in Vercel |
| Plaid Link opens but data never loads | Check Vercel function logs for API errors |

## Notes

- **Vercel Production ≠ Plaid Production.** Keep `PLAID_ENV=sandbox` until you're ready for real banks.
- Hobby plan is free for personal projects.
- Plaid access tokens are stored in Redis — treat Vercel/Upstash credentials as sensitive.
