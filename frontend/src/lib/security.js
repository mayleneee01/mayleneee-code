/**
 * Mayleneee.code — Frontend Security Utilities
 *
 * Client-side input sanitization and validation helpers.
 * NOTE: These are defense-in-depth measures; the backend performs
 * authoritative validation. Never trust client-side checks alone.
 */

// --- Input Sanitization ---

/**
 * Sanitize user input by encoding HTML entities to prevent reflected XSS.
 * This is a supplementary measure to React's built-in JSX escaping.
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Strip all HTML tags from a string.
 */
export function stripTags(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
}

// --- Input Validation ---

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;

// At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'auth.errors.emailRequired' };
  }
  if (email.length > 254) {
    return { valid: false, error: 'auth.errors.emailInvalid' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'auth.errors.emailInvalid' };
  }
  return { valid: true, error: null };
}

export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'auth.errors.usernameRequired' };
  }
  if (username.length < 3) {
    return { valid: false, error: 'auth.errors.usernameTooShort' };
  }
  if (!USERNAME_REGEX.test(username)) {
    return { valid: false, error: 'auth.errors.usernameRequired' };
  }
  return { valid: true, error: null };
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'auth.errors.passwordRequired' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'auth.errors.passwordTooShort' };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return { valid: false, error: 'auth.errors.passwordTooShort' };
  }
  return { valid: true, error: null };
}

export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, error: 'auth.errors.passwordMismatch' };
  }
  return { valid: true, error: null };
}

// --- CSRF Token ---

/**
 * Retrieve the CSRF token from the meta tag inserted by the backend.
 * Used for all state-changing requests (POST, PUT, DELETE, PATCH).
 */
export function getCSRFToken() {
  if (typeof document === 'undefined') return '';
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute('content') : '';
}

// --- Secure Fetch Wrapper ---

/**
 * Wrapper around fetch that automatically includes:
 * - CSRF token for mutating requests
 * - Content-Type header
 * - Credentials for cookie-based auth
 */
export async function secureFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Include CSRF token for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    headers['X-CSRF-Token'] = getCSRFToken();
  }

  return fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'same-origin',
  });
}

// --- Rate Limiting (Client-Side Debounce) ---

/**
 * Simple client-side rate limiter for form submissions.
 * Prevents double-submit within the cooldown period.
 */
export function createSubmitGuard(cooldownMs = 2000) {
  let lastSubmit = 0;

  return {
    canSubmit() {
      const now = Date.now();
      if (now - lastSubmit < cooldownMs) return false;
      lastSubmit = now;
      return true;
    },
    reset() {
      lastSubmit = 0;
    },
  };
}
