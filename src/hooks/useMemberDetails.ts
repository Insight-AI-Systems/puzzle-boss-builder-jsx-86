
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { UserRole, Gender } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

export function useMemberDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchMemberDetails = useCallback(async (memberId: string): Promise<MemberDetailedProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching member details for ID:', memberId);
      
      // Fetch member profile using the correct ID field
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', memberId) // Use id instead of member_id
        .single();

      if (profileError) {
        console.error('Error fetching member profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Try to fetch financial summary, but don't fail if it doesn't exist
      let financialData = null;
      try {
        const { data: finData, error: financialError } = await supabase
          .rpc('get_member_financial_summary', { member_id_param: memberId });
        
        if (!financialError && finData && finData[0]) {
          financialData = finData[0];
        }
      } catch (err) {
        console.warn('Could not fetch financial data:', err);
      }

      // Create the member profile with available data
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
        username: profile.username,
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
        gender: profile.gender as Gender | null,
        custom_gender: profile.custom_gender,
        age_group: profile.age_group,
        addresses: [], // Initialize as empty array
        membership_details: undefined, // Will be populated later if needed
        financial_summary: financialData ? {
          total_spend: financialData.total_spend || 0,
          total_prizes: financialData.total_prizes || 0,
          membership_revenue: financialData.membership_revenue || 0,
          puzzle_revenue: financialData.puzzle_revenue || 0,
          last_payment_date: financialData.last_payment_date,
          membership_status: financialData.membership_status || 'none',
          xero_contact_id: financialData.xero_contact_id,
          membership_end_date: financialData.membership_end_date,
          lifetime_value: financialData.lifetime_value || 0
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
  }, [toast]);

  return {
    isLoading,
    error,
    fetchMemberDetails
  };
}
