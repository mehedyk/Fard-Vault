# 🚀 Fard Vault — Deployment Guide (v2.0)

Complete step-by-step guide to deploying Fard Vault with Clerk authentication and MongoDB encrypted storage.

**Time required:** 15–20 minutes  
**Cost:** $0 (Free tiers on Clerk, MongoDB Atlas, and Vercel)

---

## ✅ Pre-Deployment Checklist

Before starting, ensure you have:
- [ ] GitHub account — [signup](https://github.com/signup)
- [ ] Clerk account — [signup](https://dashboard.clerk.com/sign-up)
- [ ] MongoDB Atlas account — [signup](https://www.mongodb.com/cloud/atlas/register)
- [ ] Vercel account — [signup](https://vercel.com/signup)

---

## Part 1 — Clerk Setup (Authentication)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) and click **"Add Application"**.
2. Name it **Fard Vault** and select Email authentication (or Google/GitHub).
3. Navigate to **API Keys** in the sidebar.
4. Copy your keys:
   - `Publishable key` (starts with `pk_test_` or `pk_live_`)
   - `Secret key` (starts with `sk_test_` or `sk_live_`)

---

## Part 2 — MongoDB Atlas Setup (Encrypted Data Store)

1. In [MongoDB Atlas](https://cloud.mongodb.com), create a free **M0 Shared Cluster**.
2. Under **Security > Database Access**, create a user with read and write privileges to the `fard_vault` database.
3. Under **Security > Network Access**, click **"Add IP Address"** and select **"Allow Access from Anywhere"** (`0.0.0.0/0`) for Vercel serverless functions.
4. Click **"Connect"** on your cluster, select **"Drivers"**, and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fard_vault?retryWrites=true&w=majority
   ```

---

## Part 3 — Vercel Deployment

1. Import your GitHub repository into [Vercel](https://vercel.com/new).
2. Framework Preset: **Vite** (auto-detected).
3. Add Environment Variables:
   | Variable | Value |
   |---|---|
   | `VITE_CLERK_PUBLISHABLE_KEY` | Your Clerk publishable key |
   | `CLERK_SECRET_KEY` | Your Clerk secret key |
   | `MONGODB_URI` | Your MongoDB Atlas connection URI |
   | `MONGODB_DB` | `fard_vault` |
   | `VITE_PASSWORD_GENERATOR_URL` | `https://fard-pw.netlify.app/` |
4. Click **Deploy**.

---

## Part 4 — Verification Checklist

- [ ] Visit your deployed Vercel URL (e.g. `https://fard-vault.vercel.app`)
- [ ] Verify favicon and brand logo render the electric lime emblem
- [ ] Click **Create account** and register with email + master password
- [ ] Add a sample password in the vault dashboard
- [ ] Verify entry is encrypted in memory and stored securely
- [ ] Test lock vault and unlock vault flow
- [ ] Run diagnostic checks at `/test.html`
