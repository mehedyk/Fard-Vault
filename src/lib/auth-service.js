/**
 * Clerk Authentication Service
 * Manages identity, session tokens, and sign in / sign up flows.
 */

class AuthService {
  constructor() {
    this.clerk = null;
    this.publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
    this.isInitialized = false;
    this.mockUser = null;
  }

  async init() {
    if (this.isInitialized) return this.clerk;

    if (this.publishableKey && this.publishableKey.startsWith('pk_')) {
      try {
        // Load Clerk JS from CDN or npm package if not already on window
        if (!window.Clerk) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (window.Clerk) {
          this.clerk = window.Clerk;
          await this.clerk.load({
            publishableKey: this.publishableKey
          });
          this.isInitialized = true;
          return this.clerk;
        }
      } catch (err) {
        console.warn('Clerk initialization warning:', err);
      }
    }

    // Dev/Offline Mode fallback
    console.info('Running in Local Dev / Demo mode (configure VITE_CLERK_PUBLISHABLE_KEY for live Clerk auth)');
    this.isInitialized = true;
    const stored = localStorage.getItem('fard_vault_local_user');
    if (stored) {
      try { this.mockUser = JSON.parse(stored); } catch (e) {}
    }
    return null;
  }

  getUser() {
    if (this.clerk && this.clerk.user) {
      return {
        id: this.clerk.user.id,
        email: this.clerk.user.primaryEmailAddress?.emailAddress || '',
        name: this.clerk.user.fullName || this.clerk.user.firstName || 'User'
      };
    }
    if (this.mockUser) {
      return this.mockUser;
    }
    return null;
  }

  async getToken() {
    if (this.clerk && this.clerk.session) {
      return await this.clerk.session.getToken();
    }
    if (this.mockUser) {
      // Local dev token
      return `dev-token-${this.mockUser.id}`;
    }
    return null;
  }

  async signInWithEmail(email) {
    if (this.clerk) {
      // We can use Clerk's signIn or redirect
      // For customized headless experience:
      return await this.clerk.client.signIn.create({
        identifier: email
      });
    }

    // Local dev mode
    this.mockUser = {
      id: 'local_user_' + btoa(email).replace(/=/g, '').toLowerCase().slice(0, 12),
      email: email,
      name: email.split('@')[0]
    };
    localStorage.setItem('fard_vault_local_user', JSON.stringify(this.mockUser));
    return { status: 'complete', user: this.mockUser };
  }

  async signUpWithEmail(email) {
    if (this.clerk) {
      return await this.clerk.client.signUp.create({
        emailAddress: email
      });
    }

    this.mockUser = {
      id: 'local_user_' + btoa(email).replace(/=/g, '').toLowerCase().slice(0, 12),
      email: email,
      name: email.split('@')[0]
    };
    localStorage.setItem('fard_vault_local_user', JSON.stringify(this.mockUser));
    return { status: 'complete', user: this.mockUser };
  }

  async signOut() {
    sessionStorage.removeItem('master_password');
    sessionStorage.removeItem('encryption_key');
    if (this.clerk) {
      await this.clerk.signOut();
    } else {
      this.mockUser = null;
      localStorage.removeItem('fard_vault_local_user');
    }
  }
}

export const authService = new AuthService();
