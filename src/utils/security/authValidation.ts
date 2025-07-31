/**
 * Enhanced Authentication Validation
 * Implements security measures for authentication processes
 */

import { logSecurityEvent, SecurityEventType } from './logging';

// Enhanced password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  issues: string[];
} => {
  const issues: string[] = [];
  let score = 0;

  // Length check (minimum 12 characters)
  if (password.length < 12) {
    issues.push('Password must be at least 12 characters long');
  } else if (password.length >= 16) {
    score += 2;
  } else {
    score += 1;
  }

  // Character variety checks
  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain lowercase letters');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain uppercase letters');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    issues.push('Password must contain numbers');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('Password must contain special characters');
  } else {
    score += 1;
  }

  // Common pattern checks
  if (/(.)\1{2,}/.test(password)) {
    issues.push('Password should not contain repeated characters');
    score -= 1;
  }

  if (/123|abc|qwe/i.test(password)) {
    issues.push('Password should not contain common sequences');
    score -= 1;
  }

  return {
    isValid: issues.length === 0 && score >= 4,
    score: Math.max(0, score),
    issues
  };
};

// Account lockout management
interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
  ipAddress?: string;
}

const loginAttempts = new Map<string, LoginAttempt[]>();
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

export const recordLoginAttempt = (email: string, success: boolean, ipAddress?: string): void => {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || [];
  
  // Clean old attempts outside the window
  const recentAttempts = attempts.filter(attempt => now - attempt.timestamp < ATTEMPT_WINDOW);
  
  // Add new attempt
  recentAttempts.push({
    email,
    timestamp: now,
    success,
    ipAddress
  });
  
  loginAttempts.set(email, recentAttempts);

  // Log security event
  logSecurityEvent({
    eventType: success ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.LOGIN_FAILURE,
    userId: undefined,
    email,
    ipAddress,
    severity: success ? 'info' : 'warning',
    details: {
      attemptCount: recentAttempts.filter(a => !a.success).length,
      consecutiveFailures: getConsecutiveFailures(recentAttempts)
    }
  });

  // Check for lockout conditions
  const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
  if (failedAttempts.length >= LOCKOUT_THRESHOLD) {
    logSecurityEvent({
      eventType: SecurityEventType.ACCOUNT_LOCKED,
      email,
      ipAddress,
      severity: 'critical',
      details: {
        failedAttempts: failedAttempts.length,
        lockoutDuration: LOCKOUT_DURATION
      }
    });
  }
};

export const isAccountLocked = (email: string): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || [];
  
  // Clean old attempts
  const recentAttempts = attempts.filter(attempt => now - attempt.timestamp < ATTEMPT_WINDOW);
  loginAttempts.set(email, recentAttempts);
  
  const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
  
  if (failedAttempts.length >= LOCKOUT_THRESHOLD) {
    const lastFailure = Math.max(...failedAttempts.map(a => a.timestamp));
    return (now - lastFailure) < LOCKOUT_DURATION;
  }
  
  return false;
};

export const getRemainingLockoutTime = (email: string): number => {
  if (!isAccountLocked(email)) return 0;
  
  const attempts = loginAttempts.get(email) || [];
  const failedAttempts = attempts.filter(attempt => !attempt.success);
  const lastFailure = Math.max(...failedAttempts.map(a => a.timestamp));
  
  return Math.max(0, LOCKOUT_DURATION - (Date.now() - lastFailure));
};

const getConsecutiveFailures = (attempts: LoginAttempt[]): number => {
  let consecutive = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].success) break;
    consecutive++;
  }
  return consecutive;
};

// Session security validation
export const validateSessionSecurity = (sessionData: any): boolean => {
  // Check session age
  const maxAge = 8 * 60 * 60 * 1000; // 8 hours
  if (sessionData.createdAt && Date.now() - sessionData.createdAt > maxAge) {
    return false;
  }

  // Check for suspicious patterns
  if (sessionData.ipAddress && sessionData.lastIpAddress && 
      sessionData.ipAddress !== sessionData.lastIpAddress) {
    logSecurityEvent({
      eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
      userId: sessionData.userId,
      severity: 'warning',
      details: {
        reason: 'IP address change',
        oldIp: sessionData.lastIpAddress,
        newIp: sessionData.ipAddress
      }
    });
  }

  return true;
};

// Email validation with security considerations
export const validateEmailSecurity = (email: string): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  
  // Basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    issues.push('Invalid email format');
  }

  // Check for suspicious patterns
  if (email.includes('..') || email.includes('+')) {
    // These aren't necessarily invalid but could be used for bypassing
    logSecurityEvent({
      eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
      email,
      severity: 'info',
      details: {
        reason: 'Email contains potentially suspicious patterns',
        email
      }
    });
  }

  // Check for disposable email providers (basic list)
  const disposableProviders = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && disposableProviders.includes(domain)) {
    issues.push('Disposable email addresses are not allowed');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};