
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserDemographics } from '../types/analyticsTypes';

export const useUserDemographics = () => {
  return useQuery({
    queryKey: ['userDemographics'],
    queryFn: async () => {
      try {
        // First, let's check what columns are actually available in the profiles table
        const { data: profileColumns, error: columnsError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (columnsError) {
          console.error('Error fetching profile columns:', columnsError);
          throw columnsError;
        }

        // Build the query based on available columns
        let query = supabase.from('profiles').select();

        // Fetch profiles data
        const { data: users, error } = await query;

        if (error) {
          console.error('Error fetching user demographics:', error);
          throw error;
        }

        const genderCounts: Record<string, number> = { 'not_specified': 0 };
        const ageCounts: Record<string, number> = { 'not_specified': 0 };
        const countryCounts: Record<string, number> = { 'not_specified': 0 };

        if (users) {
          users.forEach((profile: any) => {
            if (profile) {
              // Process gender - check if the column exists in the profile data
              if ('gender' in profile) {
                const gender = profile.gender || 'not_specified';
                genderCounts[gender] = (genderCounts[gender] || 0) + 1;
              } else {
                genderCounts['not_specified'] = (genderCounts['not_specified'] || 0) + 1;
              }

              // Process age group - check if the column exists in the profile data
              if ('age_group' in profile) {
                const ageGroup = profile.age_group || 'not_specified';
                ageCounts[ageGroup] = (ageCounts[ageGroup] || 0) + 1;
              } else {
                ageCounts['not_specified'] = (ageCounts['not_specified'] || 0) + 1;
              }

              // Process country - check if the column exists in the profile data
              if ('country' in profile) {
                const country = profile.country || 'not_specified';
                countryCounts[country] = (countryCounts[country] || 0) + 1;
              } else {
                countryCounts['not_specified'] = (countryCounts['not_specified'] || 0) + 1;
              }
            }
          });
        }

        return {
          gender_distribution: genderCounts,
          age_distribution: ageCounts,
          country_distribution: countryCounts
        } as UserDemographics;
      } catch (err) {
        console.error('Error in user demographics query:', err);
        return {
          gender_distribution: { 'not_specified': 0 },
          age_distribution: { 'not_specified': 0 },
          country_distribution: { 'not_specified': 0 }
        };
      }
    }
  });
};
