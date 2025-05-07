
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

export function useEnhancedAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [lastAuthCheck, setLastAuthCheck] = useState<number>(0);
  const [permissions, setPermissions] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  // For caching role checks
  const roleCache = useMemo(() => new Map<string, boolean>(), []);
  const permissionCache = useMemo(() => new Map<string, boolean>(), []);
  
  const isAuthenticated = !!user && !!session;
  const isAdmin = userRole === 'super_admin' || userRole === 'admin';
  
  /**
   * Initialize auth state and set up listener
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        setUser(sessionData.session?.user || null);
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event);
            setSession(newSession);
            setUser(newSession?.user || null);
            
            // Clear caches on auth change
            roleCache.clear();
            permissionCache.clear();
            
            // Update user role if logged in
            if (newSession?.user) {
              await fetchUserRole(newSession.user.id);
              await fetchUserPermissions(newSession.user.id);
              
              // Record login for certain events
              if (event === 'SIGNED_IN') {
                recordUserSignIn(newSession.user.id);
              }
            } else {
              setUserRole(null);
              setPermissions([]);
            }
          }
        );
        
        // Initial role fetch if already logged in
        if (sessionData.session?.user) {
          await fetchUserRole(sessionData.session.user.id);
          await fetchUserPermissions(sessionData.session.user.id);
        }
        
        setIsInitialized(true);
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize authentication'));
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  /**
   * Fetch user role from the edge function
   */
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('rbac-manager', {
        body: {
          action: 'get_role',
          userId
        }
      });
      
      if (error) throw error;
      
      setUserRole(data.role as UserRole);
      console.log('User role:', data.role);
      
      return data.role;
    } catch (err) {
      console.error('Error fetching user role:', err);
      // Default to player role for safety
      setUserRole('player');
      return 'player';
    }
  };
  
  /**
   * Fetch user permissions from the edge function
   */
  const fetchUserPermissions = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('rbac-manager', {
        body: {
          action: 'get_permissions',
          userId
        }
      });
      
      if (error) throw error;
      
      // Extract permission names from the results
      const permissionNames = data.permissions.map((p: any) => p.name);
      setPermissions(permissionNames);
      console.log('User permissions:', permissionNames);
      
      return permissionNames;
    } catch (err) {
      console.error('Error fetching user permissions:', err);
      setPermissions([]);
      return [];
    }
  };
  
  /**
   * Record user sign in
   */
  const recordUserSignIn = async (userId: string) => {
    try {
      await supabase.functions.invoke('auth-manager', {
        body: {
          action: 'record_login',
          userId
        }
      });
    } catch (err) {
      console.error('Error recording user sign in:', err);
    }
  };
  
  /**
   * Refresh the user's session
   */
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      
      if (!session?.refresh_token) {
        throw new Error('No refresh token available');
      }
      
      const { data, error } = await supabase.functions.invoke('auth-manager', {
        body: {
          action: 'refresh',
          token: session.access_token
        }
      });
      
      if (error) throw error;
      
      // Update local session
      setSession(data.session);
      
      setIsLoading(false);
      return data.session;
    } catch (err) {
      console.error('Error refreshing session:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh session'));
      setIsLoading(false);
      throw err;
    }
  };
  
  /**
   * Check if user has a specific role (with inheritance support)
   */
  const hasRole = useCallback((role: string): boolean => {
    // Check cache first
    const cacheKey = `${user?.id || 'anonymous'}-${role}`;
    
    if (roleCache.has(cacheKey)) {
      return roleCache.get(cacheKey)!;
    }
    
    // Super admin has all roles
    if (userRole === 'super_admin') {
      roleCache.set(cacheKey, true);
      return true;
    }
    
    // Direct role match
    if (userRole === role) {
      roleCache.set(cacheKey, true);
      return true;
    }
    
    // No role match (more complex inheritance would be handled by the server)
    roleCache.set(cacheKey, false);
    return false;
  }, [user, userRole, roleCache]);
  
  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    // Check cache first
    const cacheKey = `${user?.id || 'anonymous'}-${permission}`;
    
    if (permissionCache.has(cacheKey)) {
      return permissionCache.get(cacheKey)!;
    }
    
    // Super admin has all permissions
    if (userRole === 'super_admin') {
      permissionCache.set(cacheKey, true);
      return true;
    }
    
    // Check if permission is in the list
    const hasPermissionValue = permissions.includes(permission);
    permissionCache.set(cacheKey, hasPermissionValue);
    return hasPermissionValue;
  }, [user, userRole, permissions, permissionCache]);
  
  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.user);
      
      // Fetch user role after sign in
      if (data.user) {
        await fetchUserRole(data.user.id);
        await fetchUserPermissions(data.user.id);
      }
      
      setIsLoading(false);
      
      toast({
        title: "Successfully signed in",
        description: `Welcome back, ${email}`,
      });
      
      return data;
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
      
      toast({
        title: "Sign in failed",
        description: err instanceof Error ? err.message : "An error occurred during sign in",
        variant: "destructive",
      });
      
      setIsLoading(false);
      throw err;
    }
  };
  
  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      setIsLoading(false);
      
      toast({
        title: "Sign up successful",
        description: "Please check your email for verification instructions",
      });
      
      return data;
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign up'));
      
      toast({
        title: "Sign up failed",
        description: err instanceof Error ? err.message : "An error occurred during sign up",
        variant: "destructive",
      });
      
      setIsLoading(false);
      throw err;
    }
  };
  
  /**
   * Sign out the current user
   */
  const signOut = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear user state
      setUser(null);
      setSession(null);
      setUserRole(null);
      setPermissions([]);
      
      // Clear caches
      roleCache.clear();
      permissionCache.clear();
      
      setIsLoading(false);
      
      toast({
        title: "Signed out successfully",
      });
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      
      toast({
        title: "Sign out failed",
        description: err instanceof Error ? err.message : "An error occurred during sign out",
        variant: "destructive",
      });
      
      setIsLoading(false);
      throw err;
    }
  };
  
  /**
   * Request a password reset
   */
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setIsLoading(false);
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions",
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err instanceof Error ? err : new Error('Failed to reset password'));
      
      toast({
        title: "Password reset failed",
        description: err instanceof Error ? err.message : "An error occurred during password reset",
        variant: "destructive",
      });
      
      setIsLoading(false);
      throw err;
    }
  };
  
  /**
   * Update the user's password
   */
  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      setIsLoading(false);
      
      toast({
        title: "Password updated successfully",
        description: "Your password has been changed",
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err instanceof Error ? err : new Error('Failed to update password'));
      
      toast({
        title: "Password update failed",
        description: err instanceof Error ? err.message : "An error occurred during password update",
        variant: "destructive",
      });
      
      setIsLoading(false);
      throw err;
    }
  };
  
  /**
   * Invalidate all other sessions for the current user
   */
  const invalidateOtherSessions = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase.functions.invoke('auth-manager', {
        body: {
          action: 'invalidate_sessions',
          userId: user.id,
          sessionId: session?.access_token
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Other sessions terminated",
        description: `Successfully signed out from ${data.invalidatedSessions} other devices`,
      });
      
      return data;
    } catch (err) {
      console.error('Error invalidating sessions:', err);
      
      toast({
        title: "Failed to terminate other sessions",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
      
      throw err;
    }
  };
  
  /**
   * Verify if the current user has admin access
   */
  const verifyAdminAccess = async () => {
    try {
      if (!user) return false;
      
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'verify_admin'
        }
      });
      
      if (error) throw error;
      
      return data.isAdmin;
    } catch (err) {
      console.error('Error verifying admin access:', err);
      return false;
    }
  };
  
  /**
   * Check if admin action requires MFA
   */
  const requireMfaForAdmin = async (mfaCode?: string) => {
    try {
      if (!user) return { mfaRequired: false, mfaVerified: false };
      
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'require_mfa',
          mfaCode
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error checking MFA requirement:', err);
      throw err;
    }
  };
  
  const clearAuthError = () => setError(null);

  return {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    userRole,
    permissions,
    isInitialized,
    
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    
    hasRole,
    hasPermission,
    invalidateOtherSessions,
    verifyAdminAccess,
    requireMfaForAdmin,
    
    clearAuthError
  };
}
