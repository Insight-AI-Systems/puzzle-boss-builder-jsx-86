/**
 * Security Configuration
 * Centralized security settings and environment variables
 */

// Environment variables - NO HARDCODED VALUES FOR SECURITY
export const SECURITY_CONFIG = {
  // Supabase Configuration - MUST be set in environment
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  
  // Clerk Configuration
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "",
  
  // Security Headers
  CONTENT_SECURITY_POLICY: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "https://storage.googleapis.com"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https://storage.googleapis.com", "https://*.supabase.co"],
    'connect-src': ["'self'", "https://*.supabase.co", "https://*.clerk.accounts.dev"],
    'frame-src': ["'self'"],
    'font-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  },
  
  // Rate Limiting
  RATE_LIMITS: {
    AUTH_ATTEMPTS: 5,
    AUTH_WINDOW_MINUTES: 15,
    API_REQUESTS_PER_MINUTE: 100,
    PASSWORD_RESET_ATTEMPTS: 3,
    PASSWORD_RESET_WINDOW_MINUTES: 60,
  },
  
  // Session Security
  SESSION: {
    MAX_AGE_MINUTES: 1440, // 24 hours
    REFRESH_THRESHOLD_MINUTES: 60, // Refresh if expires within 1 hour
    SUSPICIOUS_ACTIVITY_THRESHOLD: 10, // Flagged actions per hour
  },
  
  // Input Validation
  VALIDATION: {
    MAX_INPUT_LENGTH: 10000,
    MAX_FILE_SIZE_MB: 10,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_FILE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  }
};

// Validate required environment variables
export const validateEnvironment = (): string[] => {
  const errors: string[] = [];
  
  if (!SECURITY_CONFIG.SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is required - set in environment variables');
  }
  
  if (!SECURITY_CONFIG.SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is required - set in environment variables');
  }
  
  if (!SECURITY_CONFIG.CLERK_PUBLISHABLE_KEY) {
    errors.push('VITE_CLERK_PUBLISHABLE_KEY is required - set in environment variables');
  }
  
  if (errors.length > 0) {
    console.error('❌ Security Configuration Errors:', errors);
    throw new Error('Missing required environment variables. Check console for details.');
  }
  
  return errors;
};

// Security headers for fetch requests
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
};