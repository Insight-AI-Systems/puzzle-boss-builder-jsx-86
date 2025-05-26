
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/userTypes';

export function useUserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          setProfile(null);
        } else if (data) {
          setProfile({
            ...data,
            email: user.email,
          });
        } else {
          // Create a basic profile if none exists
          setProfile({
            id: user.id,
            email: user.email,
            username: user.email?.split('@')[0],
            display_name: user.email?.split('@')[0],
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, isAuthenticated]);

  return { profile, isLoading };
}
