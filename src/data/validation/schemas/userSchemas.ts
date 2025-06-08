
import * as z from 'zod';
import { 
  emailSchema, 
  passwordSchema, 
  uuidSchema, 
  phoneSchema, 
  sanitizedTextSchema,
  textLengthSchema 
} from './commonSchemas';

// User role validation
export const userRoleSchema = z.enum([
  'super_admin',
  'admin', 
  'category_manager',
  'social_media_manager',
  'partner_manager',
  'cfo',
  'player'
]);

// Gender validation
export const genderSchema = z.enum([
  'male',
  'female', 
  'non-binary',
  'custom',
  'prefer-not-to-say',
  'other'
]);

// Age group validation
export const ageGroupSchema = z.enum([
  '13-17',
  '18-24',
  '25-34', 
  '35-44',
  '45-60',
  '60+'
]);

// User registration schema
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  username: sanitizedTextSchema(3, 50).optional(),
  full_name: sanitizedTextSchema(2, 100).optional(),
  terms_accepted: z.boolean().refine(val => val === true, 'Must accept terms'),
  marketing_opt_in: z.boolean().default(false)
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }
);

// User sign-in schema
export const userSignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// User profile update schema
export const userProfileUpdateSchema = z.object({
  username: sanitizedTextSchema(3, 50).optional(),
  full_name: sanitizedTextSchema(2, 100).optional(),
  bio: sanitizedTextSchema(0, 500).optional(),
  phone: phoneSchema,
  address_line1: sanitizedTextSchema(0, 255).optional(),
  address_line2: sanitizedTextSchema(0, 255).optional(),
  city: sanitizedTextSchema(0, 100).optional(),
  state: sanitizedTextSchema(0, 100).optional(),
  postal_code: z.string().regex(/^[\d\w\s-]{3,10}$/, 'Invalid postal code').optional(),
  country: sanitizedTextSchema(0, 100).optional(),
  date_of_birth: z.string().datetime().optional(),
  gender: genderSchema.optional(),
  custom_gender: sanitizedTextSchema(0, 50).optional(),
  age_group: ageGroupSchema.optional(),
  marketing_opt_in: z.boolean().optional()
}).refine(
  (data) => {
    if (data.gender === 'custom') {
      return data.custom_gender && data.custom_gender.length > 0;
    }
    return true;
  },
  {
    message: "Custom gender must be specified when gender is 'custom'",
    path: ["custom_gender"]
  }
);

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string()
}).refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: "New passwords don't match",
    path: ["confirmNewPassword"]
  }
).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: "New password must be different from current password",
    path: ["newPassword"]
  }
);

// Email change schema
export const emailChangeSchema = z.object({
  newEmail: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// User search schema
export const userSearchSchema = z.object({
  query: sanitizedTextSchema(0, 255).optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});

// Admin user creation schema
export const adminUserCreateSchema = z.object({
  email: emailSchema,
  username: sanitizedTextSchema(3, 50),
  full_name: sanitizedTextSchema(2, 100),
  role: userRoleSchema,
  password: passwordSchema.optional(),
  send_invite: z.boolean().default(true)
});

// User role update schema
export const userRoleUpdateSchema = z.object({
  userId: uuidSchema,
  newRole: userRoleSchema,
  reason: sanitizedTextSchema(10, 500).optional()
});

// User validation helper functions
export const validateUser = {
  registration: (data: unknown) => userRegistrationSchema.parse(data),
  signIn: (data: unknown) => userSignInSchema.parse(data),
  profileUpdate: (data: unknown) => userProfileUpdateSchema.parse(data),
  passwordChange: (data: unknown) => passwordChangeSchema.parse(data),
  emailChange: (data: unknown) => emailChangeSchema.parse(data),
  search: (data: unknown) => userSearchSchema.parse(data),
  adminCreate: (data: unknown) => adminUserCreateSchema.parse(data),
  roleUpdate: (data: unknown) => userRoleUpdateSchema.parse(data)
};

// Export as userValidation for backward compatibility
export const userValidation = validateUser;
