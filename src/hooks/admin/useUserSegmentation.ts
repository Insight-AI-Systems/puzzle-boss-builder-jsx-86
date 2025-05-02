
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface UserSegment {
  id: string;
  name: string;
  count: number;
  filters: {
    country: string;
    age: [number, number];
    gender: string[];
    category: string;
    prize: string;
  };
}

export function useUserSegmentation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filter states
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<[number, number]>([18, 65]);
  const [genderFilter, setGenderFilter] = useState<string[]>(['male', 'female']);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [prizeFilter, setPrizeFilter] = useState<string>('all');
  
  // User count state
  const [userCount, setUserCount] = useState<number>(0);
  const [loadingUserCount, setLoadingUserCount] = useState<boolean>(false);
  const [isLoadingOperation, setIsLoadingOperation] = useState<boolean>(false);

  // Fetch saved segments from the database
  const { 
    data: savedSegments, 
    isLoading: isLoadingSegments 
  } = useQuery({
    queryKey: ['user-segments'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_segments')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        return data.map(segment => ({
          id: segment.id,
          name: segment.name,
          count: segment.count,
          filters: segment.filters as UserSegment['filters']
        }));
      } catch (error) {
        console.error('Error fetching user segments:', error);
        throw error;
      }
    }
  });

  // Save segment mutation
  const saveSegmentMutation = useMutation({
    mutationFn: async ({ name, filters, count }: { name: string; filters: UserSegment['filters']; count: number }) => {
      const { data, error } = await supabase
        .from('user_segments')
        .insert({
          name,
          count,
          filters,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-segments'] });
    }
  });

  // Update user count based on current filters
  useEffect(() => {
    const fetchUserCount = async () => {
      setLoadingUserCount(true);
      try {
        // In a real implementation, this would count users that match all filters
        // For now, just simulate with random numbers until we have a proper backend endpoint
        const baseCount = Math.floor(Math.random() * 1000) + 100;
        
        // Apply fake filtering logic to simulate count changes
        let count = baseCount;
        
        if (countryFilter !== 'all') {
          count = Math.floor(count * 0.7); // Reduce by ~30% for country filter
        }
        
        if (ageFilter[0] > 18 || ageFilter[1] < 65) {
          const ageRange = ageFilter[1] - ageFilter[0];
          const percentOfFullRange = ageRange / (65 - 18);
          count = Math.floor(count * percentOfFullRange);
        }
        
        if (genderFilter.length < 2) {
          count = Math.floor(count * 0.5); // Split roughly in half if filtering by gender
        }
        
        if (categoryFilter !== 'all') {
          count = Math.floor(count * 0.4); // Filter by category reduces count
        }
        
        if (prizeFilter !== 'all') {
          count = Math.floor(count * (prizeFilter === 'winners' ? 0.2 : 0.8));
        }
        
        // Add a small delay to simulate API fetch
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setUserCount(count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      } finally {
        setLoadingUserCount(false);
      }
    };
    
    fetchUserCount();
  }, [countryFilter, ageFilter, genderFilter, categoryFilter, prizeFilter]);

  const updateCountryFilter = (country: string) => {
    setCountryFilter(country);
  };

  const updateAgeFilter = (range: [number, number]) => {
    setAgeFilter(range);
  };

  const updateGenderFilter = (genders: string[]) => {
    setGenderFilter(genders);
  };

  const updateCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };

  const updatePrizeFilter = (prizeOption: string) => {
    setPrizeFilter(prizeOption);
  };

  const saveSegment = async (name: string) => {
    setIsLoadingOperation(true);
    try {
      await saveSegmentMutation.mutateAsync({
        name,
        count: userCount,
        filters: {
          country: countryFilter,
          age: ageFilter,
          gender: genderFilter,
          category: categoryFilter,
          prize: prizeFilter
        }
      });
      
      toast({
        title: "Segment saved",
        description: `Segment "${name}" has been saved with ${userCount} users.`
      });
      
      return true;
    } catch (error) {
      console.error('Error saving segment:', error);
      toast({
        title: "Error saving segment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoadingOperation(false);
    }
  };

  const sendToSegment = async () => {
    setIsLoadingOperation(true);
    try {
      // In a real implementation, this would redirect to create a new campaign
      // targeting this segment
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Creating new campaign",
        description: `Creating a new campaign targeting ${userCount} users.`
      });
      
      // For now, just return - in a real app this would redirect or open a modal
      return true;
    } catch (error) {
      console.error('Error preparing segment:', error);
      toast({
        title: "Error creating campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoadingOperation(false);
    }
  };

  return {
    countryFilter,
    ageFilter,
    genderFilter,
    categoryFilter,
    prizeFilter,
    userCount,
    loadingUserCount,
    isLoadingOperation,
    savedSegments: savedSegments || [],
    updateCountryFilter,
    updateAgeFilter,
    updateGenderFilter,
    updateCategoryFilter,
    updatePrizeFilter,
    saveSegment,
    sendToSegment
  };
}
