
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MemberDetailedProfile, MemberFinancialSummary, AddressType } from '@/types/memberTypes';
import { UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

export function useMemberDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchMemberDetails = async (memberId: string): Promise<MemberDetailedProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching member details for:', memberId);
      
      // Fetch member profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('member_id', memberId)
        .single();

      if (profileError) {
        console.error('Error fetching member profile:', profileError);
        throw profileError;
      }

      // Fetch financial summary using the new function
      const { data: financialData, error: financialError } = await supabase
        .rpc('get_member_financial_summary', { member_id_param: memberId });

      if (financialError) {
        console.error('Error fetching member financial summary:', financialError);
        // Don't throw here, just log and continue without financial data
      }

      // Fetch membership details
      const { data: membershipDetails, error: membershipError } = await supabase
        .from('user_membership_details')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (membershipError) {
        console.error('Error fetching membership details:', membershipError);
      }

      // Fetch addresses
      const { data: addresses, error: addressError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('member_id', memberId);

      if (addressError) {
        console.error('Error fetching member addresses:', addressError);
      }

      // Combine all data
      const memberProfile: MemberDetailedProfile = {
        id: profile.id,
        email: profile.email,
        display_name: profile.username || profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        role: (profile.role || 'player') as UserRole,
        country: profile.country,
        categories_played: profile.categories_played || [],
        credits: profile.credits || 0,
        tokens: profile.tokens || 0,
        achievements: [],
        referral_code: null,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        full_name: profile.full_name,
        phone: profile.phone,
        address_line1: profile.address_line1,
        address_line2: profile.address_line2,
        city: profile.city,
        state: profile.state,
        postal_code: profile.postal_code,
        date_of_birth: profile.date_of_birth,
        tax_id: profile.tax_id,
        terms_accepted: profile.terms_accepted || false,
        terms_accepted_at: profile.terms_accepted_at,
        marketing_opt_in: profile.marketing_opt_in || false,
        addresses: addresses ? addresses.map(addr => ({
          ...addr,
          type: addr.address_type as AddressType,
          line1: addr.address_line1,
          line2: addr.address_line2
        })) : [],
        membership_details: membershipDetails ? {
          ...membershipDetails,
          tier: membershipDetails.tier || 'basic',
          status: membershipDetails.status as 'active' | 'inactive' | 'suspended' | 'expired' | 'canceled'
        } : undefined,
        financial_summary: financialData && financialData[0] ? {
          total_spend: financialData[0].total_spend || 0,
          total_prizes: financialData[0].total_prizes || 0,
          membership_revenue: financialData[0].membership_revenue || 0,
          puzzle_revenue: financialData[0].puzzle_revenue || 0,
          last_payment_date: financialData[0].last_payment_date,
          membership_status: financialData[0].membership_status || 'none',
          xero_contact_id: financialData[0].xero_contact_id,
          membership_end_date: financialData[0].membership_end_date,
          lifetime_value: financialData[0].lifetime_value || 0
        } : undefined
      };

      console.log('Member details fetched successfully:', memberProfile);
      return memberProfile;

    } catch (err) {
      console.error('Error in fetchMemberDetails:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch member details';
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Error loading member details",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchMemberDetails
  };
}
