
import { useQuery } from '@tanstack/react-query';
import { userRepository } from '@/data/repositories/UserRepository';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useProfileData(userId: string | null) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const user = await userRepository.getUser(userId);
      
      if (!user) return null;
      
      const profile: UserProfile = {
        id: user.id,
        email: user.email,
        display_name: user.username,
        bio: user.bio,
        avatar_url: user.avatar_url,
        role: user.role as UserRole,
        country: user.country,
        categories_played: [],
        credits: user.credits,
        achievements: [],
        referral_code: null,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
      
      return profile;
    },
    enabled: !!userId,
  });
}
