
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useUserProfile() {
  const { user, isAuthenticated, userRole, isAdmin } = useAuth();
  
  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!data) {
          // Create a basic profile if none exists
          return {
            id: user.id,
            email: user.email || '',
            display_name: user.email || 'Anonymous User',
            bio: null,
            avatar_url: null,
            role: userRole || 'player',
            country: null,
            categories_played: [],
            credits: 0,
            achievements: [],
            referral_code: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as UserProfile;
        }

        const profile: UserProfile = {
          id: data.id,
          email: data.email,
          display_name: data.username || data.email || 'Anonymous User',
          bio: data.bio,
          avatar_url: data.avatar_url,
          role: data.role as UserRole,
          country: data.country,
          categories_played: [],
          credits: data.credits || 0,
          achievements: [],
          referral_code: null,
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        return profile;
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Return a fallback profile on error
        return {
          id: user.id,
          email: user.email || '',
          display_name: user.email || 'Anonymous User',
          bio: null,
          avatar_url: null,
          role: userRole || 'player',
          country: null,
          categories_played: [],
          credits: 0,
          achievements: [],
          referral_code: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserProfile;
      }
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once
  });

  return {
    profile,
    isLoading: profileLoading,
    isAuthenticated,
    isAdmin,
    error
  };
}
