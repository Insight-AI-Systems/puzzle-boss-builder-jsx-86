
import { useMutation } from '@tanstack/react-query';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export interface UserWallet {
  id: string;
  balance: number;
  currency: string;
}

export interface MemberDetailedProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  credits?: number;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  clerk_user_id?: string;
  location?: string;
  dateOfBirth?: string;
  gender?: string;
  ageGroup?: string;
  phone?: string;
  display_name?: string;
  // Add other profile fields as needed
}

export const useMemberProfile = () => {
  const { user, profile: clerkProfile, isLoading: clerkLoading, userRole, isAdmin } = useClerkAuth();

  // Convert Clerk profile to the expected format
  const profile = clerkProfile ? {
    id: clerkProfile.id,
    username: clerkProfile.username || '',
    email: clerkProfile.email || '',
    role: clerkProfile.role || 'player',
    credits: 0, // Default value, can be updated from database
    bio: clerkProfile.bio,
    avatar_url: clerkProfile.avatar_url,
    created_at: clerkProfile.created_at,
    updated_at: clerkProfile.updated_at,
    clerk_user_id: clerkProfile.clerk_user_id,
    location: '', // Default values for missing fields
    dateOfBirth: '',
    gender: '',
    ageGroup: '',
    phone: '',
    display_name: clerkProfile.display_name,
    addresses: [], // Mock for now
    membership_details: null // Mock for now
  } : null;

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<MemberDetailedProfile>) => {
      console.log('Updating profile:', data);
      // TODO: Implement actual profile update with Supabase
      return true;
    }
  });

  const acceptTermsMutation = useMutation({
    mutationFn: async () => {
      console.log('Accepting terms');
      // TODO: Implement actual terms acceptance
      return true;
    }
  });

  return {
    profile,
    isLoading: clerkLoading,
    isAdmin,
    error: null,
    updateProfile: updateProfileMutation.mutateAsync,
    upsertAddress: async () => true,
    deleteAddress: async () => true,
    acceptTerms: acceptTermsMutation.mutateAsync
  };
};
