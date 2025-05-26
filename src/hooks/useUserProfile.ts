
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useUserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allProfiles, setAllProfiles] = useState<{ data: UserProfile[] }>({ data: [] });
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

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
            role: data.role as UserRole,
          } as UserProfile);
        } else {
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

  const fetchAllProfiles = async () => {
    setIsLoadingProfiles(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all profiles:', error);
        setAllProfiles({ data: [] });
      } else {
        const mappedProfiles = (data || []).map(item => ({
          ...item,
          role: item.role as UserRole,
        })) as UserProfile[];
        setAllProfiles({ data: mappedProfiles });
      }
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      setAllProfiles({ data: [] });
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const updateUserRole = {
    mutate: async ({ targetUserId, newRole }: { targetUserId: string; newRole: UserRole }) => {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', targetUserId);

        if (error) {
          throw error;
        }

        await fetchAllProfiles();
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllProfiles();
    }
  }, [isAuthenticated]);

  return { 
    profile, 
    isLoading, 
    allProfiles, 
    isLoadingProfiles, 
    updateUserRole 
  };
}
