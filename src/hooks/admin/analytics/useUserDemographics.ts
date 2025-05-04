
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserDemographics } from '../types/analyticsTypes';

export const useUserDemographics = () => {
  return useQuery({
    queryKey: ['userDemographics'],
    queryFn: async () => {
      try {
        // First, get total user count directly from auth.users (through RPC) with generic typing
        const countResponse = await supabase.rpc('count_total_users');
        const { count: totalUsersCount, error: countError } = countResponse as unknown as { 
          count: number | null, 
          error: any 
        };
          
        if (countError) {
          console.error('Error fetching total users count:', countError);
          // Fallback to get-all-users if RPC fails
          const { data: allUsers, error: usersError } = await supabase
            .functions
            .invoke('get-all-users');
          
          if (usersError) throw usersError;
          
          const userCount = allUsers?.length || 0;
          
          // Gender distribution
          const genderDistribution: Record<string, number> = {};
          allUsers.forEach((user: any) => {
            const gender = user.gender || 'Not Specified';
            genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;
          });
          
          // Age distribution
          const ageDistribution: Record<string, number> = {};
          allUsers.forEach((user: any) => {
            const ageGroup = user.age_group || 'Not Specified';
            ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;
          });
          
          // Country distribution
          const countryDistribution: Record<string, number> = {};
          allUsers.forEach((user: any) => {
            const country = user.country || 'Not Specified';
            countryDistribution[country] = (countryDistribution[country] || 0) + 1;
          });
          
          return {
            gender_distribution: genderDistribution,
            age_distribution: ageDistribution,
            country_distribution: countryDistribution,
            total_users: userCount
          } as UserDemographics;
        }
        
        // Continue if the RPC call was successful
        // Get all users from the edge function
        const { data: allUsers, error: usersError } = await supabase
          .functions
          .invoke('get-all-users');
        
        if (usersError) throw usersError;
        
        // Gender distribution
        const genderDistribution: Record<string, number> = {};
        allUsers.forEach((user: any) => {
          const gender = user.gender || 'Not Specified';
          genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;
        });
        
        // Age distribution
        const ageDistribution: Record<string, number> = {};
        allUsers.forEach((user: any) => {
          const ageGroup = user.age_group || 'Not Specified';
          ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;
        });
        
        // Country distribution
        const countryDistribution: Record<string, number> = {};
        allUsers.forEach((user: any) => {
          const country = user.country || 'Not Specified';
          countryDistribution[country] = (countryDistribution[country] || 0) + 1;
        });
        
        return {
          gender_distribution: genderDistribution,
          age_distribution: ageDistribution,
          country_distribution: countryDistribution,
          total_users: totalUsersCount || 0
        } as UserDemographics;
      } catch (error) {
        console.error('Error fetching user demographics:', error);
        throw error;
      }
    }
  });
};
