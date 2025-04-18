
/**
 * Security Headers Configuration
 * Implements recommended security headers based on OWASP best practices
 */

// Content Security Policy
export const getContentSecurityPolicy = () => {
  return {
    'Content-Security-Policy': 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://storage.googleapis.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https://storage.googleapis.com; " +
      "connect-src 'self' https://*.supabase.co; " +
      "frame-src 'self'; " +
      "font-src 'self'; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "frame-ancestors 'none'; " +
      "block-all-mixed-content; " +
      "upgrade-insecure-requests;"
  };
};

// CORS Configuration
export const getCorsConfig = () => {
  return {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
      ? '*' 
      : process.env.VITE_APP_URL || window.location.origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
};

// Standard Security Headers
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
  };
};

// Combined headers for HTTP responses
export const getAllSecurityHeaders = () => {
  return {
    ...getContentSecurityPolicy(),
    ...getCorsConfig(),
    ...getSecurityHeaders()
  };
};
