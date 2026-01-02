# 🔐 Fard Vault

> **Zero-knowledge password manager with client-side encryption**  
> Your secrets. Your control. Zero knowledge.

A secure, client-side encrypted password vault built with **Argon2id** key derivation and **AES-256-GCM** encryption. Compatible with [Fard Password Generator](https://github.com/mehedyk/fard).

---

## 🚀 Quick Deploy (GitHub → Vercel)

### Prerequisites
- GitHub account
- Supabase account (free tier)
- Vercel account (free tier)

### Step 1: Fork/Clone This Repository

```bash
# Option A: Fork on GitHub (recommended)
1. Click "Fork" button on GitHub
2. Clone your fork:
   git clone https://github.com/YOUR_USERNAME/fard-vault.git
   cd fard-vault

# Option B: Start fresh
mkdir fard-vault
cd fard-vault
git init
# Then copy all files from this project
```

### Step 2: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `fard-vault`
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to you
4. Wait ~2 minutes for project setup

### Step 3: Run Database Migrations

1. In Supabase Dashboard → **SQL Editor**
2. Copy entire content from `supabase/migrations/001_initial_schema.sql`
3. **Paste and Run**
4. Copy entire content from `supabase/migrations/002_rls_policies.sql`
5. **Paste and Run**
6. Verify: Go to **Table Editor** → Should see tables: `user_keys`, `vault_entries`, `categories`, etc.

### Step 4: Get Supabase API Keys

1. Supabase Dashboard → **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### Step 5: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Fard Vault"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/fard-vault.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 6: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import Git Repository** → Select `fard-vault`
4. **Configure Project:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables** → Add:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxx
   ```
6. Click **"Deploy"**
7. Wait ~2 minutes ⏳

### Step 7: Access Your Vault 🎉

Your vault is now live at: `https://fard-vault.vercel.app` (or your custom domain)

**First user registration:**
1. Click **"Create Account"**
2. Enter email and strong master password (min 12 chars)
3. Start adding passwords!

---

## 🏗️ Architecture

### Zero-Knowledge Encryption Flow

```
┌─────────────────────────────────────┐
│         USER'S BROWSER              │
├─────────────────────────────────────┤
│  Master Password                    │
│         ↓                           │
│  Argon2id (64MB, 4 iterations)     │
│         ↓                           │
│  256-bit Encryption Key             │
│         ↓                           │
│  AES-256-GCM Encryption             │
│         ↓                           │
│  Encrypted Blob + IV                │
└─────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────┐
│         SUPABASE                    │
├─────────────────────────────────────┤
│  ✅ Stores encrypted data           │
│  ❌ Cannot decrypt (no key)         │
│  ❌ Cannot derive key (no password) │
└─────────────────────────────────────┘
```

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Supabase (PostgreSQL) | Database + Auth + RLS |
| **Key Derivation** | Argon2id | Master password → encryption key |
| **Encryption** | AES-256-GCM | Symmetric encryption |
| **Frontend** | Vanilla JS + HTML/CSS | No framework bloat |
| **Deployment** | Vercel | Static hosting |
| **CDN** | Cloudflare (via Supabase) | DDoS protection |

---

## 🔒 Security Features

### Encryption
- ✅ **Argon2id** - Memory-hard key derivation (64MB, 4 iterations)
- ✅ **AES-256-GCM** - Authenticated encryption with 256-bit keys
- ✅ **Random IVs** - Unique initialization vector per entry
- ✅ **Client-side only** - Master password never sent to server

### Protection
- ✅ **Bot detection** - Honeypot fields + behavior analysis
- ✅ **Rate limiting** - Supabase + client-side limits
- ✅ **Brute force protection** - 5 failed attempts = 15 min lockout
- ✅ **CSRF protection** - Token-based validation
- ✅ **XSS prevention** - CSP headers + input sanitization
- ✅ **Session management** - Auto-lock after 15 min inactivity
- ✅ **RLS policies** - Row-level security in database

### Compliance
- ✅ **Zero-knowledge** - We cannot read your data
- ✅ **HTTPS only** - Enforced with HSTS
- ✅ **No tracking** - No analytics, no cookies
- ✅ **Open source** - Auditable code

---

## 🎨 Features

### Core
- 📝 Add/Edit/Delete password entries
- 🔍 Search and filter by category
- 👁️ Show/hide passwords
- 📋 Copy to clipboard (auto-clear)
- 🎨 Dark/Light theme
- 📱 Responsive design

### Categories
- 🌐 Social Media
- 💳 Banking
- 📧 Email
- 💼 Work
- 🎮 Gaming
- 🛒 Shopping
- 📦 Other (custom)

### Security
- 🔒 Auto-lock after inactivity
- 🚨 Failed login attempt tracking
- ⏱️ Session timeout warnings
- 🛡️ Password strength indicator
- 🔐 Argon2id + AES-256-GCM

### Import/Export
- 📤 Export encrypted vault (JSON)
- 📥 Import from backup
- ⚠️ Export plaintext (with confirmation)

---

## 🛠️ Local Development (Optional)

If you want to test locally before deploying:

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/fard-vault.git
cd fard-vault

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Edit .env with your Supabase keys
nano .env  # or use any text editor

# 5. Start development server
npm run dev

# 6. Open browser
# Visit: http://localhost:5173
```

---

## 📊 Database Schema

### Tables

#### `user_keys`
Stores salt for Argon2id key derivation (per user).

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- salt (text, base64 encoded 16 bytes)
- created_at (timestamp)
```

#### `vault_entries`
Stores encrypted password entries.

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- encrypted_data (text, base64 AES-256-GCM encrypted JSON)
- iv (text, base64 initialization vector)
- auth_tag (text, base64 authentication tag)
- category (text, e.g., 'social', 'banking')
- favorite (boolean)
- created_at, updated_at, last_accessed (timestamps)
```

#### `categories`
User-defined categories.

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- name (text)
- icon (text, emoji)
- color (text, hex)
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file (or set in Vercel dashboard):

```env
# Required
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxx

# Optional (defaults provided)
VITE_SESSION_TIMEOUT=900000       # 15 minutes
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_DURATION=900000      # 15 minutes
VITE_ARGON2_TIME=4
VITE_ARGON2_MEMORY=65536          # 64 MB
VITE_ARGON2_PARALLELISM=4
```

### Supabase Auth Settings

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. **Email Auth** settings:
   - Confirm email: **Disabled** (for MVP)
   - Secure password: **Enabled**
   - Minimum password length: **12**

---

## 🚨 Important Security Notes

### Master Password

⚠️ **CRITICAL:** Your master password is the ONLY way to decrypt your data.

- ✅ Choose a strong, unique password (12+ characters)
- ✅ Use uppercase, lowercase, numbers, symbols
- ✅ Write it down and store securely
- ❌ We CANNOT recover lost passwords
- ❌ If you lose it, your data is gone forever

### Best Practices

1. **Use a strong master password** - This is your only key
2. **Export backups regularly** - Keep encrypted copies safe
3. **Don't share your master password** - Not even with support
4. **Enable 2FA on your email** - Protects account access
5. **Use unique passwords** - Never reuse across sites

---

## 📱 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Opera | 76+ | ✅ Full support |

**Requirements:**
- Web Crypto API support
- IndexedDB support
- ES6+ JavaScript

---

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- ✅ Check environment variables are set correctly
- ✅ Verify Supabase project is active
- ✅ Check Supabase API keys are valid

### "Failed to decrypt entry"
- ✅ Ensure master password is correct
- ✅ Check if Argon2id settings match
- ✅ Verify database has correct salt

### "Account locked"
- ⏱️ Wait 15 minutes after 5 failed login attempts
- ✅ Clear browser localStorage if persistent

### Build fails on Vercel
- ✅ Check all environment variables are set
- ✅ Verify `package.json` dependencies
- ✅ Ensure Node.js version is 18+

---

## 🤝 Contributing

This is a personal project by [@mehedyk](https://github.com/mehedyk). 

**All rights reserved.** Do not reuse without explicit permission.

For bug reports or feature requests, please open an issue.

---

## 📄 License

**All Rights Reserved**

© 2024 [@mehedyk](https://github.com/mehedyk). All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.

---

## 🔗 Related Projects

- **[Fard Password Generator](https://github.com/mehedyk/fard)** - Cryptographically secure password generator
- Works seamlessly with Fard Vault

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/fard-vault/issues)
- **Email:** your-email@example.com
- **Twitter:** [@mehedyk](https://twitter.com/mehedyk)

---

## ✨ Credits

Built with:
- [Supabase](https://supabase.com) - Backend infrastructure
- [Argon2](https://github.com/P-H-C/phc-winner-argon2) - Key derivation
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Encryption
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Font
- [Vercel](https://vercel.com) - Deployment

---

**Made with 🔐 by [@mehedyk](https://github.com/mehedyk)**

*Securing passwords, one vault at a time.*