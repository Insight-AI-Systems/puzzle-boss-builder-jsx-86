
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import { useAuthState } from './useAuthState';

export function useAuthProvider() {
  const { currentUserId, session, isLoading: authStateLoading, error: authStateError } = useAuthState();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [lastAuthAttempt, setLastAuthAttempt] = useState<number>(0);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<AuthError | Error | null>(authStateError);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const MIN_TIME_BETWEEN_AUTH_ATTEMPTS = 2000;
  
  const isAuthenticated = useMemo(() => !!currentUserId && !!session, [currentUserId, session]);
  const isAdmin = useMemo(() => userRole === 'admin' || userRole === 'super_admin', [userRole]);

  const clearAuthError = () => setError(null);

  const fetchUserRoles = async (userId: string) => {
    try {
      // Add more debug logging
      console.log('fetchUserRoles - Fetching roles for user ID:', userId);
      console.log('fetchUserRoles - Current user email:', session?.user?.email);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      // Special case for super admin email
      if (session?.user?.email === 'alan@insight-ai-systems.com') {
        console.log('fetchUserRoles - Special super admin email detected');
        setUserRoles(['super_admin']);
        setUserRole('super_admin');
        return;
      }

      // Log the test email for debugging
      if (session?.user?.email === 'rob.small.1234@gmail.com') {
        console.log('fetchUserRoles - Test email detected:', session.user.email);
        console.log('fetchUserRoles - Current profile data:', profile);
      }

      if (profile && profile.role) {
        console.log('fetchUserRoles - Role found in profile:', profile.role);
        setUserRoles([profile.role]);
        setUserRole(profile.role as UserRole);
        return;
      }

      // Legacy support for user_roles table
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return;
      }

      if (roles && roles.length > 0) {
        const extractedRoles = roles.map(roleObj => roleObj.role);
        console.log('fetchUserRoles - Roles found in user_roles table:', extractedRoles);
        setUserRoles(extractedRoles);
        setUserRole(extractedRoles[0] as UserRole);
      } else {
        console.log('fetchUserRoles - No roles found, defaulting to player');
        setUserRoles(['player']);
        setUserRole('player');
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles(['player']);
      setUserRole('player');
    }
  };

  return {
    user: session?.user ?? null,
    session,
    isLoading: authStateLoading,
    error,
    isAuthenticated,
    isAdmin,
    userRole,
    userRoles,
    clearAuthError,
    fetchUserRoles,
    setError,
    lastAuthAttempt,
    setLastAuthAttempt,
    MIN_TIME_BETWEEN_AUTH_ATTEMPTS,
    toast,
    navigate
  };
}
