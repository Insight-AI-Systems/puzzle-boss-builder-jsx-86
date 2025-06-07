import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MemberDetailedProfile, MemberAddress, AddressType, MembershipDetail, XeroMemberMapping } from '@/types/memberTypes';
import { toast } from '@/hooks/use-toast';

export function useMemberProfile(userId?: string) {
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  
  // Use currently logged in user ID if none provided
  const targetUserId = userId || user?.id;
  
  // Fetch member profile with extended details
  const profileQuery = useQuery({
    queryKey: ['member-profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;

      try {
        // Fetch the basic profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single();

        if (profileError) {
          throw new Error(`Failed to fetch profile: ${profileError.message}`);
        }

        // Fetch addresses
        const { data: addressesData, error: addressError } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('member_id', targetUserId);

        if (addressError) {
          console.error('Error fetching addresses:', addressError);
        }

        // Fetch Xero mapping
        const { data: xeroMappingData, error: xeroError } = await supabase
          .from('xero_user_mappings')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle();

        if (xeroError) {
          console.error('Error fetching Xero mapping:', xeroError);
        }

        // Fetch membership details
        const { data: membershipDetailsData, error: membershipError } = await supabase
          .from('user_membership_details')
          .select('*')
          .eq('member_id', targetUserId)
          .maybeSingle();

        if (membershipError) {
          console.error('Error fetching membership details:', membershipError);
        }

        // Get financial summary
        const { data: financialSummary, error: financialError } = await supabase.rpc(
          'get_member_financial_summary',
          { member_id_param: targetUserId }
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

        const memberProfile: MemberDetailedProfile = {
          ...profileData,
          display_name: profileData.username || profileData.full_name || 'Member',
          addresses,
          xero_mapping: xeroMapping,
          membership_details: membershipDetails,
          financial_summary: financialSummary?.[0] || undefined,
          terms_accepted: profileData.terms_accepted || false,
          marketing_opt_in: profileData.marketing_opt_in || false,
        };

        return memberProfile;
      } catch (err) {
        console.error('Error in useMemberProfile:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        return null;
      }
    },
    enabled: !!targetUserId,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<MemberDetailedProfile>) => {
      if (!targetUserId) throw new Error('No user ID provided');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address_line1: profileData.address_line1,
          address_line2: profileData.address_line2,
          city: profileData.city,
          state: profileData.state,
          postal_code: profileData.postal_code,
          country: profileData.country,
          date_of_birth: profileData.date_of_birth,
          tax_id: profileData.tax_id,
          marketing_opt_in: profileData.marketing_opt_in,
          terms_accepted: profileData.terms_accepted,
          terms_accepted_at: profileData.terms_accepted_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUserId)
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

  // Add/update address mutation
  const upsertAddress = useMutation({
    mutationFn: async (address: Partial<MemberAddress> & { id?: string }) => {
      if (!targetUserId) throw new Error('No user ID provided');

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
          .eq('member_id', targetUserId)
          .select();

        if (error) throw error;
        return data;
      }
      // Otherwise insert new address
      else {
        const { data, error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: targetUserId,
            member_id: targetUserId, // Add required member_id field
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

  // Delete address mutation
  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      if (!targetUserId) throw new Error('No user ID provided');

      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('member_id', targetUserId);

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

  // Accept terms mutation
  const acceptTerms = useMutation({
    mutationFn: async () => {
      if (!targetUserId) throw new Error('No user ID provided');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        })
        .eq('id', targetUserId)
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

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error,
    updateProfile,
    upsertAddress,
    deleteAddress,
    acceptTerms,
    refetch: profileQuery.refetch,
  };
}
