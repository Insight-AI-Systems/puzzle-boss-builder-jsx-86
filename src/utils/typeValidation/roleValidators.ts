
import { UserRole } from '@/types/userTypes';

export function validateUserRole(roleString: string): UserRole | null {
  const validRoles: UserRole[] = [
    'super_admin',
    'admin', 
    'category_manager',
    'social_media_manager',
    'partner_manager',
    'cfo',
    'player'
  ];
  
  if (validRoles.includes(roleString as UserRole)) {
    return roleString as UserRole;
  }
  
  return null;
}

export function isValidUserRole(role: string): role is UserRole {
  return validateUserRole(role) !== null;
}
