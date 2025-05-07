
/**
 * @file Security Configuration Service Client
 * 
 * This file provides utilities for interacting with the centralized
 * security configuration service from client applications.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Get security constants for the current user's role
 * @returns Security configuration constants
 */
export async function getSecurityConstants() {
  try {
    const { data, error } = await supabase.functions.invoke('security-config-service', {
      body: {
        action: 'getSecurityConstants'
      }
    });
    
    if (error) throw error;
    return data.config;
  } catch (error) {
    console.error('Error fetching security constants:', error);
    throw error;
  }
}

/**
 * Validate if the current user has admin access
 * @returns Object with isAdmin flag and access details
 */
export async function validateAdminAccess() {
  try {
    const { data, error } = await supabase.functions.invoke('security-config-service', {
      body: {
        action: 'validateAdminAccess'
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error validating admin access:', error);
    return { isAdmin: false, details: { byRole: false, byEmail: false } };
  }
}

/**
 * Get permissions for a specific role
 * @param role Optional role to check (defaults to current user's role)
 * @returns List of permissions for the role
 */
export async function getPermissionsForRole(role?: string) {
  try {
    const { data, error } = await supabase.functions.invoke('security-config-service', {
      body: {
        action: 'getPermissionsForRole',
        params: { role }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
}

/**
 * Get protected admin emails (super admin only)
 * @returns List of protected admin emails
 */
export async function getAdminEmails() {
  try {
    const { data, error } = await supabase.functions.invoke('security-config-service', {
      body: {
        action: 'getAdminEmails'
      }
    });
    
    if (error) throw error;
    return data.adminEmails;
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    throw error;
  }
}

/**
 * Add a protected admin email (super admin only)
 * @param email Email to add to protected admin list
 * @returns Updated list of admin emails
 */
export async function addProtectedAdmin(email: string) {
  try {
    const { data, error } = await supabase.functions.invoke('security-config-service', {
      body: {
        action: 'addProtectedAdmin',
        params: { email }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding protected admin:', error);
    throw error;
  }
}

/**
 * Remove a protected admin email (super admin only)
 * @param email Email to remove from protected admin list
 * @returns Updated list of admin emails
 */
export async function removeProtectedAdmin(email: string) {
  try {
    const { data, error } = await supabase.functions.invoke('security-config-service', {
      body: {
        action: 'removeProtectedAdmin',
        params: { email }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error removing protected admin:', error);
    throw error;
  }
}
