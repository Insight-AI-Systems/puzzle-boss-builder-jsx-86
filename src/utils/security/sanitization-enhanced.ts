/**
 * Enhanced Input Sanitization Utilities
 * XSS-safe HTML sanitization using DOMPurify
 */

import DOMPurify from 'dompurify';
import { SECURITY_CONFIG } from '@/config/security';

// Enhanced HTML sanitization configuration
const SANITIZE_CONFIG = {
  // Allowed tags for rich content
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
    'tr', 'td', 'th', 'div', 'span'
  ],
  
  // Allowed attributes
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id'
  ],
  
  // URL protocols allowed in links and images
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string, allowRichContent = true): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const config = allowRichContent ? {
    ALLOWED_TAGS: SANITIZE_CONFIG.ALLOWED_TAGS,
    ALLOWED_ATTR: SANITIZE_CONFIG.ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: SANITIZE_CONFIG.ALLOWED_URI_REGEXP,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
  } : {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: [],
    FORBID_SCRIPT: true,
  };

  return DOMPurify.sanitize(html, config);
};

/**
 * Sanitize plain text input
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .trim()
    .substring(0, SECURITY_CONFIG.VALIDATION.MAX_INPUT_LENGTH)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

/**
 * Sanitize URL to prevent XSS in href attributes
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  const trimmed = url.trim();
  
  // Block dangerous protocols
  if (/^javascript:|^data:|^vbscript:|^file:/i.test(trimmed)) {
    return '';
  }
  
  // Allow relative URLs and safe protocols
  if (/^\/|^https?:|^mailto:|^tel:/i.test(trimmed)) {
    return trimmed;
  }
  
  return '';
};

/**
 * Sanitize filename to prevent directory traversal
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  
  return filename
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Only allow safe characters
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, 255); // Limit length
};

/**
 * Validate and sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailRegex.test(trimmed) ? trimmed : '';
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  score: number;
  issues: string[];
} => {
  const issues: string[] = [];
  let score = 0;
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, score: 0, issues: ['Password is required'] };
  }
  
  if (password.length < 8) {
    issues.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    issues.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('Password must contain at least one special character');
  } else {
    score += 1;
  }
  
  if (password.length >= 12) {
    score += 1;
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /(.)\1{2,}/, // Repeated characters
    /123|abc|qwe/i, // Sequential characters
    /password|admin|user/i, // Common words
  ];
  
  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      issues.push('Password contains weak patterns');
      score = Math.max(0, score - 1);
      break;
    }
  }
  
  return {
    isValid: issues.length === 0 && score >= 4,
    score,
    issues
  };
};