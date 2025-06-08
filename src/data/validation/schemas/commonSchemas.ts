
import * as z from 'zod';

// Common validation patterns
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(320, 'Email too long')
  .refine(
    (email) => !email.includes('..'),
    'Email cannot contain consecutive dots'
  );

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const uuidSchema = z.string()
  .uuid('Invalid UUID format');

export const urlSchema = z.string()
  .url('Invalid URL format')
  .max(2048, 'URL too long');

export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number format')
  .optional();

export const dateSchema = z.string()
  .datetime('Invalid date format')
  .or(z.date());

export const positiveNumberSchema = z.number()
  .positive('Must be a positive number')
  .finite('Must be a finite number');

export const nonNegativeNumberSchema = z.number()
  .nonnegative('Must be non-negative')
  .finite('Must be a finite number');

export const currencySchema = z.number()
  .positive('Amount must be positive')
  .multipleOf(0.01, 'Amount can only have 2 decimal places')
  .max(999999.99, 'Amount too large');

export const textLengthSchema = (min: number = 1, max: number = 1000) =>
  z.string()
    .min(min, `Text must be at least ${min} characters`)
    .max(max, `Text cannot exceed ${max} characters`)
    .trim();

export const sanitizedTextSchema = (min: number = 1, max: number = 1000) =>
  textLengthSchema(min, max)
    .refine(
      (text) => !/<script|javascript:|vbscript:|onload|onerror/i.test(text),
      'Text contains potentially harmful content'
    );

export const slugSchema = z.string()
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .min(1, 'Slug cannot be empty')
  .max(100, 'Slug too long');

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Search schemas
export const searchSchema = z.object({
  query: sanitizedTextSchema(0, 255),
  filters: z.record(z.any()).optional(),
  ...paginationSchema.shape
});
