
/**
 * Validation error handling and formatting utilities
 */

import { ValidationError as BaseValidationError } from '@/infrastructure/errors/ValidationError';
import { ZodError } from 'zod';

// Enhanced validation error class
export class ValidationError extends BaseValidationError {
  public readonly validationType: string;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    field?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    recoverable: boolean = true,
    userMessage?: string,
    metadata?: Record<string, any>,
    validationType: string = 'general',
    context?: Record<string, any>
  ) {
    super(message, code, field, severity, recoverable, userMessage, metadata);
    this.validationType = validationType;
    this.context = context;
  }
}

// Validation error codes
export const ValidationErrorCodes = {
  // General validation
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_LENGTH: 'INVALID_LENGTH',
  INVALID_RANGE: 'INVALID_RANGE',
  
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',
  
  // Business logic
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  GAME_NOT_AVAILABLE: 'GAME_NOT_AVAILABLE',
  TIME_LIMIT_EXCEEDED: 'TIME_LIMIT_EXCEEDED',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  
  // Security
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // File handling
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // Data integrity
  FOREIGN_KEY_VIOLATION: 'FOREIGN_KEY_VIOLATION',
  UNIQUE_CONSTRAINT_VIOLATION: 'UNIQUE_CONSTRAINT_VIOLATION'
} as const;

// Error message templates
export const ErrorMessages = {
  [ValidationErrorCodes.REQUIRED_FIELD]: (field: string) => 
    `${field} is required.`,
  
  [ValidationErrorCodes.INVALID_FORMAT]: (field: string, format: string) => 
    `${field} must be in ${format} format.`,
  
  [ValidationErrorCodes.INVALID_LENGTH]: (field: string, min?: number, max?: number) => {
    if (min && max) return `${field} must be between ${min} and ${max} characters.`;
    if (min) return `${field} must be at least ${min} characters.`;
    if (max) return `${field} cannot exceed ${max} characters.`;
    return `${field} has invalid length.`;
  },
  
  [ValidationErrorCodes.INSUFFICIENT_CREDITS]: (required: number, available: number) =>
    `You need ${required - available} more credits to complete this action.`,
  
  [ValidationErrorCodes.RATE_LIMIT_EXCEEDED]: (resetTime?: number) =>
    `Too many requests. ${resetTime ? `Try again after ${new Date(resetTime).toLocaleTimeString()}.` : 'Please try again later.'}`,
  
  [ValidationErrorCodes.FILE_TOO_LARGE]: (maxSize: number) =>
    `File size cannot exceed ${Math.round(maxSize / 1024 / 1024)}MB.`
};

// Convert Zod errors to ValidationError
export const fromZodError = (error: ZodError, validationType: string = 'schema'): ValidationError => {
  const firstError = error.errors[0];
  
  return new ValidationError(
    error.message,
    ValidationErrorCodes.INVALID_FORMAT,
    firstError.path.join('.'),
    'medium',
    true,
    firstError.message,
    { zodErrors: error.errors },
    validationType,
    { originalError: error }
  );
};

// Error formatting utilities
export const formatValidationErrors = (errors: ValidationError[]): {
  fieldErrors: Record<string, string>;
  globalErrors: string[];
  summary: string;
} => {
  const fieldErrors: Record<string, string> = {};
  const globalErrors: string[] = [];

  errors.forEach(error => {
    if (error.field) {
      fieldErrors[error.field] = error.userMessage;
    } else {
      globalErrors.push(error.userMessage);
    }
  });

  const errorCount = errors.length;
  const summary = errorCount === 1 
    ? '1 validation error occurred'
    : `${errorCount} validation errors occurred`;

  return {
    fieldErrors,
    globalErrors,
    summary
  };
};

// Error aggregation
export class ValidationErrorAggregator {
  private errors: ValidationError[] = [];

  add(error: ValidationError): void {
    this.errors.push(error);
  }

  addField(field: string, message: string, code: string = ValidationErrorCodes.INVALID_FORMAT): void {
    this.errors.push(new ValidationError(
      message,
      code,
      field,
      'medium',
      true,
      message
    ));
  }

  addGlobal(message: string, code: string = ValidationErrorCodes.INVALID_FORMAT): void {
    this.errors.push(new ValidationError(
      message,
      code,
      undefined,
      'medium',
      true,
      message
    ));
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): ValidationError[] {
    return [...this.errors];
  }

  getFormattedErrors() {
    return formatValidationErrors(this.errors);
  }

  throwIfErrors(): void {
    if (this.hasErrors()) {
      const formatted = this.getFormattedErrors();
      throw new ValidationError(
        formatted.summary,
        'VALIDATION_AGGREGATE',
        undefined,
        'medium',
        true,
        formatted.summary,
        { errors: this.errors }
      );
    }
  }

  clear(): void {
    this.errors = [];
  }
}

// Validation result wrapper
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  formattedErrors?: ReturnType<typeof formatValidationErrors>;
}

export const createValidationResult = <T>(
  success: boolean,
  data?: T,
  errors?: ValidationError[]
): ValidationResult<T> => {
  return {
    success,
    data,
    errors,
    formattedErrors: errors ? formatValidationErrors(errors) : undefined
  };
};

// Safe validation wrapper
export const safeValidate = async <T>(
  validationFn: () => Promise<T> | T
): Promise<ValidationResult<T>> => {
  try {
    const data = await validationFn();
    return createValidationResult(true, data);
  } catch (error) {
    if (error instanceof ValidationError) {
      return createValidationResult(false, undefined, [error]);
    }
    
    if (error instanceof ZodError) {
      return createValidationResult(false, undefined, [fromZodError(error)]);
    }
    
    // Convert unknown errors to ValidationError
    const validationError = new ValidationError(
      error instanceof Error ? error.message : 'Validation failed',
      'UNKNOWN_VALIDATION_ERROR',
      undefined,
      'medium',
      true,
      'An unexpected validation error occurred'
    );
    
    return createValidationResult(false, undefined, [validationError]);
  }
};
