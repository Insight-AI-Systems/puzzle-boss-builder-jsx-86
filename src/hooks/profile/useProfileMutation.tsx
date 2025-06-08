
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userRepository } from '@/data/repositories/UserRepository';
import { UserProfile, UserRole } from '@/types/userTypes';

interface ProfileUpdateData {
  username?: string;
  bio?: string;
  avatar_url?: string | null;
}

export function useProfileMutation(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: ProfileUpdateData) => {
      if (!userId) throw new Error('No user ID provided');
      
      const updatedUser = await userRepository.updateUser(userId, {
        username: profileData.username,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url
      });
      
      const profile: UserProfile = {
        id: updatedUser.id,
        email: updatedUser.email,
        display_name: updatedUser.username,
        bio: updatedUser.bio,
        avatar_url: updatedUser.avatar_url,
        role: updatedUser.role as UserRole,
        country: updatedUser.country,
        categories_played: [],
        credits: updatedUser.credits,
        achievements: [],
        referral_code: null,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      };
      
      return profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', userId], data);
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    }
  });
}
