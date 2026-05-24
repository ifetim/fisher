# Plaid Sandbox Test Users

Three realistic student/young-adult personas for testing ClearMint.

## How to load them

### Option A — Plaid Dashboard (recommended)
1. Go to dashboard.plaid.com → Developers → Sandbox → Test Users
2. Click "Add user"
3. Set the username (see each file)
4. Paste the JSON from the file as the config
5. Any non-empty password will work

### Option B — user_custom login (no dashboard needed)
In Plaid Link, type:
- Username: `user_custom`
- Password: paste the entire JSON object

### Institution to use
Always use **First Platypus Bank** — it's non-OAuth and works reliably with custom users.

---

## Personas

| Username | File | Story | Accounts | Transactions |
|---|---|---|---|---|
| `rich_history` | `rich-history.json` | Working professional (Fe) | 3 | ~200 txs, 12 mo |
| **`broke_student`** | **`broke-student.json`** | **Broke student — $47 chequing, CC maxed, delivery habit** | **3** | **~190 txs, 12 mo** |
| **`many_accounts`** | **`many-accounts-student.json`** | **Co-op student — 7 accounts, money everywhere** | **7** | **~221 txs, 12 mo** |
| `tight_month` | `tight-month.json` | Thin auto-generated history | 3 | Auto (thin) |
| `getting_there` | `getting-there.json` | Recent grad | 4 | Auto (thin) |
| `solid_foundation` | `solid-foundation.json` | Early career | 5 | Auto (thin) |

### Student demos (paste into Plaid)

**Broke student** — username `broke_student`
- Alex Chen, TD chequing at **$47**, savings **$85**, Visa at **$3,872**
- Part-time payroll + OSAP, heavy DoorDash/Uber Eats on credit, minimum payments, NSF fee

**Many accounts** — username `many_accounts`
- Sam Okonkwo, **7 accounts** across RBC/TD/BMO/EQ + 2 credit cards + student LOC
- Co-op salary in one account, spending split everywhere, internal transfers

### Paste into Plaid Dashboard

1. **Developers → Sandbox → Test Users → Add user**
2. Set the **username exactly** (underscores matter — not hyphens):
   - `broke_student`
   - `many_accounts`
   - `rich_history`
3. Password: anything (e.g. `password123`)
4. Config JSON: paste the **entire file** — valid Plaid schema is only `{ "override_accounts": [...] }`

### Link in the app

- Institution: **First Platypus Bank** (not OAuth banks)
- Username: must match dashboard exactly
- Password: whatever you set in dashboard

### Known gotchas

- **`many_accounts` had a line of credit** — Plaid Sandbox crashes on `subtype: "line of credit"`. Fixed: now uses a **student loan** instead.
- **Custom users return 0 transactions at first** — the app now triggers a refresh after connect; wait ~5s or tap **Refresh sync**.
- **Disconnect and re-link** if you connected before these fixes.
