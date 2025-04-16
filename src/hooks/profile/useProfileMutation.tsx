
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

export function useProfileMutation(profileId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      if (!profileId) throw new Error('No user ID provided');
      
      const profileUpdate = {
        username: updatedProfile.display_name,
        avatar_url: updatedProfile.avatar_url,
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', profileId)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedUserProfile: UserProfile = {
        id: data.id,
        display_name: data.username || null,
        bio: null,
        avatar_url: data.avatar_url,
        role: (data.role || 'player') as UserRole,
        credits: data.credits || 0,
        achievements: [],
        referral_code: null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
      
      return updatedUserProfile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', profileId], data);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  return { updateProfile };
}
