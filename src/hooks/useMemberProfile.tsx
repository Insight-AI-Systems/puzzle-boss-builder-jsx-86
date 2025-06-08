
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

      console.log('Updating profile for user:', user.id, 'with data:', updates);

      // Only include fields that are actually being updated and exist in the database
      const allowedFields = {
        full_name: updates.full_name,
        username: updates.username,
        bio: updates.bio,
        date_of_birth: updates.date_of_birth,
      };

      // Remove undefined values
      const filteredUpdates = Object.fromEntries(
        Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
      );

      console.log('Filtered updates to send:', filteredUpdates);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...filteredUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      console.log('Profile update successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Profile update mutation succeeded:', data);
      queryClient.invalidateQueries({ queryKey: ['member-profile', user?.id] });
      toast.success('Profile updated successfully!');
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
  };
}
