
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

export class RoleValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoleValidationError';
  }
}

export const validateRole = (role: string): UserRole => {
  if (!role || typeof role !== 'string') {
    throw new RoleValidationError('Role must be a non-empty string');
  }

  const normalizedRole = role.toLowerCase().trim();
  const validRoles = Object.keys(ROLE_DEFINITIONS) as UserRole[];
  
  const matchedRole = validRoles.find(validRole => 
    validRole.toLowerCase() === normalizedRole
  );

  if (!matchedRole) {
    throw new RoleValidationError(
      `Invalid role: ${role}. Valid roles are: ${validRoles.join(', ')}`
    );
  }

  return matchedRole;
};

export const canRoleBeAssignedBy = (targetRole: UserRole, assignerRole: UserRole): boolean => {
  const targetRoleDefinition = ROLE_DEFINITIONS[targetRole];
  if (!targetRoleDefinition) return false;
  
  return targetRoleDefinition.canBeAssignedBy.includes(assignerRole);
};

export const getRolePermissions = (role: UserRole): string[] => {
  const roleDefinition = ROLE_DEFINITIONS[role];
  return roleDefinition ? roleDefinition.permissions : [];
};

export const hasRolePermission = (role: UserRole, permission: string): boolean => {
  // Super admins have all permissions
  if (role === 'super-admin') return true;
  
  const permissions = getRolePermissions(role);
  return permissions.includes(permission);
};

export const isValidRoleTransition = (fromRole: UserRole, toRole: UserRole, assignerRole: UserRole): boolean => {
  // Check if the assigner can assign the target role
  if (!canRoleBeAssignedBy(toRole, assignerRole)) {
    return false;
  }
  
  // Additional business rules can be added here
  // For example, preventing downgrades of certain roles
  
  return true;
};

export const getHighestRole = (roles: UserRole[]): UserRole => {
  const roleHierarchy: Record<UserRole, number> = {
    'super-admin': 7,
    'admin': 6,
    'cfo': 5,
    'partner_manager': 4,
    'category_manager': 3,
    'social_media_manager': 2,
    'player': 1
  };
  
  return roles.reduce((highest, current) => {
    return (roleHierarchy[current] || 0) > (roleHierarchy[highest] || 0) ? current : highest;
  }, 'player' as UserRole);
};
