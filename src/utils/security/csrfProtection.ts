/**
 * Enhanced CSRF Protection
 * Implements token-based CSRF protection for forms and API calls
 */

import { SECURITY_CONFIG } from '@/config/security';

interface CSRFToken {
  token: string;
  expiresAt: number;
  createdAt: number;
}

class CSRFProtection {
  private readonly STORAGE_KEY = 'csrf_token';
  private readonly TOKEN_LIFETIME = 30 * 60 * 1000; // 30 minutes

  /**
   * Generate a cryptographically secure CSRF token
   */
  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Create and store a new CSRF token
   */
  createToken(): string {
    const token = this.generateToken();
    const now = Date.now();
    
    const csrfData: CSRFToken = {
      token,
      expiresAt: now + this.TOKEN_LIFETIME,
      createdAt: now
    };

    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(csrfData));
    } catch (error) {
      console.warn('Failed to store CSRF token:', error);
    }

    return token;
  }

  /**
   * Get current valid CSRF token (creates new if expired)
   */
  getToken(): string {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return this.createToken();
      }

      const csrfData: CSRFToken = JSON.parse(stored);
      
      // Check if token is expired
      if (Date.now() > csrfData.expiresAt) {
        return this.createToken();
      }

      return csrfData.token;
    } catch (error) {
      console.warn('Error reading CSRF token:', error);
      return this.createToken();
    }
  }

  /**
   * Validate CSRF token
   */
  validateToken(providedToken: string): boolean {
    if (!providedToken || typeof providedToken !== 'string') {
      return false;
    }

    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return false;
      }

      const csrfData: CSRFToken = JSON.parse(stored);
      
      // Check expiration
      if (Date.now() > csrfData.expiresAt) {
        return false;
      }

      // Compare tokens (constant-time comparison to prevent timing attacks)
      return this.constantTimeCompare(providedToken, csrfData.token);
    } catch (error) {
      console.warn('Error validating CSRF token:', error);
      return false;
    }
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  private constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Get CSRF headers for fetch requests
   */
  getHeaders(): Record<string, string> {
    return {
      'X-CSRF-Token': this.getToken(),
      'X-Requested-With': 'XMLHttpRequest'
    };
  }

  /**
   * Clear CSRF token (e.g., on logout)
   */
  clearToken(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Error clearing CSRF token:', error);
    }
  }

  /**
   * Refresh token (generate new one)
   */
  refreshToken(): string {
    this.clearToken();
    return this.createToken();
  }
}

// Singleton instance
export const csrfProtection = new CSRFProtection();

/**
 * React hook for CSRF protection
 */
export const useCSRFProtection = () => {
  const getToken = () => csrfProtection.getToken();
  const getHeaders = () => csrfProtection.getHeaders();
  const validateToken = (token: string) => csrfProtection.validateToken(token);
  const refreshToken = () => csrfProtection.refreshToken();

  return {
    getToken,
    getHeaders,
    validateToken,
    refreshToken
  };
};