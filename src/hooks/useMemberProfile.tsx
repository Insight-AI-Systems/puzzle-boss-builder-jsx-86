
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { toast } from "sonner";

export interface UserWallet {
  balance: number;
  currency: string;
}

export function useMemberProfile() {
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['member-profile', user?.id],
    queryFn: async (): Promise<MemberDetailedProfile | null> => {
      if (!user?.id) return null;

      try {
        console.log('Fetching profile for Clerk user ID:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          throw new Error(`Failed to fetch profile: ${error.message}`);
        }

        console.log('Profile data retrieved:', data);
        
        if (!data) return null;

        const profile: MemberDetailedProfile = {
          id: data.id,
          email: user.email || data.email || null,
          display_name: data.username || data.full_name || null,
          bio: data.bio || null,
          avatar_url: data.avatar_url,
          role: data.role || 'player',
          country: data.country || null,
          categories_played: data.categories_played || [],
          credits: data.credits || 0,
          achievements: [],
          referral_code: null,
          created_at: data.created_at,
          updated_at: data.updated_at,
          full_name: data.full_name || null,
          username: data.username || null,
          phone: data.phone || null,
          address_line1: data.address_line1 || null,
          address_line2: data.address_line2 || null,
          city: data.city || null,
          state: data.state || null,
          postal_code: data.postal_code || null,
          date_of_birth: data.date_of_birth || null,
          tax_id: data.tax_id || null,
          terms_accepted: data.terms_accepted || false,
          terms_accepted_at: data.terms_accepted_at || null,
          marketing_opt_in: data.marketing_opt_in || false,
          gender: data.gender as 'male' | 'female' | 'non-binary' | 'custom' | 'prefer-not-to-say' | 'other' | null || null,
          custom_gender: data.custom_gender || null,
          age_group: data.age_group || null,
        };

        return profile;
      } catch (err) {
        console.error('Error in useMemberProfile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        return null;
      }
    },
    enabled: !!user?.id && isAuthenticated,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<MemberDetailedProfile>) => {
      if (!user?.id) {
        throw new Error('No user ID available');
      }

      console.log('=== PROFILE UPDATE DEBUG ===');
      console.log('Clerk User ID:', user.id);
      console.log('User authenticated:', isAuthenticated);
      console.log('Updates to apply:', updates);

      // Only include the specific fields that are being updated from the form
      const allowedFields: Record<string, any> = {};
      
      if (updates.full_name !== undefined) allowedFields.full_name = updates.full_name;
      if (updates.username !== undefined) allowedFields.username = updates.username;
      if (updates.bio !== undefined) allowedFields.bio = updates.bio;
      if (updates.date_of_birth !== undefined) allowedFields.date_of_birth = updates.date_of_birth;
      if (updates.gender !== undefined) allowedFields.gender = updates.gender;
      if (updates.custom_gender !== undefined) allowedFields.custom_gender = updates.custom_gender;
      if (updates.age_group !== undefined) allowedFields.age_group = updates.age_group;

      console.log('Filtered updates to send:', allowedFields);

      // First, verify the current profile exists
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, clerk_user_id, email, username')
        .eq('clerk_user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current profile for update:', fetchError);
        throw new Error(`Failed to find profile: ${fetchError.message}`);
      }

      console.log('Current profile found:', currentProfile);

      // Perform the update using the profile ID
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...allowedFields,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProfile.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error details:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      console.log('Profile update successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Profile update mutation succeeded:', data);
      // Invalidate and refetch the profile data
      queryClient.invalidateQueries({ queryKey: ['member-profile', user?.id] });
      queryClient.refetchQueries({ queryKey: ['member-profile', user?.id] });
      toast.success('Profile updated successfully!');
      setError(null); // Clear any previous errors
    },
    onError: (error) => {
      console.error('Profile update mutation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    },
  });

  const acceptTerms = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('No user ID available');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('clerk_user_id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to accept terms: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-profile', user?.id] });
      queryClient.refetchQueries({ queryKey: ['member-profile', user?.id] });
      toast.success('Terms accepted successfully!');
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept terms';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    },
  });

  // Mock implementations for other functions to maintain interface compatibility
  const upsertAddress = useMutation({
    mutationFn: async () => {
      throw new Error('Address management not implemented yet');
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async () => {
      throw new Error('Address management not implemented yet');
    },
  });

  const awardCredits = useMutation({
    mutationFn: async ({ targetUserId, credits, adminNote }: { targetUserId: string; credits: number; adminNote?: string }) => {
      const { error } = await supabase.rpc('award_credits', {
        target_user_id: targetUserId,
        credits_to_add: credits,
        admin_note: adminNote
      });

      if (error) {
        throw new Error(`Failed to award credits: ${error.message}`);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-profile'] });
      toast.success('Credits awarded successfully!');
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to award credits';
      toast.error(errorMessage);
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: error || (profileQuery.error instanceof Error ? profileQuery.error : null),
    updateProfile,
    acceptTerms,
    upsertAddress,
    deleteAddress,
    awardCredits,
    refetch: profileQuery.refetch,
  };
}
