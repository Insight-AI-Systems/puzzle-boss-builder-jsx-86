
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '@/infrastructure/errors/ValidationError';
import { sanitizeObject, deepSanitize } from './sanitization';

/**
 * Validation middleware for API calls and form submissions
 */

// Request validation middleware type
export type ValidationMiddleware<T = any> = (data: unknown) => Promise<T>;

// Create validation middleware from Zod schema
export const createValidationMiddleware = <T>(
  schema: ZodSchema<T>,
  sanitize: boolean = true
): ValidationMiddleware<T> => {
  return async (data: unknown): Promise<T> => {
    try {
      // Sanitize input if requested
      const processedData = sanitize ? deepSanitize(data) : data;
      
      // Validate with Zod schema
      return schema.parse(processedData);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          `Validation failed: ${error.errors.map(e => e.message).join(', ')}`,
          'VALIDATION_FAILED',
          error.errors[0]?.path?.join('.'),
          'medium',
          true,
          error.errors[0]?.message,
          { zodErrors: error.errors }
        );
      }
      throw error;
    }
  };
};

// Batch validation for multiple fields
export const validateFields = async <T extends Record<string, any>>(
  data: T,
  fieldValidators: Partial<Record<keyof T, ValidationMiddleware>>,
  sanitizeFields: boolean = true
): Promise<T> => {
  const results: Partial<T> = {};
  const errors: string[] = [];

  // Sanitize if requested
  const processedData = sanitizeFields ? sanitizeObject(data) : data;

  // Validate each field
  for (const [field, validator] of Object.entries(fieldValidators)) {
    if (validator && field in processedData) {
      try {
        results[field as keyof T] = await validator(processedData[field as keyof T]);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`${field}: ${error.userMessage}`);
        } else {
          errors.push(`${field}: Validation failed`);
        }
      }
    } else if (field in processedData) {
      results[field as keyof T] = processedData[field as keyof T];
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(
      `Field validation failed: ${errors.join(', ')}`,
      'FIELD_VALIDATION_FAILED',
      undefined,
      'medium',
      true,
      errors.join(', ')
    );
  }

  return { ...processedData, ...results };
};

// File validation middleware
export const validateFile = (
  allowedTypes: string[],
  maxSize: number = 10 * 1024 * 1024, // 10MB default
  required: boolean = true
) => {
  return async (file: File | null): Promise<File | null> => {
    if (!file) {
      if (required) {
        throw new ValidationError(
          'File is required',
          'FILE_REQUIRED',
          'file',
          'medium',
          true,
          'Please select a file'
        );
      }
      return null;
    }

    // Check file size
    if (file.size > maxSize) {
      throw new ValidationError(
        `File size exceeds limit of ${maxSize / 1024 / 1024}MB`,
        'FILE_TOO_LARGE',
        'file',
        'medium',
        true,
        `File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`
      );
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError(
        `File type ${file.type} not allowed`,
        'INVALID_FILE_TYPE',
        'file',
        'medium',
        true,
        `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      );
    }

    return file;
  };
};

// Rate limiting validation
export const validateRateLimit = (
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 1000 // 1 minute
) => {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return async (): Promise<void> => {
    const now = Date.now();
    const requestData = requestCounts.get(identifier);

    if (!requestData || now > requestData.resetTime) {
      // Reset or initialize
      requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return;
    }

    if (requestData.count >= maxRequests) {
      throw new ValidationError(
        'Rate limit exceeded',
        'RATE_LIMIT_EXCEEDED',
        undefined,
        'high',
        false,
        'Too many requests. Please try again later.',
        { 
          maxRequests, 
          windowMs, 
          resetTime: requestData.resetTime 
        }
      );
    }

    requestData.count++;
    requestCounts.set(identifier, requestData);
  };
};

// CSRF token validation
export const validateCsrfToken = (expectedToken: string) => {
  return async (providedToken: string): Promise<void> => {
    if (!providedToken || providedToken !== expectedToken) {
      throw new ValidationError(
        'Invalid CSRF token',
        'INVALID_CSRF_TOKEN',
        'csrfToken',
        'high',
        false,
        'Security token is invalid. Please refresh the page and try again.'
      );
    }
  };
};

// Permission validation
export const validatePermission = (
  userRole: string,
  requiredPermissions: string[]
) => {
  return async (): Promise<void> => {
    // Simple role-based permission check
    const roleHierarchy: Record<string, number> = {
      'player': 1,
      'category_manager': 2,
      'social_media_manager': 2,
      'partner_manager': 2,
      'cfo': 3,
      'admin': 4,
      'super_admin': 5
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const hasPermission = requiredPermissions.some(permission => {
      const requiredLevel = roleHierarchy[permission] || 999;
      return userLevel >= requiredLevel;
    });

    if (!hasPermission) {
      throw new ValidationError(
        'Insufficient permissions',
        'INSUFFICIENT_PERMISSIONS',
        undefined,
        'high',
        false,
        'You do not have permission to perform this action.'
      );
    }
  };
};

// Composite validation chain
export const createValidationChain = (...validators: ValidationMiddleware[]) => {
  return async (data: unknown): Promise<any> => {
    let result = data;
    
    for (const validator of validators) {
      result = await validator(result);
    }
    
    return result;
  };
};

// Common validation patterns
export const commonValidations = {
  // User authentication validation
  authenticatedUser: (userId?: string) => async (): Promise<void> => {
    if (!userId) {
      throw new ValidationError(
        'User not authenticated',
        'NOT_AUTHENTICATED',
        undefined,
        'high',
        false,
        'Please sign in to continue.'
      );
    }
  },

  // Resource ownership validation
  resourceOwnership: (resourceUserId: string, currentUserId?: string) => async (): Promise<void> => {
    if (!currentUserId || resourceUserId !== currentUserId) {
      throw new ValidationError(
        'Access denied to resource',
        'ACCESS_DENIED',
        undefined,
        'high',
        false,
        'You can only access your own resources.'
      );
    }
  },

  // Business hours validation
  businessHours: (timezone: string = 'UTC') => async (): Promise<void> => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 9 || hour > 17) {
      throw new ValidationError(
        'Outside business hours',
        'OUTSIDE_BUSINESS_HOURS',
        undefined,
        'low',
        true,
        'This action can only be performed during business hours (9 AM - 5 PM).'
      );
    }
  }
};
