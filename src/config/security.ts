/**
 * Security Configuration
 * Centralized security settings and environment variables
 */

// Lovable project configuration - hardcoded for deployment
export const SECURITY_CONFIG = {
  // Supabase Configuration - Lovable project values
  SUPABASE_URL: "https://vcacfysfjgoahledqdwa.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWNmeXNmamdvYWhsZWRxZHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MDI3MDgsImV4cCI6MjA1OTk3ODcwOH0.sSWBAAsoofM3b-aLNseRtXhNulg6kaGqXTcXRVd_IWo",
  
  // No Clerk configuration needed - using Supabase only
  
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

// Validate required configuration values
export const validateEnvironment = (): string[] => {
  const errors: string[] = [];
  
  if (!SECURITY_CONFIG.SUPABASE_URL) {
    errors.push('SUPABASE_URL is required in security configuration');
  }
  
  if (!SECURITY_CONFIG.SUPABASE_ANON_KEY) {
    errors.push('SUPABASE_ANON_KEY is required in security configuration');
  }
  
  // Clerk no longer required - using Supabase only
  
  if (errors.length > 0) {
    console.error('❌ Security Configuration Errors:', errors);
    throw new Error('Missing required configuration values. Check console for details.');
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