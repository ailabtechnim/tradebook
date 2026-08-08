// TradeBook Client-Side Security Helpers
//
// NOTE: This is a front-end-only MVP. Passwords are salted & hashed with
// WebCrypto SHA-256 before touching localStorage (never stored in plain
// text). For full production security, replace these helpers and the
// credential registry in AppContext with a real backend auth service.

/** FNV-1a 32-bit hash (hex). Used only as a degraded fallback when
 *  WebCrypto is unavailable (e.g. insecure http:// contexts). */
function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ('0000000' + (h >>> 0).toString(16)).slice(-8);
}

/** Returns true when the WebCrypto SubtleCrypto API is usable. */
export function hasWebCrypto(): boolean {
  return typeof window !== 'undefined' && !!window.crypto?.subtle;
}

/** SHA-256 hex digest via WebCrypto (async). */
async function sha256Hex(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a credential. The result is prefixed with the algorithm tag so
 * hashes can be migrated later: `sha256:<hex>` or `fnv:<hex>`.
 */
export async function hashCredential(input: string): Promise<string> {
  if (hasWebCrypto()) {
    try {
      return `sha256:${await sha256Hex(input)}`;
    } catch {
      // fall through to degraded hash
    }
  }
  return `fnv:${fnv1a(input)}${fnv1a([...input].reverse().join(''))}`;
}

/** Constant-time-ish string comparison (avoids trivial early-exit timing). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Random salt for credential hashing. */
export function randomSalt(): string {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const buf = new Uint8Array(16);
    window.crypto.getRandomValues(buf);
    return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 18)}`;
}

/** Basic email format validation. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Sanitize a user-supplied URL. Only http(s) URLs are allowed;
 * anything else (javascript:, data:, vbscript:...) returns ''.
 */
export function sanitizeUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

/** Keep only digits and a single leading '+' from a phone number. */
export function sanitizePhone(phone: string): string {
  const trimmed = (phone || '').trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/[^\d]/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/** Trim, collapse whitespace and hard-cap input length. */
export function sanitizeText(input: string, maxLength = 300): string {
  return (input || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}
