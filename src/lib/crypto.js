/**
 * Fard Vault - Client-Side Cryptographic Engine
 * Zero-Knowledge Architecture
 * 
 * - Argon2id for key derivation (4 iterations, 64MB memory, 4 parallelism, 32 bytes)
 * - AES-256-GCM for encryption/decryption with fresh 12-byte random IV
 * - Master password NEVER leaves browser memory
 */

// Generate 16 bytes of cryptographically secure random salt
export function generateSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

// Convert base64 string to Uint8Array
export function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

// Convert Uint8Array to base64 string
export function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

// Derive AES-256 encryption key using Argon2id
export async function deriveKey(password, saltBase64) {
  if (typeof window.argon2 === 'undefined') {
    throw new Error('Argon2 library is not loaded');
  }

  const saltBytes = typeof saltBase64 === 'string' ? base64ToBytes(saltBase64) : saltBase64;

  const result = await window.argon2.hash({
    pass: password,
    salt: saltBytes,
    time: 4,
    mem: 65536,
    hashLen: 32,
    parallelism: 4,
    type: window.argon2.ArgonType.Argon2id
  });

  return result.hash;
}

// Encrypt arbitrary JavaScript object using AES-256-GCM
export async function encryptData(data, rawKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );

  return {
    encrypted_data: bytesToBase64(new Uint8Array(encryptedBuffer)),
    iv: bytesToBase64(iv)
  };
}

// Decrypt ciphertext using AES-256-GCM
export async function decryptData(encryptedBase64, ivBase64, rawKey) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const encryptedBytes = base64ToBytes(encryptedBase64);
  const ivBytes = base64ToBytes(ivBase64);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    cryptoKey,
    encryptedBytes
  );

  return JSON.parse(new TextDecoder().decode(decryptedBuffer));
}

// Safe URL validator to prevent XSS via javascript: or data: URLs
export function isSafeUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
