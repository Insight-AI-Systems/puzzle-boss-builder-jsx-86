/**
 * Secure Role Management
 * Centralized role validation and management without hardcoded emails
 */

import { UserRole } from '@/types/userTypes';
import { supabase } from '@/integrations/supabase/client';

// Security: Remove hardcoded admin emails, use database-driven roles
export class RoleManager {
  /**
   * Get user role from database (secure)
   */
  static async getUserRole(userId: string): Promise<UserRole> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.warn('Failed to fetch user role:', error);
        return 'player'; // Default safe role
      }

      return (data.role as UserRole) || 'player';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'player';
    }
  }

  /**
   * Check if user has specific role (secure)
   */
  static async hasRole(userId: string, role: UserRole): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    
    // Super admin has all permissions
    if (userRole === 'super-admin') {
      return true;
    }
    
    return userRole === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  static async hasAnyRole(userId: string, roles: UserRole[]): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    
    // Super admin has all permissions
    if (userRole === 'super-admin') {
      return true;
    }
    
    return roles.includes(userRole);
  }

  /**
   * Check if user is admin (admin or super_admin)
   */
  static async isAdmin(userId: string): Promise<boolean> {
    return this.hasAnyRole(userId, ['admin', 'super-admin']);
  }

  /**
   * Validate role change permissions
   */
  static async canAssignRole(
    assignerId: string, 
    targetRole: UserRole
  ): Promise<{ canAssign: boolean; reason?: string }> {
    const assignerRole = await this.getUserRole(assignerId);
    
    // Only super-admin can assign super-admin role
    if (targetRole === 'super-admin') {
      if (assignerRole !== 'super-admin') {
        return { 
          canAssign: false, 
          reason: 'Only super administrators can assign super admin role' 
        };
      }
    }
    
    // Admins can assign non-admin roles
    if (assignerRole === 'admin') {
      const restrictedRoles: UserRole[] = ['super-admin', 'admin'];
      if (restrictedRoles.includes(targetRole)) {
        return { 
          canAssign: false, 
          reason: 'Admins cannot assign administrative roles' 
        };
      }
    }
    
    // Super admin can assign any role
    if (assignerRole === 'super-admin') {
      return { canAssign: true };
    }
    
    // Default: no permission
    return { 
      canAssign: false, 
      reason: 'Insufficient permissions to assign roles' 
    };
  }

  /**
   * Log role changes for audit trail (simplified - no table dependency)
   */
  static async logRoleChange(
    adminId: string,
    targetUserId: string,
    oldRole: UserRole,
    newRole: UserRole,
    reason?: string
  ): Promise<void> {
    try {
      // For now, log to console - table creation needed later
      console.log('SECURITY AUDIT - Role Change:', {
        timestamp: new Date().toISOString(),
        adminId,
        targetUserId,
        oldRole,
        newRole,
        reason: reason || 'No reason provided'
      });
      
      // TODO: Create security_audit_log table for proper audit logging
    } catch (error) {
      console.error('Failed to log role change:', error);
      // Don't throw - logging failure shouldn't block role changes
    }
  }
}

/**
 * Secure user lookup by email (for admin operations only)
 */
export class UserLookup {
  /**
   * Find user by email (admin only)
   */
  static async findUserByEmail(
    email: string, 
    adminId: string
  ): Promise<{ id: string; email: string; role: UserRole } | null> {
    // Verify admin permissions first
    const isAdmin = await RoleManager.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        role: (data.role as UserRole) || 'player'
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
}