# 🔄 Fard Vault Migration Guide: Supabase to MongoDB & Clerk

## Overview
Due to the compromise of the legacy Supabase instance, Fard Vault has transitioned to a modern, decoupled Zero-Knowledge architecture:
- **Authentication & Identity**: [Clerk](https://clerk.com) (handles identity, sessions, MFA, bot protection).
- **Encrypted Vault Storage**: [MongoDB](https://www.mongodb.com/) (stores encrypted AES-256-GCM ciphertexts, IVs, and salts).
- **Zero-Knowledge Core**: Unchanged. Master passwords **never** leave browser memory, and Argon2id key derivation runs 100% client-side.

---

## 🔐 Zero-Knowledge Security Model
Even with Supabase compromised, **all vault entries were encrypted client-side using AES-256-GCM**.
The attacker could only obtain raw ciphertexts and salts, not master passwords or plaintext credentials.

In the new architecture:
1. **Clerk** only knows user identity (email, session tokens). It **never receives the master password**.
2. **MongoDB** stores:
   - `user_salts`: `{ userId, salt }`
   - `vault_entries`: `{ userId, encryptedData, iv, category, favorite }`
3. Neither Clerk nor MongoDB possesses the master password or decryption key.

---

## 🛠️ Step-by-Step Setup

### Step 1: Clerk Setup
1. Create a free account at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Create an application named **Fard Vault**.
3. Under **Configure > API Keys**, copy:
   - **Publishable key** (`pk_test_...` or `pk_live_...`)
   - **Secret key** (`sk_test_...` or `sk_live_...`)

### Step 2: MongoDB Atlas Setup
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user with read/write access.
3. In **Network Access**, whitelist Vercel (`0.0.0.0/0` for serverless or your specific IP ranges).
4. Get your connection URI:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fard_vault?retryWrites=true&w=majority
   MONGODB_DB=fard_vault
   ```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
MONGODB_URI=mongodb+srv://...
MONGODB_DB=fard_vault
```

### Step 4: Run Data Migration Script
To migrate existing entries and salts from Supabase to MongoDB:
```bash
# Set Supabase & MongoDB env variables and run:
node scripts/migrate-from-supabase.js
```
The script safely moves the encrypted records directly into MongoDB.

---

## 🚀 Vercel Deployment
In your Vercel project settings (**Settings > Environment Variables**), set:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `MONGODB_URI`
- `MONGODB_DB`

Vercel will build the Vite frontend and host the serverless functions in `/api/` automatically.
