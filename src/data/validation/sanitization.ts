
import DOMPurify from 'dompurify';
import * as z from 'zod';

// Sanitization configuration
const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false
};

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
}

/**
 * Sanitize plain text input
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/data:/gi, '') // Remove data: URLs
    .substring(0, 10000); // Limit length
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, '') // Only allow word chars, @, ., -
    .substring(0, 320); // RFC limit
}

/**
 * Sanitize username input
 */
export function sanitizeUsername(username: string): string {
  return username
    .trim()
    .replace(/[^\w.-]/g, '') // Only allow word chars, ., -
    .substring(0, 50);
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(value: any): number {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Sanitize boolean input
 */
export function sanitizeBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString().substring(0, 2048);
  } catch {
    return '';
  }
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  return phone
    .replace(/[^\d+\-\s()]/g, '') // Only allow digits, +, -, space, ()
    .trim()
    .substring(0, 20);
}

/**
 * Deep sanitize object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      (sanitized as any)[key] = sanitizeText(value);
    } else if (typeof value === 'number') {
      (sanitized as any)[key] = sanitizeNumber(value);
    } else if (typeof value === 'boolean') {
      (sanitized as any)[key] = sanitizeBoolean(value);
    } else if (Array.isArray(value)) {
      (sanitized as any)[key] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? sanitizeObject(item)
          : typeof item === 'string'
          ? sanitizeText(item)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as any)[key] = sanitizeObject(value);
    } else {
      (sanitized as any)[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Sanitization middleware for form data
 */
export function sanitizeFormData(formData: FormData): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else {
      sanitized[key] = value; // File objects, etc.
    }
  }
  
  return sanitized;
}

/**
 * SQL injection prevention (basic)
 */
export function preventSqlInjection(input: string): string {
  return input
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove /* comments
    .replace(/\*\//g, '') // Remove */ comments
    .replace(/\bUNION\b/gi, '') // Remove UNION
    .replace(/\bSELECT\b/gi, '') // Remove SELECT
    .replace(/\bINSERT\b/gi, '') // Remove INSERT
    .replace(/\bUPDATE\b/gi, '') // Remove UPDATE
    .replace(/\bDELETE\b/gi, '') // Remove DELETE
    .replace(/\bDROP\b/gi, ''); // Remove DROP
}

/**
 * XSS prevention for text content
 */
export function preventXss(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize file upload
 */
export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export function validateFile(
  file: File, 
  options: FileValidationOptions = {}
): { isValid: boolean; error?: string; sanitizedName?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size too large. Maximum ${maxSize / 1024 / 1024}MB allowed.`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
    };
  }

  // Sanitize filename
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .toLowerCase();

  return {
    isValid: true,
    sanitizedName
  };
}

/**
 * Rate limiting data structure
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple rate limiting
 */
export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 100, 
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitStore.set(identifier, newEntry);
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newEntry.resetTime
    };
  }

  // Increment existing entry
  entry.count++;
  
  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto cleanup every 5 minutes
setInterval(cleanupRateLimit, 5 * 60 * 1000);
