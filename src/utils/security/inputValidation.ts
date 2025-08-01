/**
 * Comprehensive Input Validation
 * Server-side style validation with rate limiting
 */

import { SECURITY_CONFIG } from '@/config/security';
import { sanitizeText, sanitizeEmail, sanitizeFilename } from './sanitization-enhanced';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export interface RateLimitResult {
  isAllowed: boolean;
  remainingAttempts: number;
  resetTime: number;
}

/**
 * Rate Limiter for form submissions and API calls
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number; resetTime: number }> = new Map();

  checkRateLimit(key: string, maxAttempts: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const existing = this.attempts.get(key);

    if (!existing) {
      this.attempts.set(key, { count: 1, lastAttempt: now, resetTime: now + windowMs });
      return { isAllowed: true, remainingAttempts: maxAttempts - 1, resetTime: now + windowMs };
    }

    // Reset if window has passed
    if (now > existing.resetTime) {
      this.attempts.set(key, { count: 1, lastAttempt: now, resetTime: now + windowMs });
      return { isAllowed: true, remainingAttempts: maxAttempts - 1, resetTime: now + windowMs };
    }

    // Increment count
    existing.count++;
    existing.lastAttempt = now;

    const isAllowed = existing.count <= maxAttempts;
    const remainingAttempts = Math.max(0, maxAttempts - existing.count);

    return { isAllowed, remainingAttempts, resetTime: existing.resetTime };
  }

  clearRateLimit(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Form Input Validators
 */
export class InputValidator {
  /**
   * Validate email input
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email || typeof email !== 'string') {
      return { isValid: false, errors: ['Email is required'] };
    }

    const sanitized = sanitizeEmail(email);
    
    if (!sanitized) {
      errors.push('Invalid email format');
    }

    if (email.length > 254) {
      errors.push('Email is too long');
    }

    // Check for suspicious patterns
    if (/[<>]/.test(email)) {
      errors.push('Email contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Validate text input with length and content checks
   */
  static validateText(
    text: string, 
    options: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      fieldName?: string;
    } = {}
  ): ValidationResult {
    const { required = false, minLength = 0, maxLength = 1000, pattern, fieldName = 'Field' } = options;
    const errors: string[] = [];

    if (!text || typeof text !== 'string') {
      if (required) {
        errors.push(`${fieldName} is required`);
      }
      return { isValid: !required, errors, sanitizedValue: '' };
    }

    const sanitized = sanitizeText(text);

    if (required && sanitized.trim().length === 0) {
      errors.push(`${fieldName} cannot be empty`);
    }

    if (sanitized.length < minLength) {
      errors.push(`${fieldName} must be at least ${minLength} characters`);
    }

    if (sanitized.length > maxLength) {
      errors.push(`${fieldName} must be no more than ${maxLength} characters`);
    }

    if (pattern && !pattern.test(sanitized)) {
      errors.push(`${fieldName} format is invalid`);
    }

    // Check for suspicious content
    if (/<script|javascript:|on\w+=/i.test(text)) {
      errors.push(`${fieldName} contains potentially dangerous content`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Validate URL input
   */
  static validateUrl(url: string, required = false): ValidationResult {
    const errors: string[] = [];

    if (!url || typeof url !== 'string') {
      if (required) {
        errors.push('URL is required');
      }
      return { isValid: !required, errors, sanitizedValue: '' };
    }

    const trimmed = url.trim();

    try {
      const urlObj = new URL(trimmed);
      
      // Only allow safe protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('URL must use HTTP or HTTPS protocol');
      }

      // Block dangerous URLs
      if (/javascript:|data:|vbscript:/i.test(trimmed)) {
        errors.push('URL contains dangerous protocol');
      }

    } catch {
      errors.push('Invalid URL format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: trimmed
    };
  }

  /**
   * Validate file upload
   */
  static validateFile(
    file: File,
    options: {
      required?: boolean;
      maxSizeMB?: number;
      allowedTypes?: string[];
      allowedExtensions?: string[];
    } = {}
  ): ValidationResult {
    const {
      required = false,
      maxSizeMB = SECURITY_CONFIG.VALIDATION.MAX_FILE_SIZE_MB,
      allowedTypes = SECURITY_CONFIG.VALIDATION.ALLOWED_IMAGE_TYPES,
      allowedExtensions = SECURITY_CONFIG.VALIDATION.ALLOWED_FILE_EXTENSIONS
    } = options;

    const errors: string[] = [];

    if (!file) {
      if (required) {
        errors.push('File is required');
      }
      return { isValid: !required, errors };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} is not allowed`);
    }

    // Sanitize filename
    const sanitizedName = sanitizeFilename(file.name);
    if (!sanitizedName) {
      errors.push('Invalid filename');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: file
    };
  }

  /**
   * Validate numeric input
   */
  static validateNumber(
    value: any,
    options: {
      required?: boolean;
      min?: number;
      max?: number;
      integer?: boolean;
      fieldName?: string;
    } = {}
  ): ValidationResult {
    const { required = false, min, max, integer = false, fieldName = 'Number' } = options;
    const errors: string[] = [];

    if (value === null || value === undefined || value === '') {
      if (required) {
        errors.push(`${fieldName} is required`);
      }
      return { isValid: !required, errors, sanitizedValue: null };
    }

    const num = Number(value);
    
    if (isNaN(num)) {
      errors.push(`${fieldName} must be a valid number`);
      return { isValid: false, errors };
    }

    if (integer && !Number.isInteger(num)) {
      errors.push(`${fieldName} must be a whole number`);
    }

    if (min !== undefined && num < min) {
      errors.push(`${fieldName} must be at least ${min}`);
    }

    if (max !== undefined && num > max) {
      errors.push(`${fieldName} must be no more than ${max}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: num
    };
  }
}

/**
 * Form validation helper
 */
export const validateForm = (data: Record<string, any>, rules: Record<string, any>): {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: Record<string, any>;
} => {
  const errors: Record<string, string[]> = {};
  const sanitizedData: Record<string, any> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    let result: ValidationResult;

    switch (rule.type) {
      case 'email':
        result = InputValidator.validateEmail(value);
        break;
      case 'text':
        result = InputValidator.validateText(value, rule);
        break;
      case 'url':
        result = InputValidator.validateUrl(value, rule.required);
        break;
      case 'number':
        result = InputValidator.validateNumber(value, rule);
        break;
      case 'file':
        result = InputValidator.validateFile(value, rule);
        break;
      default:
        result = { isValid: true, errors: [], sanitizedValue: value };
    }

    if (!result.isValid) {
      errors[field] = result.errors;
    }

    sanitizedData[field] = result.sanitizedValue;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};