# Plaid Sandbox Test Users

Custom personas for **Student Saver** demos. JSON configs live in this folder.

## Login (Plaid Link)

1. Institution: **First Platypus Bank** (non-OAuth — most reliable for custom users)
2. **Password for every user:** `pass_good`

| Username | Config file | Story |
|---|---|---|
| `user_good` | *(built-in Plaid)* | Default sandbox user |
| `custom_richhistory` | `rich-history.json` | Working professional (Fe) — 3 accounts, ~12 mo txs |
| `custom_brokestudent` | `broke-student.json` | Broke student (Alex) — $47 chequing, CC maxed |
| `custom_manyacc` | `many-accounts-student.json` | Co-op student (Sam) — 7 accounts |

## Load custom users in Plaid Dashboard

1. [dashboard.plaid.com](https://dashboard.plaid.com) → **Developers** → **Sandbox** → **Test Users** → **Add user**
2. Set **username** exactly as in the table (e.g. `custom_brokestudent`)
3. Set **password** to `pass_good`
4. Paste the matching JSON file as config — **only** the `{ "override_accounts": [...] }` object (no extra fields)

## Link in the app

- Go to **Spending** → **Connect** (or onboarding Plaid step)
- Pick **First Platypus Bank**
- Enter username + `pass_good`

## Known gotchas

- **0 transactions right after link** — wait ~5s; the app retries sync. Custom users often need a refresh on first connect.
- **`many_accounts` line of credit** — Plaid sandbox can crash on some subtypes; our config uses student loan instead.
- **Disconnect and re-link** after changing JSON in the Plaid dashboard.
- **Username must match dashboard exactly** — underscores, no hyphens.
