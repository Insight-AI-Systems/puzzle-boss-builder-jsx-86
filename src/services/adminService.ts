
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { debugLog, DebugLevel } from '@/utils/debug';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/utils/constants';

interface UserStats {
  totalCount: number;
  regularCount: number;
  adminCount: number;
  activeCount: number;
  inactiveCount: number;
  roleCounts: Record<string, number>;
  signupsByPeriod: Array<{ period: string; count: number }>;
}

/**
 * Admin Service
 * Centralized service for admin-specific operations
 */
class AdminService {
  private static instance: AdminService;
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }
  
  /**
   * Check if an email belongs to the protected admin
   */
  public isProtectedAdminEmail(email?: string | null): boolean {
    return isProtectedAdmin(email);
  }
  
  /**
   * Check if user has admin role
   */
  public hasAdminRole(role: UserRole): boolean {
    return ['super_admin', 'admin'].includes(role);
  }
  
  /**
   * Get user statistics
   */
  public async getUserStats(users: UserProfile[]): Promise<UserStats> {
    try {
      // Count by role
      const roleCounts = users.reduce((acc, user) => {
        const role = user.role;
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Count admins vs regular users
      const adminCount = users.filter(user => 
        ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'].includes(user.role)
      ).length;
      
      const regularCount = users.length - adminCount;
      
      // Count active vs inactive users
      const activeCount = users.filter(user => !!user.last_sign_in).length;
      const inactiveCount = users.length - activeCount;
      
      // Group signups by month
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      
      // Initialize months
      const months: Record<string, number> = {};
      for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months[monthKey] = 0;
      }
      
      // Count users by signup month
      users.forEach(user => {
        const date = new Date(user.created_at);
        if (date >= sixMonthsAgo) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (months[monthKey] !== undefined) {
            months[monthKey]++;
          }
        }
      });
      
      // Format for chart
      const signupsByPeriod = Object.entries(months).map(([period, count]) => ({
        period,
        count
      })).reverse();
      
      return {
        totalCount: users.length,
        regularCount,
        adminCount,
        activeCount,
        inactiveCount,
        roleCounts,
        signupsByPeriod
      };
      
    } catch (err) {
      debugLog('adminService', 'Error calculating user stats', DebugLevel.ERROR, { error: err });
      return {
        totalCount: users.length,
        regularCount: 0,
        adminCount: 0,
        activeCount: 0,
        inactiveCount: 0,
        roleCounts: {},
        signupsByPeriod: []
      };
    }
  }
  
  /**
   * Log admin action for audit purposes
   */
  public async logAdminAction(
    actionType: string,
    details: Record<string, any>,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      await supabase.from('security_audit_logs').insert({
        event_type: actionType,
        user_id: user.id,
        email: user.email,
        severity,
        details: {
          ...details,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (err) {
      debugLog('adminService', 'Error logging admin action', DebugLevel.ERROR, { error: err });
    }
  }
}

// Export singleton instance
export const adminService = AdminService.getInstance();
