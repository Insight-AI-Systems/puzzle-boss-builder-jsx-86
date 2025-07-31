/**
 * Enhanced Security Headers Configuration
 * Implements comprehensive security headers based on OWASP best practices
 */

// Content Security Policy with enhanced protection
export const getSecureContentSecurityPolicy = () => {
  return {
    'Content-Security-Policy': 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://storage.googleapis.com https://www.gstatic.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: blob: https://storage.googleapis.com https://images.unsplash.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.clerk.com; " +
      "frame-src 'self' https://js.clerk.com; " +
      "worker-src 'self' blob:; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "frame-ancestors 'none'; " +
      "manifest-src 'self'; " +
      "media-src 'self' blob:; " +
      "block-all-mixed-content; " +
      "upgrade-insecure-requests;"
  };
};

// Enhanced CORS Configuration with proper security
export const getSecureCorsConfig = () => {
  const allowedOrigins = process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173', 'https://loving-husky-78.lovableproject.com']
    : ['https://www.thepuzzleboss.com', 'https://thepuzzleboss.com'];

  return {
    'Access-Control-Allow-Origin': allowedOrigins.join(', '),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
    'Access-Control-Expose-Headers': 'X-RateLimit-Remaining, X-RateLimit-Limit'
  };
};

// Enhanced Security Headers with additional protection
export const getEnhancedSecurityHeaders = () => {
  return {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // XSS protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy for privacy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Feature policy to disable dangerous features
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), usb=(), bluetooth=(), payment=()',
    
    // HSTS for HTTPS enforcement
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    
    // Expect-CT for certificate transparency
    'Expect-CT': 'max-age=86400, enforce',
    
    // Cross-Origin policies
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin'
  };
};

// Cookie security configuration
export const getSecureCookieConfig = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 60, // 15 minutes for CSRF tokens
    path: '/'
  };
};

// Combined headers for HTTP responses
export const getAllEnhancedSecurityHeaders = () => {
  return {
    ...getSecureContentSecurityPolicy(),
    ...getSecureCorsConfig(),
    ...getEnhancedSecurityHeaders()
  };
};

// Rate limiting headers
export const getRateLimitHeaders = (limit: number, remaining: number, resetTime: number) => {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString()
  };
};