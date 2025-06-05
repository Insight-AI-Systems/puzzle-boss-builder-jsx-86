
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';

interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  roles?: string[];
}

export function useUserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!isAuthenticated || !user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Check if we have a valid session before making requests
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('useUserProfile - No session available');
          setProfile(null);
          setIsLoading(false);
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            full_name,
            email,
            avatar_url
          `)
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError(profileError.message);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Exception in fetchProfile:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [user, isAuthenticated]);

  return { profile, isLoading, error };
}
