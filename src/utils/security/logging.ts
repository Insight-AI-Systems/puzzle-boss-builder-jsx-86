
/**
 * Security Logging Utilities
 * Provides functions to log security events
 */

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE = 'SIGNUP_FAILURE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  LOGOUT = 'LOGOUT'
}

interface SecurityLogEvent {
  eventType: SecurityEventType;
  timestamp: string;
  userId?: string;
  email?: string; // Store partial email for privacy
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// Mask sensitive information like email addresses
const maskEmail = (email: string): string => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!username || !domain) return '';
  
  const maskedUsername = username.length <= 3 
    ? username.charAt(0) + '***' 
    : username.substring(0, 3) + '***';
  
  return `${maskedUsername}@${domain}`;
};

// Log security event to the console in development
// In production, this would send to a logging service
export const logSecurityEvent = (event: Omit<SecurityLogEvent, 'timestamp'>): void => {
  const fullEvent: SecurityLogEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    email: event.email ? maskEmail(event.email) : undefined
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    const logStyle = getLogStyle(event.severity);
    console[logStyle]('SECURITY EVENT:', fullEvent);
  }
  
  // In production environment, you would send to a logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Add production logging service integration
    // Example: sendToLoggingService(fullEvent);
  }
  
  // Store in local storage for development purposes
  storeSecurityEventLocally(fullEvent);
};

// Helper to determine console log method based on severity
const getLogStyle = (severity: string): 'log' | 'info' | 'warn' | 'error' => {
  switch (severity) {
    case 'info': return 'info';
    case 'warning': return 'warn';
    case 'error': 
    case 'critical': 
      return 'error';
    default: return 'log';
  }
};

// Store security events in local storage (for development/debugging)
const storeSecurityEventLocally = (event: SecurityLogEvent): void => {
  try {
    const existingEvents = JSON.parse(localStorage.getItem('securityEvents') || '[]');
    const updatedEvents = [event, ...existingEvents].slice(0, 100); // Keep last 100 events
    localStorage.setItem('securityEvents', JSON.stringify(updatedEvents));
  } catch (error) {
    console.error('Error storing security event:', error);
  }
};

// Get security events from local storage (for development/debugging)
export const getSecurityEvents = (): SecurityLogEvent[] => {
  try {
    return JSON.parse(localStorage.getItem('securityEvents') || '[]');
  } catch (error) {
    console.error('Error retrieving security events:', error);
    return [];
  }
};

// Clear security events from local storage
export const clearSecurityEvents = (): void => {
  localStorage.removeItem('securityEvents');
};
