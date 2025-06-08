
import * as z from 'zod';
import { 
  uuidSchema, 
  currencySchema, 
  sanitizedTextSchema 
} from './commonSchemas';

// Payment method type validation
export const paymentMethodTypeSchema = z.enum([
  'credit_card',
  'debit_card',
  'paypal',
  'stripe',
  'apple_pay',
  'google_pay',
  'bank_transfer',
  'credits'
]);

// Payment status validation
export const paymentStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'refunded'
]);

// Currency validation
export const currencyCodeSchema = z.enum([
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY'
]);

// Payment method schema
export const paymentMethodSchema = z.object({
  user_id: uuidSchema,
  provider: z.string().min(1, 'Provider is required'),
  method_type: paymentMethodTypeSchema,
  last_four: z.string().regex(/^\d{4}$/, 'Last four digits must be 4 numbers').optional(),
  is_default: z.boolean().default(false),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).default({})
});

// Payment transaction schema
export const paymentTransactionSchema = z.object({
  user_id: uuidSchema,
  game_id: uuidSchema.optional(),
  session_id: uuidSchema.optional(),
  amount: currencySchema,
  currency: currencyCodeSchema.default('USD'),
  transaction_type: z.enum(['payment', 'refund', 'credit_purchase', 'prize_payout']),
  status: paymentStatusSchema.default('pending'),
  payment_method_id: uuidSchema.optional(),
  external_transaction_id: z.string().optional(),
  description: sanitizedTextSchema(0, 500).optional(),
  metadata: z.record(z.any()).default({})
});

// Credit purchase schema
export const creditPurchaseSchema = z.object({
  user_id: uuidSchema,
  credits_amount: z.number().int().positive().max(10000),
  payment_amount: currencySchema,
  currency: currencyCodeSchema.default('USD'),
  payment_method_id: uuidSchema,
  promotional_code: z.string().regex(/^[A-Z0-9]{6,12}$/, 'Invalid promotional code').optional()
});

// Payment verification schema
export const paymentVerificationSchema = z.object({
  user_id: uuidSchema,
  game_id: uuidSchema,
  entry_fee: currencySchema,
  payment_method: paymentMethodTypeSchema.optional(),
  use_credits: z.boolean().default(false)
});

// Refund request schema
export const refundRequestSchema = z.object({
  transaction_id: uuidSchema,
  reason: z.enum(['user_request', 'technical_issue', 'fraud', 'duplicate', 'other']),
  reason_description: sanitizedTextSchema(10, 500),
  refund_amount: currencySchema.optional(),
  notify_user: z.boolean().default(true)
});

// Prize payout schema
export const prizePayoutSchema = z.object({
  user_id: uuidSchema,
  game_id: uuidSchema,
  session_id: uuidSchema,
  prize_amount: currencySchema,
  currency: currencyCodeSchema.default('USD'),
  payout_method: z.enum(['credits', 'bank_transfer', 'paypal', 'check']),
  tax_withheld: currencySchema.optional(),
  processing_fee: currencySchema.optional()
});

// Payment analytics schema
export const paymentAnalyticsSchema = z.object({
  date_from: z.string().datetime(),
  date_to: z.string().datetime(),
  currency: currencyCodeSchema.optional(),
  payment_method: paymentMethodTypeSchema.optional(),
  transaction_type: z.string().optional(),
  group_by: z.enum(['day', 'week', 'month']).default('day')
});

// Fraud detection schema
export const fraudDetectionSchema = z.object({
  user_id: uuidSchema,
  transaction_id: uuidSchema,
  ip_address: z.string().ip().optional(),
  user_agent: z.string().max(500).optional(),
  risk_factors: z.array(z.string()).default([]),
  risk_score: z.number().min(0).max(100),
  action_taken: z.enum(['allow', 'block', 'review', 'flag']).default('allow')
});

// Payment validation helper functions
export const validatePayment = {
  method: (data: unknown) => paymentMethodSchema.parse(data),
  transaction: (data: unknown) => paymentTransactionSchema.parse(data),
  creditPurchase: (data: unknown) => creditPurchaseSchema.parse(data),
  verification: (data: unknown) => paymentVerificationSchema.parse(data),
  refund: (data: unknown) => refundRequestSchema.parse(data),
  payout: (data: unknown) => prizePayoutSchema.parse(data),
  analytics: (data: unknown) => paymentAnalyticsSchema.parse(data),
  fraudDetection: (data: unknown) => fraudDetectionSchema.parse(data)
};
