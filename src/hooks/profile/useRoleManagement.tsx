
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userRepository } from '@/data/repositories/UserRepository';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useRoleManagement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const updatedUser = await userRepository.updateUser(userId, {
        // Note: Role updates might need special handling in the repository
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
        tokens: updatedUser.tokens || 0, // Added tokens field
        achievements: [],
        referral_code: null,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      };
      
      return profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    }
  });
}
