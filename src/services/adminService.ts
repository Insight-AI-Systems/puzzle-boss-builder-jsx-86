
import { UserRole } from '@/types/userTypes';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/config/securityConfig';

/**
 * AdminService
 * Handles admin-related functionality and permissions
 */
class AdminService {
  private static instance: AdminService;
  
  private constructor() {}
  
  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }
  
  /**
   * Check if an email belongs to a protected admin
   */
  public isProtectedAdminEmail(email?: string | null): boolean {
    return isProtectedAdmin(email);
  }
  
  /**
   * Check if a role has admin privileges
   */
  public hasAdminRole(role?: UserRole | string | null): boolean {
    if (!role) return false;
    
    return role === 'admin' || 
           role === 'super_admin' || 
           role === 'category_manager' ||
           role === 'social_media_manager' ||
           role === 'partner_manager' ||
           role === 'cfo';
  }
  
  /**
   * Check if a user can perform a specific admin action
   */
  public canPerformAction(userRole: UserRole, requiredRole: UserRole): boolean {
    // Protected roles can always perform actions
    if (userRole === 'super_admin') return true;
    
    // Admin can do most things except super_admin actions
    if (userRole === 'admin') {
      return requiredRole !== 'super_admin';
    }
    
    // Category managers can only perform their own actions
    if (userRole === 'category_manager') {
      return requiredRole === 'category_manager';
    }
    
    // Social media managers
    if (userRole === 'social_media_manager') {
      return requiredRole === 'social_media_manager';
    }
    
    // Partner managers
    if (userRole === 'partner_manager') {
      return requiredRole === 'partner_manager';
    }
    
    // CFO role
    if (userRole === 'cfo') {
      return requiredRole === 'cfo';
    }
    
    // Default: no permission
    return false;
  }
}

export const adminService = AdminService.getInstance();
