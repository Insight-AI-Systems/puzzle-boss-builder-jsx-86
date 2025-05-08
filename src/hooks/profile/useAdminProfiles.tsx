
import { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/userTypes';
import { userService } from '@/services/userService';
import { roleService } from '@/services/roleService';
import { debugLog, DebugLevel } from '@/utils/debug';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useAdminProfiles(isAdmin: boolean, currentUserId: string | null) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
  
  const fetchProfiles = async () => {
    // Don't fetch if not admin and no user ID
    if (!isAdmin && !currentUserId) {
      debugLog('useAdminProfiles', 'Not authorized to fetch profiles or no user ID', DebugLevel.WARN);
      setUsers([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Record API call start time
    const startTime = Date.now();
    
    try {
      debugLog('useAdminProfiles', 'Fetching profiles using userService', DebugLevel.INFO);
      
      const profiles = await userService.getAllUsers();
      
      if (!profiles || !Array.isArray(profiles)) {
        throw new Error('Invalid response from userService.getAllUsers');
      }
      
      debugLog('useAdminProfiles', `Successfully retrieved ${profiles.length} profiles`, DebugLevel.INFO);
      
      setUsers(profiles);
      setLastRefreshTime(Date.now());
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch profiles');
      debugLog('useAdminProfiles', 'Error fetching profiles', DebugLevel.ERROR, { error });
      
      setError(error);
      
      toast({
        title: "Error loading users",
        description: "Failed to fetch user data. Using cached data if available.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Implement retry logic for transient failures
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        debugLog('useAdminProfiles', `Retrying fetch (attempt ${retryCount + 1})`, DebugLevel.INFO);
        setRetryCount(prevCount => prevCount + 1);
        fetchProfiles();
      }, 2000 * Math.pow(2, retryCount)); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);
  
  // Fetch profiles on mount and when dependencies change
  useEffect(() => {
    fetchProfiles();
  }, [isAdmin, currentUserId]);
  
  const updateUserRole = async (targetUserId: string, newRole: UserRole) => {
    try {
      const result = await roleService.updateUserRole(targetUserId, newRole);
      
      if (result.success) {
        // Update local state optimistically
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === targetUserId ? { ...user, role: newRole } : user
          )
        );
        
        return { success: true };
      } else {
        return { success: false, error: new Error(result.message || 'Failed to update role') };
      }
    } catch (error) {
      toast({
        title: "Error updating role",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
      
      return { success: false, error };
    }
  };
  
  const bulkUpdateRoles = async (userIds: string[], newRole: UserRole) => {
    try {
      const result = await roleService.bulkUpdateUserRoles(userIds, newRole);
      
      if (result.success) {
        // Update local state optimistically
        setUsers(prevUsers => 
          prevUsers.map(user => 
            userIds.includes(user.id) ? { ...user, role: newRole } : user
          )
        );
        
        return { success: true };
      } else {
        return { success: false, error: new Error(result.message || 'Failed to update roles') };
      }
    } catch (error) {
      toast({
        title: "Error updating roles",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
      
      return { success: false, error };
    }
  };
  
  const sendBulkEmail = async ({ userIds, subject, body }: { userIds: string[]; subject: string; body: string }) => {
    try {
      debugLog('useAdminProfiles', `Sending email to ${userIds.length} users`, DebugLevel.INFO);
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: { userIds, subject, body }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Error sending emails",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  return {
    data: users,
    isLoading: loading,
    error,
    refetch: fetchProfiles,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail,
    lastRefreshTime,
    retryCount
  };
}
