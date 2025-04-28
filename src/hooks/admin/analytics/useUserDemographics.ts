
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserDemographics } from '../types/analyticsTypes';

export const useUserDemographics = () => {
  return useQuery({
    queryKey: ['userDemographics'],
    queryFn: async () => {
      try {
        const { data: tableCheck, error: tableError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
          
        if (tableError) {
          console.error('Error checking profiles table:', tableError);
          return {
            gender_distribution: { 'not_specified': 0 },
            age_distribution: { 'not_specified': 0 },
            country_distribution: { 'not_specified': 0 }
          };
        }

        const { count: userCount, error: countError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
        
        if (countError) {
          console.error('Error getting user count:', countError);
          return {
            gender_distribution: { 'not_specified': 0 },
            age_distribution: { 'not_specified': 0 },
            country_distribution: { 'not_specified': 0 }
          };
        }
        
        const genderCounts: Record<string, number> = { 'not_specified': userCount || 0 };
        const ageCounts: Record<string, number> = { 'not_specified': userCount || 0 };
        const countryCounts: Record<string, number> = { 'not_specified': userCount || 0 };

        // Check for and process gender data
        try {
          const { data: genderData, error: genderError } = await supabase
            .from('profiles')
            .select('gender');
            
          if (!genderError && genderData) {
            genderCounts['not_specified'] = 0;
            genderData.forEach((profile) => {
              if (profile && profile.gender) {
                const gender = profile.gender;
                genderCounts[gender] = (genderCounts[gender] || 0) + 1;
              } else {
                genderCounts['not_specified']++;
              }
            });
          }
        } catch (error) {
          console.log('Error processing gender data:', error);
        }

        // Check for and process age group data
        try {
          const { data: ageData, error: ageError } = await supabase
            .from('profiles')
            .select('age_group');
            
          if (!ageError && ageData) {
            ageCounts['not_specified'] = 0;
            ageData.forEach((profile) => {
              if (profile && profile.age_group) {
                const ageGroup = profile.age_group;
                ageCounts[ageGroup] = (ageCounts[ageGroup] || 0) + 1;
              } else {
                ageCounts['not_specified']++;
              }
            });
          }
        } catch (error) {
          console.log('Error processing age data:', error);
        }

        // Check for and process country data
        try {
          const { data: countryData, error: countryError } = await supabase
            .from('profiles')
            .select('country');
            
          if (!countryError && countryData) {
            countryCounts['not_specified'] = 0;
            countryData.forEach((profile) => {
              if (profile && profile.country) {
                const country = profile.country;
                countryCounts[country] = (countryCounts[country] || 0) + 1;
              } else {
                countryCounts['not_specified']++;
              }
            });
          }
        } catch (error) {
          console.log('Error processing country data:', error);
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
