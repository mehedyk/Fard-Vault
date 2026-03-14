# 🚀 Fard Vault — Deployment Guide

Complete step-by-step guide from zero to a live, security-hardened vault.

**Time required:** 20–30 minutes  
**Cost:** $0 (all free tiers)

---

## ✅ Pre-Deployment Checklist

Before starting, make sure you have:

- [ ] GitHub account — [signup](https://github.com/signup)
- [ ] Supabase account — [signup](https://supabase.com)
- [ ] Vercel account — [signup](https://vercel.com)
- [ ] All project files ready (this folder)

---

## Part 1 — GitHub Repository

### 1.1 Create the Repository

1. Go to [github.com/new](https://github.com/new)
2. Fill in:
   - **Repository name:** `fard-vault`
   - **Visibility:** Public or Private (your choice)
   - ❌ Do **not** check "Add a README" — you already have one
3. Click **"Create repository"**

### 1.2 Push the Code

```bash
cd /path/to/fard-vault

git init
git add .
git commit -m "feat: Fard Vault v1.0 — security hardened"

git remote add origin https://github.com/YOUR_USERNAME/fard-vault.git
git branch -M main
git push -u origin main
```

✅ Verify: your GitHub repo should now show all files including `supabase/migrations/`.

---

## Part 2 — Supabase Backend

### 2.1 Create Project

1. Go to [app.supabase.com](https://app.supabase.com) → **"New Project"**
2. Fill in:
   - **Name:** `fard-vault`
   - **Database Password:** Click "Generate" and **save this password securely**
   - **Region:** Choose the one closest to your users
   - **Plan:** Free
3. Click **"Create new project"**
4. Wait ~2 minutes for provisioning

✅ Verify: dashboard shows "Project is live"

### 2.2 Run Database Migrations

Run all **three** migrations in order. For each one:

1. In Supabase Dashboard → **"SQL Editor"** → **"New query"**
2. Open the migration file, copy the entire content, paste it in, click **"Run"**
3. Confirm you see `Success. No rows returned.`

**Migration order:**

| # | File | What it creates |
|---|------|----------------|
| 1 | `supabase/migrations/001_initial_schema.sql` | Tables: `user_keys`, `vault_entries`, `categories`, `rate_limits`, `audit_log`; indexes; update triggers; default category trigger |
| 2 | `supabase/migrations/002_rls_policies.sql` | Row Level Security policies on all tables (per-user data isolation) |
| 3 | `supabase/migrations/003_server_rate_limiting.sql` | RPC functions `record_failed_login` and `reset_failed_logins` (server-side brute-force protection) |

> ⚠️ **Migration 003 is required.** Without it, login rate limiting will silently fall back to a graceful error message — the vault still works, but lockouts won't be enforced server-side.

### 2.3 Verify Tables and Functions

**Tables** — go to **"Table Editor"** and confirm you see:
- `user_keys`
- `vault_entries`
- `categories`
- `rate_limits`
- `audit_log`

**RPC Functions** — go to **"Database" → "Functions"** and confirm:
- `record_failed_login`
- `reset_failed_logins`
- `check_rate_limit` (from migration 001)
- `create_default_categories` (from migration 001)

If any are missing, re-run the corresponding migration.

### 2.4 Get Your API Keys

1. **"Settings"** → **"API"**
2. Copy and save both:
   - **Project URL** — `https://xxxxxxxxxxxx.supabase.co`
   - **anon / public key** — long string starting with `eyJ...`

⚠️ Keep the anon key safe — it's public but rate-limited. Never expose the `service_role` key.

### 2.5 Configure Auth Settings

1. **"Authentication"** → **"Providers"** → confirm **Email** is enabled
2. **"Authentication"** → **"Settings"**:
   - **Enable email confirmations:** your choice (disable for faster MVP)
   - **Secure password change:** ✅ Enabled
   - **Minimum password length:** `12`
3. Click **"Save"**

✅ Supabase setup complete.

---

## Part 3 — Deploy to Vercel

### 3.1 Import the Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** and select `fard-vault`
3. Click **"Import"**

### 3.2 Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework Preset | **Vite** |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 3.3 Add Environment Variables

> **This step is critical — the app will not work without these.**

Scroll to **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL from Step 2.4 |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key from Step 2.4 |

### 3.4 Deploy

Click **"Deploy"** and wait ~2–3 minutes.

✅ You should see: **"Deployment Ready"**  
🎉 Your vault is live at: `https://fard-vault-xxxx.vercel.app`

---

## Part 4 — Verify the Deployment

### 4.1 Run the Connection Test

Visit `https://your-url.vercel.app/test.html` and run each button in order:

1. **Test Connection** — should confirm Supabase is reachable
2. **Test Auth** — should confirm auth is configured
3. **Test Tables** — should confirm all 5 tables exist and the rate-limiting RPC functions are present
4. **Test Registration** — should confirm insert permissions work

> 🗑️ `test.html` is a development diagnostic tool. You may remove it from production by deleting it from `vite.config.js` inputs before your final deployment.

### 4.2 Create Your First Account

1. Visit your vault URL → click **"Create Account"**
2. Enter email + strong master password (all 5 requirement indicators must go green)
3. Click **"Create Vault"** → should redirect to vault

### 4.3 Smoke Tests

| Test | Expected |
|------|---------|
| Add a password entry | Entry appears in grid with fadeIn animation |
| Toggle password visibility | Password reveals/hides with blur effect |
| Copy to clipboard | "Copied!" notification; clipboard auto-clears in 30 s |
| Paste a `javascript:` URL | Saved but rendered as plain text, not a link |
| Lock vault | Redirects to login, sessionStorage cleared |
| Enter wrong password 5× | Login locked for 15 minutes (server-side) |
| Clear localStorage / browser data | Lockout still enforced (server holds it) |
| Toggle theme | Switches dark ↔ light, persists on refresh |
| Export (encrypted) | Downloads `.json` file |
| Import the same file | Entries added to vault |
| Breach check | HIBP result shown via notification |
| Health Dashboard | Shows totals, strong/weak/reused counts |

✅ All passing? You're live.

---

## Part 5 — GitHub Actions CI/CD (Automated Deploys)

Every push to `main` will automatically deploy via `.github/workflows/deploy.yml`.

### 5.1 Get Vercel Tokens

1. In Vercel → **"Settings"** → **"Tokens"** → **"Create Token"** → name it `github-actions`
2. Copy the token
3. In Vercel → your project → **"Settings"** → **"General"** → copy **Project ID**
4. In Vercel → **"Settings"** → **"General"** → copy **Team ID** (Org ID)

### 5.2 Add Secrets to GitHub

In your GitHub repo → **"Settings"** → **"Secrets and variables"** → **"Actions"** → **"New repository secret"**:

| Secret name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Token from step 5.1 |
| `VERCEL_PROJECT_ID` | Project ID from step 5.1 |
| `VERCEL_ORG_ID` | Team/Org ID from step 5.1 |
| `VITE_SUPABASE_URL` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

### 5.3 Verify

Push any change to `main`:

```bash
git add .
git commit -m "test: trigger CI"
git push origin main
```

Go to GitHub → **"Actions"** tab — you should see a green workflow run.

---

## Part 6 — Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Vercel project → **"Settings"** → **"Domains"** → enter `vault.yourdomain.com` → **"Add"**

### 6.2 Configure DNS

Vercel will show you the required records. The most common setup:

```
Type:  CNAME
Name:  vault
Value: cname.vercel-dns.com
```

Or for an apex domain:

```
Type:  A
Name:  @
Value: 76.76.21.21
```

### 6.3 Wait for Propagation

Usually 5–30 minutes. Vercel dashboard will show ✅ **"Valid Configuration"** when done. HTTPS is issued automatically.

---

## Part 7 — Post-Deployment Security Checklist

Run through this after every fresh deployment:

- [ ] HTTPS padlock visible in browser address bar
- [ ] `Strict-Transport-Security` header present (check DevTools → Network → response headers)
- [ ] `Content-Security-Policy` header present and does **not** contain `unsafe-eval`
- [ ] `X-Frame-Options: DENY` present
- [ ] Environment variables set in Vercel (not hardcoded in source)
- [ ] All 3 SQL migrations ran without errors
- [ ] Rate limiting RPC functions visible in Supabase → Database → Functions
- [ ] Lockout test: 5 wrong passwords → locked for 15 min → clearing localStorage does **not** bypass it
- [ ] `javascript:alert(1)` as a URL → renders as plain text, not a live link
- [ ] No sensitive data logged in browser console during normal use
- [ ] `test.html` removed or restricted if this is a public-facing production vault

---

## Updating the Vault

### Automatic (recommended)

```bash
# Make your changes
git add .
git commit -m "fix: description of change"
git push origin main
# Vercel auto-deploys in ~2 minutes
```

### Manual Redeploy

Vercel dashboard → **"Deployments"** → latest → **"Redeploy"**

---

## Troubleshooting

### "Environment variables not set" on load

- Confirm both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are in Vercel project environment variables
- Trigger a fresh deployment after adding them — existing builds do not pick up new env vars

### "Could not load encryption keys"

- Run `test.html` → "Test Tables" — check that `user_keys` table exists
- Confirm migration 001 ran without errors

### "Rate limiting RPC not found"

- Migration 003 did not run. Open SQL Editor in Supabase, paste `003_server_rate_limiting.sql`, run it
- The vault continues to work — you just lose server-side lockout enforcement until this is fixed

### "violates row-level security policy"

- Migration 002 did not run, or ran with errors. Re-run `002_rls_policies.sql`

### Build fails on Vercel

- Check build logs for the specific error
- Most common cause: missing env vars. Add them in Vercel → Settings → Environment Variables

### Tables missing after running migrations

- You may have run them out of order. Run 001 first (creates tables), then 002 (policies on those tables), then 003 (functions)

### "Cannot decrypt entry"

- The encryption key is derived from the master password + salt. A mismatch (e.g. a different user trying to access the entry) will always fail — this is by design

---

## Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| Supabase database | 500 MB |
| Supabase API | 50,000 MAU |
| Supabase bandwidth | 2 GB/month |
| Vercel bandwidth | 100 GB/month |
| Vercel deployments | 100/day |

Consider upgrading Supabase when you approach 400 MB or 40,000 MAU.

---

## Final File Checklist

Your deployed project should include all of these:

```
fard-vault/
├── index.html                              ✅
├── login.html                              ✅ (server-side rate limiting)
├── register.html                           ✅ (CSP meta tag)
├── vault.html                              ✅ (registry pattern, URL validation, CSP)
├── test.html                               ✅ (updated for RPC check)
├── package.json                            ✅
├── vite.config.js                          ✅
├── vercel.json                             ✅ (HIBP added to connect-src, unsafe-eval removed)
├── .env.example                            ✅
├── .github/workflows/deploy.yml           ✅
└── supabase/migrations/
    ├── 001_initial_schema.sql              ✅
    ├── 002_rls_policies.sql                ✅
    └── 003_server_rate_limiting.sql        ✅ (NEW — server-side lockout RPCs)
```

---

**Made with 🔐 by [mehedyk](https://github.com/mehedyk)**