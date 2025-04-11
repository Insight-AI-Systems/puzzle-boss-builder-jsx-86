
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { hasPermission, hasRole } from '@/utils/permissions';

/**
 * Component that conditionally renders content based on user permissions
 */
const PermissionGate = ({ 
  permission, 
  role, 
  children, 
  fallback = null
}) => {
  const { profile } = useAuth();
  
  // If no profile exists yet, show fallback
  if (!profile) {
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
  
  // Return fallback content if user doesn't have required permission/role
  return fallback;
};

export default PermissionGate;
