
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, profile, isLoading, userRole, isAdmin } = useAuth();

  // Convert profile to the expected format
  const memberProfile = profile ? {
    id: profile.id,
    username: profile.username || '',
    email: profile.email || '',
    role: profile.role || 'player',
    credits: 0, // Default value, can be updated from database
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    location: '', // Default values for missing fields
    dateOfBirth: '',
    gender: '',
    ageGroup: '',
    phone: '',
    display_name: profile.display_name,
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
    profile: memberProfile,
    isLoading,
    isAdmin,
    error: null,
    updateProfile: updateProfileMutation.mutateAsync,
    upsertAddress: async () => true,
    deleteAddress: async () => true,
    acceptTerms: acceptTermsMutation.mutateAsync
  };
};
