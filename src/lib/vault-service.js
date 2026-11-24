/**
 * Vault Service - MongoDB Backend API Integration
 * Communicates with /api/keys and /api/vault
 * Maintains seamless offline / local fallback for development
 */

import { authService } from './auth-service.js';

class VaultService {
  async getAuthHeaders() {
    const token = await authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Fetch or retrieve vault salt for user
  async getSalt(userId) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch('/api/keys', { headers });
      if (res.ok) {
        const data = await res.json();
        return data.salt;
      }
    } catch (e) {
      console.warn('API /api/keys not available, checking local storage:', e.message);
    }

    // Local fallback
    const key = `fard_vault_salt_${userId}`;
    return localStorage.getItem(key);
  }

  // Save vault salt for user
  async saveSalt(userId, salt) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers,
        body: JSON.stringify({ salt })
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API /api/keys save failed, falling back to local storage:', e.message);
    }

    // Local fallback
    const key = `fard_vault_salt_${userId}`;
    localStorage.setItem(key, salt);
    return true;
  }

  // Load all encrypted vault entries
  async loadEntries(userId) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch('/api/vault', { headers });
      if (res.ok) {
        const data = await res.json();
        return data.entries || [];
      }
    } catch (e) {
      console.warn('API /api/vault not reachable, checking local storage:', e.message);
    }

    // Local fallback
    const key = `fard_vault_entries_${userId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }

  // Save new encrypted vault entry
  async createEntry(userId, entry) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers,
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        const data = await res.json();
        return data.entry || { id: data.id, ...entry };
      }
    } catch (e) {
      console.warn('API /api/vault POST failed, falling back to local storage:', e.message);
    }

    // Local fallback
    const key = `fard_vault_entries_${userId}`;
    const existing = await this.loadEntries(userId);
    const newEntry = {
      id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...entry
    };
    existing.unshift(newEntry);
    localStorage.setItem(key, JSON.stringify(existing));
    return newEntry;
  }

  // Update existing encrypted vault entry
  async updateEntry(userId, id, updates) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch('/api/vault', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id, ...updates })
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API /api/vault PUT failed, falling back to local storage:', e.message);
    }

    // Local fallback
    const key = `fard_vault_entries_${userId}`;
    const existing = await this.loadEntries(userId);
    const idx = existing.findIndex(e => e.id === id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    }
    return false;
  }

  // Delete encrypted vault entry
  async deleteEntry(userId, id) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`/api/vault?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API /api/vault DELETE failed, falling back to local storage:', e.message);
    }

    // Local fallback
    const key = `fard_vault_entries_${userId}`;
    const existing = await this.loadEntries(userId);
    const filtered = existing.filter(e => e.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  }
}

export const vaultService = new VaultService();
