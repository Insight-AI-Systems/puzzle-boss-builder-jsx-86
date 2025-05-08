
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { performanceMonitor } from '@/utils/monitoring/performanceMonitor';
import { errorTracker } from '@/utils/monitoring/errorTracker';

export function useUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const perfMark = `fetch_users_${Date.now()}`;
      performanceMonitor.markStart(perfMark);
      
      const { data, error } = await supabase.functions.invoke('get-all-users');
      
      performanceMonitor.markEnd(perfMark);
      
      if (error) {
        throw error;
      }
      
      if (data?.users) {
        setUsers(data.users);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch users');
      setError(error);
      errorTracker.trackError(error, 'medium', { source: 'useUserManagement.fetchUsers' });
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const updateUserRole = useCallback(async (userId: string, newRole: string) => {
    try {
      performanceMonitor.markStart(`update_user_role_${userId}`);
      
      const { data, error } = await supabase.functions.invoke('set-admin-role', {
        body: { userId, role: newRole }
      });
      
      performanceMonitor.markEnd(`update_user_role_${userId}`);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${newRole}`,
      });
      
      // Update local state to reflect the change
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update user role');
      errorTracker.trackError(error, 'medium', {
        source: 'useUserManagement.updateUserRole',
        userId,
        newRole
      });
      
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
      
      return { success: false, error };
    }
  }, []);
  
  const deleteUser = useCallback(async (userId: string) => {
    try {
      performanceMonitor.markStart(`delete_user_${userId}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      performanceMonitor.markEnd(`delete_user_${userId}`);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'User Deleted',
        description: 'User has been successfully deleted',
      });
      
      // Update local state to remove the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete user');
      errorTracker.trackError(error, 'medium', { 
        source: 'useUserManagement.deleteUser',
        userId
      });
      
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
      
      return { success: false, error };
    }
  }, []);
  
  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  }, []);
  
  const clearUserSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);
  
  return {
    users,
    loading,
    error,
    selectedUsers,
    fetchUsers,
    updateUserRole,
    deleteUser,
    toggleUserSelection,
    clearUserSelection
  };
}
