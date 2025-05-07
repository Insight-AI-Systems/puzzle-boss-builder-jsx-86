import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL, getRoleWeight } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Admin Service
 * Provides a single source of truth for admin status checks
 */
export class AdminService {
  private static instance: AdminService;

  private constructor() {}

  /**
   * Get singleton instance of AdminService
   */
  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  /**
   * Check if a user has admin status based on email and role
   */
  public isAdmin(profile: UserProfile | null): boolean {
    if (!profile) return false;
    
    // First, check for protected admin email (highest priority)
    if (this.isProtectedAdminEmail(profile.email || profile.id)) {
      debugLog('AdminService', 'Protected admin detected via email check', DebugLevel.INFO, {
        email: profile.email || profile.id
      });
      return true;
    }
    
    // Then check for admin roles
    const hasAdminRole = this.hasAdminRole(profile.role);
    
    debugLog('AdminService', 'Admin status check completed', DebugLevel.INFO, { 
      profileId: profile.id, 
      profileEmail: profile.email, 
      role: profile.role,
      hasAdminRole
    });
    
    return hasAdminRole;
  }

  /**
   * Check if a user has a specific role or higher
   */
  public hasRole(profile: UserProfile | null, requiredRole: UserRole): boolean {
    if (!profile) return false;
    
    // Special case for protected admin (always has all roles)
    if (this.isProtectedAdminEmail(profile.email || profile.id)) {
      return true;
    }
    
    const userRoleWeight = getRoleWeight(profile.role);
    const requiredRoleWeight = getRoleWeight(requiredRole);
    
    return userRoleWeight >= requiredRoleWeight;
  }

  /**
   * Check if an email is the protected admin email
   * Uses case-insensitive comparison for safety
   */
  public isProtectedAdminEmail(email?: string | null): boolean {
    if (!email) return false;
    return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
  }

  /**
   * Check if a role is an admin role
   */
  public hasAdminRole(role: UserRole): boolean {
    return role === 'super_admin' || role === 'admin';
  }

  /**
   * Check if a role is any management role
   */
  public hasManagementRole(role: UserRole): boolean {
    const managementRoles = [
      'super_admin',
      'admin',
      'category_manager',
      'social_media_manager',
      'partner_manager',
      'cfo'
    ];
    
    return managementRoles.includes(role);
  }

  /**
   * Get current user and check if they have admin privileges
   */
  public async getCurrentUserAdminStatus(): Promise<{ 
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isProtectedAdmin: boolean;
    userRole: UserRole | null;
    userEmail: string | null;
  }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        return {
          isAdmin: false,
          isSuperAdmin: false,
          isProtectedAdmin: false,
          userRole: null,
          userEmail: null
        };
      }
      
      const userEmail = data.user.email;
      const isProtectedAdmin = this.isProtectedAdminEmail(userEmail);
      
      // If protected admin, we don't even need to check the profile
      if (isProtectedAdmin) {
        return {
          isAdmin: true,
          isSuperAdmin: true,
          isProtectedAdmin: true,
          userRole: 'super_admin',
          userEmail
        };
      }
      
      // Otherwise, get the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (profileError || !profileData) {
        return {
          isAdmin: false,
          isSuperAdmin: false,
          isProtectedAdmin: false,
          userRole: 'player',
          userEmail
        };
      }
      
      const userRole = profileData.role as UserRole;
      const isAdmin = this.hasAdminRole(userRole);
      const isSuperAdmin = userRole === 'super_admin';
      
      return {
        isAdmin,
        isSuperAdmin,
        isProtectedAdmin,
        userRole,
        userEmail
      };
      
    } catch (error) {
      debugLog('AdminService', 'Error checking admin status', DebugLevel.ERROR, { error });
      return {
        isAdmin: false,
        isSuperAdmin: false,
        isProtectedAdmin: false,
        userRole: null,
        userEmail: null
      };
    }
  }
}

// Export singleton instance
export const adminService = AdminService.getInstance();
