
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { hasPermission, hasRole } from '@/utils/permissions';

/**
 * Component that conditionally renders content based on user permissions
 * @param {Object} props - Component props
 * @param {string} [props.permission] - Required permission to render content
 * @param {string|string[]} [props.role] - Required role(s) to render content
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} [props.fallback] - Content to render if unauthorized
 */
const PermissionGate = ({ 
  permission, 
  role, 
  children, 
  fallback = null
}) => {
  const { profile } = useAuth();
  
  // If no profile exists yet, show a loading state or fallback
  if (!profile) {
    console.log('PermissionGate: No profile found, rendering fallback');
    return fallback;
  }
  
  // If neither permission nor role specified, render children
  if (!permission && !role) {
    return children;
  }
  
  // Check for specific permission if provided
  if (permission && hasPermission(profile, permission)) {
    return children;
  }
  
  // Check for specific role if provided
  if (role && hasRole(profile, role)) {
    return children;
  }
  
  console.log(`PermissionGate: Access denied - Role: ${profile.role}, Required: ${role}, Permission: ${permission}`);
  // Return fallback content if user doesn't have required permission/role
  return fallback;
};

export default PermissionGate;
