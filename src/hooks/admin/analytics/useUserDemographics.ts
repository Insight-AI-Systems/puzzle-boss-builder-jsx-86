
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserDemographics } from '../types/analyticsTypes';

export const useUserDemographics = () => {
  return useQuery({
    queryKey: ['userDemographics'],
    queryFn: async () => {
      try {
        const { data: users } = await supabase
          .from('profiles')
          .select('gender:role, age_group, country');

        const genderCounts: Record<string, number> = { 'not_specified': 0 };
        const ageCounts: Record<string, number> = { 'not_specified': 0 };
        const countryCounts: Record<string, number> = { 'not_specified': 0 };

        if (users) {
          users.forEach((profile) => {
            if (profile) {
              // Process gender
              const gender = profile.role || 'not_specified';
              genderCounts[gender] = (genderCounts[gender] || 0) + 1;

              // Process age group
              const ageGroup = profile.age_group || 'not_specified';
              ageCounts[ageGroup] = (ageCounts[ageGroup] || 0) + 1;

              // Process country
              const country = profile.country || 'not_specified';
              countryCounts[country] = (countryCounts[country] || 0) + 1;
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
