# 🚀 Fard Vault Deployment Guide

Complete step-by-step guide to deploy your vault from zero to production.

**Time required:** 15-20 minutes  
**Cost:** $0 (using free tiers)

---

## ✅ Pre-Deployment Checklist

Before starting, make sure you have:

- [ ] GitHub account (free)
- [ ] Supabase account (free tier - [signup](https://supabase.com))
- [ ] Vercel account (free tier - [signup](https://vercel.com))
- [ ] All project files ready

---

## 📋 Part 1: Create GitHub Repository

### Step 1.1: Create Repository on GitHub

1. Go to [https://github.com/new](https://github.com/new)
2. Fill in:
   - **Repository name:** `fard-vault`
   - **Description:** "Zero-knowledge password manager with client-side encryption"
   - **Visibility:** Public or Private (your choice)
   - **Initialize:** ❌ Do NOT check "Add a README"
3. Click **"Create repository"**

### Step 1.2: Push Code to GitHub

Open terminal and run:

```bash
# Navigate to your project folder
cd /path/to/fard-vault

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Fard Vault v1.0"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fard-vault.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Verify:** Go to your GitHub repository - you should see all files

---

## 📋 Part 2: Setup Supabase Backend

### Step 2.1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Organization:** Select or create one
   - **Name:** `fard-vault`
   - **Database Password:** Click "Generate" and **SAVE THIS PASSWORD**
   - **Region:** Choose closest to your users (e.g., `us-east-1`, `eu-west-1`)
   - **Pricing Plan:** Free (up to 500MB database)
4. Click **"Create new project"**
5. ⏳ Wait ~2 minutes for setup

✅ **Verify:** Dashboard should show "Project is live"

### Step 2.2: Run Database Migrations

1. In Supabase Dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**

**First Migration:**
3. Open `supabase/migrations/001_initial_schema.sql` from your project
4. **Copy entire content** (Ctrl+A, Ctrl+C)
5. **Paste** into SQL Editor
6. Click **"Run"** (or press F5)
7. ✅ Should see: "Success. No rows returned"

**Second Migration:**
8. Click **"New query"** again
9. Open `supabase/migrations/002_rls_policies.sql`
10. **Copy entire content**
11. **Paste** into SQL Editor
12. Click **"Run"**
13. ✅ Should see: "Success. No rows returned"

### Step 2.3: Verify Tables Created

1. Click **"Table Editor"** (left sidebar)
2. ✅ You should see these tables:
   - `user_keys`
   - `vault_entries`
   - `categories`
   - `rate_limits`
   - `audit_log`

If tables are missing, re-run the migrations.

### Step 2.4: Get API Keys

1. Click **"Settings"** (left sidebar)
2. Click **"API"**
3. **Copy and save:**
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** Long string starting with `eyJ...`

⚠️ **IMPORTANT:** Save these in a secure note - you'll need them for Vercel!

### Step 2.5: Configure Authentication

1. Click **"Authentication"** (left sidebar)
2. Click **"Providers"**
3. Find **"Email"** provider
4. ✅ Ensure it's **enabled**
5. Click **"Settings"** → **"Auth"**
6. Configure:
   - **Enable email confirmations:** ❌ Disabled (for faster MVP)
   - **Secure password change:** ✅ Enabled
   - **Minimum password length:** `12`
7. Click **"Save"**

✅ **Supabase setup complete!**

---

## 📋 Part 3: Deploy to Vercel

### Step 3.1: Connect GitHub Repository

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Find and select your `fard-vault` repository
4. Click **"Import"**

### Step 3.2: Configure Project

1. **Project Name:** `fard-vault` (or customize)
2. **Framework Preset:** Select **"Vite"**
3. **Root Directory:** Leave as `./` (default)
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Install Command:** `npm install`

### Step 3.3: Add Environment Variables

This is **CRITICAL** - your app won't work without these!

1. Scroll down to **"Environment Variables"**
2. Click **"Add Environment Variable"**

**Variable 1:**
- **Key:** `VITE_SUPABASE_URL`
- **Value:** Paste your Supabase Project URL (from Step 2.4)
- Click **"Add"**

**Variable 2:**
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Paste your Supabase anon public key (from Step 2.4)
- Click **"Add"**

✅ **Verify:** You should see 2 environment variables listed

### Step 3.4: Deploy!

1. Click **"Deploy"** button
2. ⏳ Wait ~2-3 minutes
3. Watch the build logs (exciting! 🚀)
4. ✅ Should see: "Deployment Ready"

### Step 3.5: Get Your Live URL

1. After deployment, you'll see a preview image
2. Your vault is live at: `https://fard-vault-xxxxx.vercel.app`
3. Click **"Visit"** to open

🎉 **CONGRATULATIONS! Your vault is LIVE!**

---

## 📋 Part 4: Test Your Deployment

### Test 4.1: Create First Account

1. Visit your Vercel URL
2. Click **"Create Account"**
3. Enter:
   - **Email:** your-email@example.com
   - **Master Password:** Choose strong password (12+ chars)
   - ✅ All requirements should turn green
4. Click **"Create Vault"**
5. ✅ Should redirect to vault page

### Test 4.2: Add First Password

1. Click **"➕ New Password"**
2. Fill in:
   - **Title:** "Test Entry"
   - **Username:** "test@example.com"
   - **Password:** "TestPassword123!"
   - **Category:** Social Media
3. Click **"💾 Save"**
4. ✅ Should see entry in vault

### Test 4.3: Lock & Unlock

1. Click **"🔒 Lock Vault"** (sidebar)
2. ✅ Should redirect to login
3. Enter your master password
4. Click **"🔓 Unlock Vault"**
5. ✅ Should see your test entry

### Test 4.4: Theme Toggle

1. Click **🌙** (theme toggle)
2. ✅ Should switch to light mode
3. Click **☀️**
4. ✅ Should switch back to dark mode

✅ **All tests passed? You're good to go!**

---

## 📋 Part 5: Custom Domain (Optional)

### Step 5.1: Add Custom Domain

1. In Vercel dashboard, click your project
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `vault.yourdomain.com`
4. Click **"Add"**

### Step 5.2: Configure DNS

Vercel will show you DNS records to add:

**Option A: CNAME (recommended)**
```
Type: CNAME
Name: vault
Value: cname.vercel-dns.com
```

**Option B: A Record**
```
Type: A
Name: vault
Value: 76.76.21.21
```

### Step 5.3: Wait for DNS Propagation

- Usually takes 5-30 minutes
- Check status in Vercel dashboard
- ✅ Should show: "Valid Configuration"

🎉 **Your vault is now at:** `https://vault.yourdomain.com`

---

## 📋 Part 6: Link to Fard Generator (Optional)

If you want to link your password generator:

### Step 6.1: Update Fard Generator

In your Fard generator HTML, add a link:

```html
<a href="https://your-vault-url.vercel.app" 
   target="_blank" 
   class="btn" 
   style="margin-top: 20px;">
  🔐 Save to Fard Vault
</a>
```

### Step 6.2: Update Vault to Link Back

In `vault.html`, add a link to generator:

```html
<a href="https://your-fard-generator-url.vercel.app" 
   target="_blank" 
   class="btn">
  🎲 Generate Password
</a>
```

---

## 🚨 Post-Deployment Security Checklist

After deployment, verify security:

- [ ] HTTPS is enabled (check for padlock 🔒 in browser)
- [ ] Environment variables are set correctly
- [ ] Master password works for encryption/decryption
- [ ] Failed login attempts trigger lockout
- [ ] Session auto-locks after inactivity
- [ ] RLS policies are active (test with multiple accounts)
- [ ] No sensitive data in browser console
- [ ] CSP headers are active (check in DevTools → Network → Headers)

---

## 📊 Monitoring Your Vault

### Vercel Analytics (Free)

1. In Vercel dashboard → **"Analytics"**
2. Enable **"Web Analytics"**
3. See:
   - Page views
   - Performance metrics
   - Error rates

### Supabase Monitoring

1. In Supabase dashboard → **"Database"** → **"Logs"**
2. Monitor:
   - API requests
   - Error logs
   - Slow queries

---

## 🔄 Updating Your Vault

### Method 1: Git Push (Automatic)

```bash
# Make changes to code
nano vault.html  # or any file

# Commit changes
git add .
git commit -m "Update: Added new feature"

# Push to GitHub
git push origin main

# Vercel automatically rebuilds and deploys! 🚀
```

### Method 2: Vercel Dashboard (Manual)

1. Go to Vercel dashboard
2. Click **"Deployments"**
3. Click **"Redeploy"** on latest deployment

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot read encrypted data"

**Cause:** Master password or salt mismatch

**Fix:**
1. Ensure environment variables are correct
2. Re-enter master password carefully
3. Check Argon2id settings match

### Issue 2: "Network error"

**Cause:** Supabase connection issue

**Fix:**
1. Check Supabase project is active
2. Verify API keys in Vercel environment variables
3. Check RLS policies are enabled

### Issue 3: "Build failed on Vercel"

**Cause:** Missing dependencies or env vars

**Fix:**
1. Check `package.json` is correct
2. Verify all environment variables are set
3. Check build logs for specific error

### Issue 4: "Rate limit exceeded"

**Cause:** Too many API calls

**Fix:**
1. Check for infinite loops in code
2. Verify rate limiting is working
3. Contact Supabase support if persistent

---

## 📈 Scaling Your Vault

### Free Tier Limits

**Supabase Free:**
- 500 MB database
- 2 GB bandwidth/month
- 50K monthly active users

**Vercel Free:**
- 100 GB bandwidth/month
- 100 deployments/day
- Unlimited static hosting

### When to Upgrade

Consider upgrading when you hit:
- 500+ users
- 400+ MB database usage
- Need custom domain on Supabase
- Want better performance

---

## ✅ Final Checklist

- [ ] GitHub repository created and pushed
- [ ] Supabase project created
- [ ] Database migrations run successfully
- [ ] API keys copied and saved
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Test account created
- [ ] Test password added and retrieved
- [ ] Lock/unlock tested
- [ ] HTTPS verified
- [ ] Custom domain configured (optional)

---

## 🎉 You're Done!

Your zero-knowledge password vault is now:
- ✅ Live and accessible
- ✅ Secured with Argon2id + AES-256-GCM
- ✅ Protected with rate limiting and brute force prevention
- ✅ Automatically deployed on every Git push

**Share your vault URL:**
`https://fard-vault-xxxxx.vercel.app`

---

## 📞 Need Help?

- **GitHub Issues:** [Report bugs](https://github.com/YOUR_USERNAME/fard-vault/issues)
- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)

---

**Made with 🔐 by [mehedyk](https://github.com/mehedyk)**