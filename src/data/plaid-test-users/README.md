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

## The three personas

| Username | Persona | Story |
|---|---|---|
| `tight_month` | Tight Month | Student, paycheck-to-paycheck, credit card nearly maxed |
| `getting_there` | Getting There | Young grad, building savings, some debt |
| `solid_foundation` | Solid Foundation | Early career, growing investments, paying off student loan |
