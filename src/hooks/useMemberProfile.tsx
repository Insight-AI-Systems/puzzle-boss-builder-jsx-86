import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MemberDetailedProfile, MemberAddress, AddressType, MembershipDetail, XeroMemberMapping } from '@/types/memberTypes';
import { toast } from '@/hooks/use-toast';

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export function useMemberProfile(userId?: string) {
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  
  // Use currently logged in user ID if none provided
  const targetUserId = userId || user?.id;
  
  // Fetch member profile with extended details including wallet
  const profileQuery = useQuery({
    queryKey: ['member-profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;

      try {
        console.log('Fetching profile for user:', targetUserId);
        
        // Fetch the basic profile using clerk_user_id
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_user_id', targetUserId)
          .single();

        if (profileError) {
          throw new Error(`Failed to fetch profile: ${profileError.message}`);
        }

        console.log('Profile data fetched:', profileData);

        const supabaseProfileId = profileData.id; // This is the actual Supabase profile ID

        // Fetch wallet information using the Supabase profile ID
        const { data: walletData, error: walletError } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', supabaseProfileId)
          .maybeSingle();

        if (walletError) {
          console.error('Error fetching wallet:', walletError);
        }

        // Fetch addresses using the Supabase profile ID
        const { data: addressesData, error: addressError } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('member_id', supabaseProfileId);

        if (addressError) {
          console.error('Error fetching addresses:', addressError);
        }

        // Fetch Xero mapping using the Supabase profile ID
        const { data: xeroMappingData, error: xeroError } = await supabase
          .from('xero_user_mappings')
          .select('*')
          .eq('user_id', supabaseProfileId)
          .maybeSingle();

        if (xeroError) {
          console.error('Error fetching Xero mapping:', xeroError);
        }

        // Fetch membership details using the Supabase profile ID
        const { data: membershipDetailsData, error: membershipError } = await supabase
          .from('user_membership_details')
          .select('*')
          .eq('member_id', supabaseProfileId)
          .maybeSingle();

        if (membershipError) {
          console.error('Error fetching membership details:', membershipError);
        }

        // Get financial summary using the Supabase profile ID
        const { data: financialSummary, error: financialError } = await supabase.rpc(
          'get_member_financial_summary',
          { member_id_param: supabaseProfileId }
        );

        if (financialError) {
          console.error('Error fetching financial summary:', financialError);
        }

        // Map addresses to correct type
        const addresses: MemberAddress[] = addressesData ? addressesData.map((addr: any) => ({
          ...addr,
          address_type: addr.address_type as AddressType
        })) : [];

        // Map Xero mapping to correct type
        const xeroMapping: XeroMemberMapping | undefined = xeroMappingData ? {
          ...xeroMappingData,
          member_id: xeroMappingData.user_id, // Map user_id to member_id for consistency
          sync_status: xeroMappingData.sync_status as 'active' | 'inactive' | 'error'
        } : undefined;

        // Map membership details to correct type
        const membershipDetails: MembershipDetail | undefined = membershipDetailsData ? {
          ...membershipDetailsData,
          status: membershipDetailsData.status as 'active' | 'expired' | 'canceled' | 'suspended'
        } : undefined;

        const memberProfile: MemberDetailedProfile & { wallet?: UserWallet } = {
          ...profileData,
          display_name: profileData.username || profileData.full_name || 'Member',
          addresses,
          xero_mapping: xeroMapping,
          membership_details: membershipDetails,
          financial_summary: financialSummary?.[0] || undefined,
          terms_accepted: profileData.terms_accepted || false,
          marketing_opt_in: profileData.marketing_opt_in || false,
          wallet: walletData || undefined,
        };

        console.log('Final member profile:', memberProfile);
        return memberProfile;
      } catch (err) {
        console.error('Error in useMemberProfile:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        return null;
      }
    },
    enabled: !!targetUserId,
  });

  // Update profile mutation - Uses the Supabase profile ID for updates
  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<MemberDetailedProfile>) => {
      if (!targetUserId) throw new Error('No user ID provided');

      // First get the Supabase profile ID
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', targetUserId)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          username: profileData.username,
          bio: profileData.bio,
          phone: profileData.phone,
          date_of_birth: profileData.date_of_birth,
          tax_id: profileData.tax_id,
          marketing_opt_in: profileData.marketing_opt_in,
          terms_accepted: profileData.terms_accepted,
          terms_accepted_at: profileData.terms_accepted_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['member-profile', targetUserId] });
    },
    onError: (err) => {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : 'Failed to update profile',
        variant: "destructive",
      });
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
    },
  });

  // Add/update address mutation - Uses the Supabase profile ID
  const upsertAddress = useMutation({
    mutationFn: async (address: Partial<MemberAddress> & { id?: string }) => {
      if (!targetUserId) throw new Error('No user ID provided');

      // First get the Supabase profile ID
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', targetUserId)
        .single();

      if (fetchError) throw fetchError;

      const supabaseProfileId = existingProfile.id;

      // If we have an ID, update existing address
      if (address.id) {
        const { data, error } = await supabase
          .from('user_addresses')
          .update({
            address_type: address.address_type,
            is_default: address.is_default,
            address_line1: address.address_line1,
            address_line2: address.address_line2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
          })
          .eq('id', address.id)
          .eq('member_id', supabaseProfileId)
          .select();

        if (error) throw error;
        return data;
      }
      // Otherwise insert new address
      else {
        const { data, error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: supabaseProfileId,
            member_id: supabaseProfileId,
            address_type: address.address_type,
            is_default: address.is_default,
            address_line1: address.address_line1,
            address_line2: address.address_line2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
          })
          .select();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({
        title: "Address Updated",
        description: "Your address has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['member-profile', targetUserId] });
    },
    onError: (err) => {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : 'Failed to update address',
        variant: "destructive",
      });
    },
  });

  // Delete address mutation - Uses the Supabase profile ID
  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      if (!targetUserId) throw new Error('No user ID provided');

      // First get the Supabase profile ID
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', targetUserId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('member_id', existingProfile.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Address Deleted",
        description: "The address has been removed from your profile.",
      });
      queryClient.invalidateQueries({ queryKey: ['member-profile', targetUserId] });
    },
    onError: (err) => {
      toast({
        title: "Deletion Failed",
        description: err instanceof Error ? err.message : 'Failed to delete address',
        variant: "destructive",
      });
    },
  });

  // Accept terms mutation - Uses the Supabase profile ID
  const acceptTerms = useMutation({
    mutationFn: async () => {
      if (!targetUserId) throw new Error('No user ID provided');

      // First get the Supabase profile ID
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', targetUserId)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('profiles')
        .update({
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Terms Accepted",
        description: "You have successfully accepted the terms and conditions.",
      });
      queryClient.invalidateQueries({ queryKey: ['member-profile', targetUserId] });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to accept terms',
        variant: "destructive",
      });
    },
  });

  // Award credits mutation (admin only) - Uses the Supabase profile ID
  const awardCredits = useMutation({
    mutationFn: async ({ targetUserId, credits, adminNote }: { targetUserId: string; credits: number; adminNote?: string }) => {
      console.log('Awarding credits:', { targetUserId, credits, adminNote });
      
      // First get the Supabase profile ID from the Clerk user ID
      const { data: targetProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', targetUserId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase.rpc('award_credits', {
        target_user_id: targetProfile.id, // Use the Supabase profile ID
        credits_to_add: credits,
        admin_note: adminNote || null
      });

      if (error) {
        console.error('Error awarding credits:', error);
        throw error;
      }
      
      console.log('Credits awarded successfully');
      return true;
    },
    onSuccess: (_, variables) => {
      console.log('Credits award mutation succeeded, invalidating queries');
      toast({
        title: "Credits Awarded",
        description: "Free credits have been successfully awarded to the user.",
      });
      
      // Invalidate multiple related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['member-profile', variables.targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['profile', variables.targetUserId] });
      
      // Also refetch the current profile data immediately
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['member-profile', variables.targetUserId] });
      }, 100);
    },
    onError: (err) => {
      console.error('Credits award mutation failed:', err);
      toast({
        title: "Award Failed",
        description: err instanceof Error ? err.message : 'Failed to award credits',
        variant: "destructive",
      });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error,
    updateProfile,
    upsertAddress,
    deleteAddress,
    acceptTerms,
    awardCredits,
    refetch: profileQuery.refetch,
  };
}
