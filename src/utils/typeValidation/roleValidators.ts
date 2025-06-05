
import { UserRole } from '@/types/userTypes';

// Valid UserRole values for runtime validation
const VALID_USER_ROLES: UserRole[] = [
  'player',
  'admin', 
  'super_admin',
  'category_manager',
  'partner_manager',
  'social_media_manager',
  'cfo'
];

// Type guard to check if a string is a valid UserRole
export function isValidUserRole(value: string): value is UserRole {
  return VALID_USER_ROLES.includes(value as UserRole);
}

// Type-safe role converter with validation
export function validateUserRole(value: string | UserRole | null): UserRole | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string') {
    return isValidUserRole(value) ? value : null;
  }
  
  // If it's already a UserRole, validate it's still valid
  return isValidUserRole(value) ? value : null;
}

// Create a type-safe role setter function
export function createTypeSafeRoleSetter(setter: (role: UserRole | null) => void) {
  return (value: string | UserRole | null) => {
    const validatedRole = validateUserRole(value);
    setter(validatedRole);
  };
}

// Runtime type assertion with error handling
export function assertUserRole(value: unknown, context: string = 'Unknown'): UserRole {
  if (typeof value !== 'string') {
    throw new Error(`${context}: Expected string, got ${typeof value}`);
  }
  
  if (!isValidUserRole(value)) {
    throw new Error(`${context}: Invalid role "${value}". Valid roles: ${VALID_USER_ROLES.join(', ')}`);
  }
  
  return value;
}
