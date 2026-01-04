# 🔐 Fard Vault

<div align="center">

![Fard Vault](https://img.shields.io/badge/Fard-Vault-39ff14?style=for-the-badge&logo=security&logoColor=white)
![Zero Knowledge](https://img.shields.io/badge/Zero-Knowledge-14532d?style=for-the-badge)
![Client Side](https://img.shields.io/badge/Client--Side-Encryption-0F4037?style=for-the-badge)

**Your secrets. Your control. Zero knowledge.**

*A modern, secure password manager with military-grade encryption that runs entirely in your browser.*

[**🚀 Try Live Demo**](https://fard-vault.vercel.app) | [**📖 Documentation**](#-how-to-use) | [**🎲 Password Generator**](https://pw-generator-fard.netlify.app)

</div>

---

## ✨ What Makes Fard Vault Special?

Fard Vault isn't just another password manager. It's a **zero-knowledge vault** where your data is encrypted on your device before it ever leaves. Not even we can read your passwords.

### 🔒 **Military-Grade Security**
- **Argon2id** key derivation (winner of Password Hashing Competition)
- **AES-256-GCM** authenticated encryption
- **64 MB memory requirement** makes GPU attacks impossibly expensive
- Your master password **never leaves your device**

### ⚡ **Lightning Fast**
- Client-side encryption means instant access
- No server-side processing delays
- Optimized for modern browsers
- Smooth animations and transitions

### 🎨 **Beautiful Interface**
- Clean, modern design inspired by cyberpunk aesthetics
- Dark mode by default (light mode available)
- Responsive design works on all devices
- Intuitive user experience

### 🔗 **Works with Fard Generator**
Seamlessly integrates with [Fard Password Generator](https://pw-generator-fard.netlify.app) for cryptographically secure password generation.

---

## 🚀 Quick Start

### Step 1: Create Your Account
1. Visit [Fard Vault](https://fard-vault.vercel.app)
2. Click **"Create Account"**
3. Enter your email
4. Create a **strong master password** (12+ characters)
   - Mix uppercase, lowercase, numbers, and symbols
   - Make it memorable but unique
   - ⚠️ **Write it down!** We can't recover it if you forget.

### Step 2: Add Your First Password
1. Click **"➕ New Password"**
2. Fill in the details:
   - **Title**: Website or service name (e.g., "Gmail")
   - **Username**: Your email or username
   - **Password**: Your password for that service
   - **URL**: Website address (optional)
   - **Category**: Choose from predefined categories
   - **Notes**: Any additional information
3. Click **"💾 Save"**

### Step 3: Access Your Passwords
- **Search**: Type in the search box to find passwords instantly
- **Filter**: Click categories in the sidebar to filter
- **View**: Click the 👁️ icon to reveal a password
- **Copy**: Click 📋 to copy password to clipboard
- **Edit**: Click ✏️ to modify an entry
- **Delete**: Click 🗑️ to remove an entry

### Step 4: Stay Secure
- Vault **auto-locks** after 15 minutes of inactivity
- Click **"🔒 Lock Vault"** to manually lock
- **Export** your vault regularly for backups
- Use **Fard Generator** to create strong passwords

---

## 💡 How to Use

### 🔑 Managing Passwords

#### Adding a Password
```
1. Click "➕ New Password" in sidebar
2. Fill in the form:
   ├─ Title (required): "Facebook"
   ├─ Username: "john@example.com"
   ├─ Password (required): "••••••••••••"
   ├─ URL: "https://facebook.com"
   ├─ Category: "Social Media"
   └─ Notes: "Personal account"
3. Click "💾 Save"
```

#### Editing a Password
```
1. Find the password entry
2. Click ✏️ (Edit) icon
3. Modify any field
4. Click "💾 Save"
```

#### Deleting a Password
```
1. Find the password entry
2. Click 🗑️ (Delete) icon
3. Confirm deletion
4. Entry is permanently removed
```

#### Copying Passwords
```
1. Find the password entry
2. Click 📋 (Copy) icon
3. Password copied to clipboard
4. Auto-clears after 30 seconds (security feature)
```

---

### 📁 Categories

Organize your passwords into categories:

| Icon | Category | Use For |
|------|----------|---------|
| 🌐 | Social Media | Facebook, Twitter, Instagram, LinkedIn |
| 💳 | Banking | Bank accounts, credit cards, PayPal |
| 📧 | Email | Gmail, Outlook, Yahoo Mail |
| 💼 | Work | Work accounts, corporate tools |
| 🎮 | Gaming | Steam, Epic Games, PlayStation |
| 🛒 | Shopping | Amazon, eBay, online stores |
| 📦 | Other | Everything else |

**To filter by category:**
- Click any category in the sidebar
- Only passwords in that category are shown
- Click "📁 All Passwords" to show all

---

### 🔍 Searching

**Quick Search:**
- Type in the search box at the top
- Searches through titles and usernames
- Results update instantly as you type

**Tips:**
- Search is case-insensitive
- Partial matches work (e.g., "face" finds "Facebook")
- Combine with category filter for precise results

---

### 🎨 Themes

Switch between Dark and Light modes:

**Dark Mode** (default):
- Easy on the eyes
- Perfect for night use
- Cyberpunk green accents

**Light Mode**:
- Clean and professional
- Better for bright environments
- High contrast for readability

**To toggle:** Click 🌙/☀️ icon in top-right corner

---

### 🔒 Security Features

#### Auto-Lock
Your vault automatically locks after **15 minutes** of inactivity:
- Protects against unauthorized access
- Requires master password to unlock
- Encryption key removed from memory

**To manually lock:** Click **"🔒 Lock Vault"** in sidebar

#### Brute Force Protection
Failed login attempts are tracked:
- **5 attempts allowed**
- After 5 failures: **15-minute lockout**
- Counter resets after successful login

#### Session Security
- Master password stored in session only (cleared on lock)
- No persistent storage of credentials
- Encryption key exists only in memory

---

### 📤 Backup & Export

#### Export Your Vault
1. Click **"📤 Export"** button
2. Choose format:
   - **Encrypted JSON**: Safe to store anywhere
   - **Plain JSON**: Only with master password confirmation
3. Download file to safe location
4. Store backup securely (encrypted backups are safe in cloud)

#### Import Your Vault
1. Click **"📥 Import"** (when implemented)
2. Select your backup file
3. Enter master password
4. Vault restored with all entries

**Backup Best Practices:**
- Export vault **monthly**
- Store encrypted backups in multiple locations
- Never share unencrypted exports
- Keep backup file names generic (not "passwords.json")

---

## 🛡️ Security Explained

### What is Zero-Knowledge?

**Zero-knowledge** means we **cannot read your data** even if we wanted to. Here's why:

```
Your Computer                          Our Servers
─────────────                          ───────────
Master Password
     ↓
[Argon2id]  ← 64 MB memory, 4 iterations
     ↓
Encryption Key (256-bit)
     ↓
[AES-256-GCM]  ← Encrypt your passwords
     ↓
Encrypted Blob  ──────────→  Stored encrypted
     ↓                        (unreadable!)
Never sent!
```

**The beauty:** Even if our servers are hacked, your data is useless without your master password.

---

### Encryption Details

#### Argon2id (Key Derivation)
- **Winner** of Password Hashing Competition 2015
- **Memory-hard**: Requires 64 MB RAM per attempt
- **Time-hard**: Takes ~500-1000ms per attempt
- **GPU-resistant**: Expensive to crack even with specialized hardware

**Cost to crack:** With a strong master password, it would cost **millions of dollars** to brute force even with GPU farms.

#### AES-256-GCM (Encryption)
- **Military-grade**: Used by governments worldwide
- **256-bit key**: 2²⁵⁶ possible keys (more than atoms in universe)
- **Authenticated**: Detects any tampering attempts
- **Unique IVs**: Each password encrypted with different initialization vector

**Breaking AES-256:** Would take billions of years with current technology.

---

### What We Store

| Data | Encrypted? | Why? |
|------|-----------|------|
| Master password | ❌ Never sent | Used locally to derive encryption key |
| Encryption key | ❌ Never stored | Generated on-the-fly from master password |
| Your passwords | ✅ Yes | Encrypted with AES-256-GCM |
| Titles & usernames | ✅ Yes | Part of encrypted blob |
| URLs & notes | ✅ Yes | Part of encrypted blob |
| Categories | ❌ No | Needed for filtering (not sensitive) |
| Email | ❌ No | For account identification only |
| Salt | ❌ No | Public value, needed for key derivation |

**Bottom line:** We only store encrypted blobs. Everything sensitive is encrypted on your device.

---

## ⚠️ Important Notes

### Master Password

Your master password is the **ONLY** way to decrypt your vault:

✅ **DO:**
- Make it **strong** (12+ characters, mixed case, numbers, symbols)
- Make it **memorable** (use a passphrase method)
- **Write it down** and store physically in a safe place
- Use **Fard Generator** to create it

❌ **DON'T:**
- Reuse a password from another service
- Share it with anyone
- Store it digitally (notes app, email, etc.)
- Use common phrases or patterns

### If You Forget Your Master Password

**We CANNOT recover it.** This is by design for security.

**Options:**
1. If you have a backup, start fresh with new account
2. No backup? Your vault is permanently inaccessible
3. This is why **regular backups** are crucial

---

## 🎯 Best Practices

### Creating Strong Passwords

**Use Fard Generator:**
1. Click the link to [Fard Password Generator](https://pw-generator-fard.netlify.app)
2. Adjust settings:
   - Length: 16+ characters recommended
   - Include: All character types
   - Exclude: Similar characters (optional)
3. Generate and copy to vault

**Manual Creation (Passphrase Method):**
```
Bad:  password123
Okay: MyDog2024!
Good: CorrectHorseBatteryStaple!
Best: Tr0pical-Mang0-Sunris3-2024!
```

### Password Organization

**Use descriptive titles:**
- ✅ Good: "Gmail Personal", "Facebook Main", "Work Email"
- ❌ Bad: "Account 1", "Email", "Website"

**Add notes for context:**
- Recovery email used
- Security questions answers
- Last password change date
- Special requirements

**Use categories wisely:**
- Keeps vault organized
- Makes searching faster
- Helps identify unused accounts

---

### Regular Maintenance

**Monthly Tasks:**
- Export vault backup
- Review and delete unused accounts
- Update weak passwords
- Check for duplicate passwords

**Yearly Tasks:**
- Change important passwords (banking, email)
- Review access logs (if implemented)
- Update recovery information

---

## 🔗 Integration with Fard Generator

Fard Vault works seamlessly with [Fard Password Generator](https://pw-generator-fard.netlify.app):

### Workflow
```
1. Need new password
   ↓
2. Open Fard Generator
   ↓
3. Customize settings
   ↓
4. Generate password
   ↓
5. Copy to clipboard
   ↓
6. Paste in Fard Vault
   ↓
7. Save with details
```

### Why Use Both?

**Fard Generator:**
- Cryptographically secure random generation
- Customizable (length, character types, exclusions)
- Can include memorable phrases
- Strength indicator

**Fard Vault:**
- Secure storage of generated passwords
- Encrypted backups
- Easy retrieval
- Organized by categories

**Together:** The ultimate password security combo! 🔥

---

## 📱 Device Compatibility

### Desktop Browsers
| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| Opera | 76+ | ✅ Fully supported |

### Mobile Browsers
| Browser | Status |
|---------|--------|
| Chrome Mobile | ✅ Supported |
| Safari iOS | ✅ Supported |
| Firefox Mobile | ✅ Supported |
| Samsung Internet | ✅ Supported |

### Requirements
- JavaScript enabled
- Web Crypto API support
- Modern browser (2021+)
- Internet connection (for initial load and sync)

---

## 🆚 Comparison with Other Password Managers

| Feature | Fard Vault | LastPass | 1Password | Bitwarden |
|---------|-----------|----------|-----------|-----------|
| **Zero-Knowledge** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Client-Side Encryption** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Open Architecture** | ✅ Verifiable | ❌ Closed | ❌ Closed | ✅ Open Source |
| **Cost** | 💰 Free | 💰 $36/year | 💰 $36/year | 💰 Free/$10/year |
| **Argon2id** | ✅ Yes | ❌ PBKDF2 | ✅ Yes | ✅ Yes |
| **No Ads** | ✅ Yes | ❌ Free tier has ads | ✅ Yes | ✅ Yes |
| **Modern UI** | ✅ Yes | ⚠️ Dated | ✅ Yes | ⚠️ Functional |
| **Works with Fard** | ✅ Yes | ❌ No | ❌ No | ❌ No |

---

## 💬 FAQ

### Is Fard Vault really free?
**Yes!** Completely free with no hidden fees, ads, or limitations.

### Can you see my passwords?
**No!** Zero-knowledge architecture means we only store encrypted blobs. Without your master password, your data is unreadable.

### What if I forget my master password?
**Your vault becomes inaccessible.** This is by design for security. Always keep backups and write down your master password.

### Can I use it offline?
**Partially.** After initial load, the app works offline. However, syncing across devices requires internet.

### Is it safe to store in the cloud?
**Encrypted exports: Yes!** Your encrypted vault can safely be stored in Google Drive, Dropbox, etc. Without your master password, it's useless.

### How is this different from browser password managers?
Browser password managers (Chrome, Firefox) are convenient but less secure:
- Often not encrypted with strong algorithms
- Tied to specific browser
- Less control over your data
- Fard Vault is browser-independent and uses military-grade encryption

### Can I import from other password managers?
**Not yet, but planned!** We're working on importers for LastPass, 1Password, and Chrome.

### What happens if Fard Vault shuts down?
**Your data is yours!** Export your vault anytime. The exported file contains everything. You can even decrypt it manually with the right tools if needed.

---

## 🌟 Tips & Tricks

### Keyboard Shortcuts (Coming Soon!)
- `Ctrl + K` - Focus search
- `Ctrl + N` - New password
- `Ctrl + L` - Lock vault
- `Esc` - Close modal

### Quick Actions
- **Double-click** entry to edit
- **Right-click** for context menu (coming soon)
- **Drag & drop** to reorder (coming soon)

### Power User Features
- Use **search + category** for precise filtering
- Add **tags in notes** for better organization
- Use **URL field** to quick-launch websites
- Export **category-specific** backups (coming soon)

---

## 🚧 Roadmap

### Coming Soon
- 🔍 Advanced search (tags, custom fields)
- 📱 Mobile apps (iOS & Android)
- 🔐 TOTP 2FA support
- 📊 Password health dashboard
- 👥 Secure sharing
- 🔔 Breach monitoring
- 📥 Import from other password managers

### Future Plans
- 🌐 Browser extensions (Chrome, Firefox)
- 💻 Desktop apps (Windows, macOS, Linux)
- 🔑 Hardware key support (YubiKey)
- 👨‍👩‍👧 Family plans
- 🏢 Enterprise features

---

## 🤝 Community & Support

### Need Help?
- 📖 Read this documentation thoroughly
- 💬 Check [GitHub Discussions](https://github.com/mehedyk/Fard-Vault/discussions)
- 🐛 Report bugs via [GitHub Issues](https://github.com/mehedyk/Fard-Vault/issues)
- 📧 Email: support@fardvault.com (coming soon)

### Contributing
Found a bug? Have a feature idea? Want to contribute?
- Open an issue on GitHub
- Submit a pull request
- Share Fard Vault with friends!

### Stay Updated
- ⭐ Star the repo on GitHub
- 🐦 Follow [@mehedyk](https://twitter.com/mehedyk) on Twitter
- 📰 Subscribe to updates (coming soon)

---

## 📜 Legal

### Privacy
- We don't track you
- We don't sell your data
- We can't read your passwords
- We only store encrypted blobs

### License
All rights reserved. © 2026 [@mehedyk](https://github.com/mehedyk)

### Disclaimer
While we use military-grade encryption and follow best practices, no system is 100% secure. Always:
- Use strong master passwords
- Keep backups
- Don't share credentials
- Use two-factor authentication where available

---

## ❤️ Credits

**Built with:**
- [Argon2](https://github.com/P-H-C/phc-winner-argon2) - Key derivation
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Encryption
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Font
- [Vercel](https://vercel.com) - Hosting

**Special Thanks:**
- Password Hashing Competition for Argon2
- The open-source community
- Early beta testers
- You, for using Fard Vault! 🎉

---

## 🚀 Get Started Now

Ready to secure your digital life?

**[Create Your Vault →](https://fard-vault.vercel.app)**

Or generate a strong master password first:

**[Use Fard Generator →](https://pw-generator-fard.netlify.app)**

---

<div align="center">

**Made by [@mehedyk](https://github.com/mehedyk)**

*Securing passwords, one vault at a time.*

[GitHub](https://github.com/mehedyk) • [Twitter](https://twitter.com/mehedyk) • [Website](https://fard-vault.vercel.app)

</div>