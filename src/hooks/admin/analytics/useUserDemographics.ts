
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserDemographics } from '../types/analyticsTypes';

export const useUserDemographics = () => {
  return useQuery({
    queryKey: ['userDemographics'],
    queryFn: async () => {
      try {
        // Get total member count directly from profiles table instead of RPC
        const countResponse = await supabase.from('profiles').select('count');
        let totalMembersCount = 0;
        
        if (countResponse && !countResponse.error && countResponse.count !== null) {
          totalMembersCount = countResponse.count;
        } else if (countResponse.error) {
          console.error('Error fetching total members count:', countResponse.error);
        }
          
        // Get all members from the edge function
        const { data: allMembers, error: membersError } = await supabase
          .functions
          .invoke('get-all-users');
        
        if (membersError) throw membersError;
        
        // Gender distribution
        const genderDistribution: Record<string, number> = {};
        allMembers.forEach((member: any) => {
          const gender = member.gender || 'Not Specified';
          genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;
        });
        
        // Age distribution
        const ageDistribution: Record<string, number> = {};
        allMembers.forEach((member: any) => {
          const ageGroup = member.age_group || 'Not Specified';
          ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;
        });
        
        // Country distribution
        const countryDistribution: Record<string, number> = {};
        allMembers.forEach((member: any) => {
          const country = member.country || 'Not Specified';
          countryDistribution[country] = (countryDistribution[country] || 0) + 1;
        });
        
        return {
          gender_distribution: genderDistribution,
          age_distribution: ageDistribution,
          country_distribution: countryDistribution,
          total_members: totalMembersCount || allMembers?.length || 0
        } as UserDemographics;
      } catch (error) {
        console.error('Error fetching member demographics:', error);
        throw error;
      }
    }
  });
};
