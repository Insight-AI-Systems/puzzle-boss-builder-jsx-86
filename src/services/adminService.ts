
/**
 * Admin Service
 * Common functionality for admin operations
 */

import { supabase } from '@/integrations/supabase/client';
import { PROTECTED_ADMIN_EMAIL } from '@/utils/constants';
import { debugLog, DebugLevel } from '@/utils/debug';
import { errorTracker } from '@/utils/monitoring/errorTracker';
import { UserRole } from '@/types/userTypes';

class AdminService {
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
   * Check if an email is the protected admin
   */
  public isProtectedAdminEmail(email?: string | null): boolean {
    return email === PROTECTED_ADMIN_EMAIL;
  }

  /**
   * Get the current authenticated user
   */
  public async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data?.user || null;
    } catch (err) {
      errorTracker.trackError(err instanceof Error ? err : new Error('Error getting current user'), 'medium');
      return null;
    }
  }

  /**
   * Check if the current session is valid
   */
  public async validateSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      return !error && !!data.session;
    } catch (err) {
      debugLog('AdminService', 'Session validation error', DebugLevel.ERROR, { error: err });
      return false;
    }
  }

  /**
   * Format standard timestamp for consistency
   */
  public formatTimestamp(timestamp: string | null | undefined): string {
    if (!timestamp) return 'Never';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return 'Invalid date';
    }
  }

  /**
   * Check if a role is an admin-level role
   */
  public hasAdminRole(role?: UserRole): boolean {
    if (!role) return false;
    
    const adminRoles = ['super_admin', 'admin', 'category_manager'];
    return adminRoles.includes(role);
  }
}

// Export singleton instance
export const adminService = AdminService.getInstance();
