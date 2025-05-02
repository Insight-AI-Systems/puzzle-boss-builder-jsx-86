
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSegment {
  id: string;
  name: string;
  count: number;
  filters: {
    country?: string;
    ageRange?: [number, number];
    genders?: string[];
    category?: string;
    prizeFilter?: string;
  };
  created_at: string;
}

export function useUserSegmentation() {
  const { toast } = useToast();
  
  // Filters
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<[number, number]>([18, 65]);
  const [genderFilter, setGenderFilter] = useState<string[]>(['male', 'female', 'other', 'not_specified']);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [prizeFilter, setPrizeFilter] = useState<string>("all");

  // Loading states
  const [loadingUserCount, setLoadingUserCount] = useState(false);
  const [isLoadingOperation, setIsLoadingOperation] = useState(false);
  
  // User count for the current filters
  const [userCount, setUserCount] = useState(0);

  // Fetch saved segments
  const {
    data: savedSegments = [],
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
        return data as UserSegment[];
      } catch (error) {
        console.error('Error fetching user segments:', error);
        throw error;
      }
    }
  });

  // Count users based on filters
  useEffect(() => {
    const countUsers = async () => {
      setLoadingUserCount(true);
      try {
        const { data, error } = await supabase.functions.invoke('count-segmented-users', {
          body: {
            countryFilter,
            ageFilter,
            genderFilter,
            categoryFilter,
            prizeFilter
          }
        });
        
        if (error) throw error;
        setUserCount(data?.count || 0);
      } catch (error) {
        console.error('Error counting users:', error);
        toast({
          title: "Error",
          description: "Failed to count users with the selected filters",
          variant: "destructive"
        });
        setUserCount(0);
      } finally {
        setLoadingUserCount(false);
      }
    };
    
    countUsers();
  }, [countryFilter, ageFilter, genderFilter, categoryFilter, prizeFilter, toast]);

  // Save segment mutation
  const saveSegmentMutation = useMutation({
    mutationFn: async (name: string) => {
      setIsLoadingOperation(true);
      try {
        const segment = {
          name,
          count: userCount,
          filters: {
            country: countryFilter,
            ageRange: ageFilter,
            genders: genderFilter,
            category: categoryFilter,
            prizeFilter: prizeFilter
          }
        };
        
        const { data, error } = await supabase
          .from('user_segments')
          .insert(segment)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } finally {
        setIsLoadingOperation(false);
      }
    }
  });

  // Send to segment mutation
  const sendToSegmentMutation = useMutation({
    mutationFn: async () => {
      setIsLoadingOperation(true);
      try {
        // This would typically redirect to the email composer with the segment pre-selected
        // But for now, we'll just return the current filters and user count
        return {
          userCount,
          filters: {
            country: countryFilter,
            ageRange: ageFilter,
            genders: genderFilter,
            category: categoryFilter,
            prizeFilter: prizeFilter
          }
        };
      } finally {
        setIsLoadingOperation(false);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Ready to send",
        description: `You can now compose an email to ${data.userCount} users.`,
      });
      // This would typically navigate to the email composer
    }
  });

  return {
    // Filter values
    countryFilter,
    ageFilter,
    genderFilter,
    categoryFilter,
    prizeFilter,
    
    // Filter update functions
    updateCountryFilter: setCountryFilter,
    updateAgeFilter: setAgeFilter,
    updateGenderFilter: setGenderFilter,
    updateCategoryFilter: setCategoryFilter,
    updatePrizeFilter: setPrizeFilter,
    
    // User count
    userCount,
    loadingUserCount,
    
    // Saved segments
    savedSegments,
    isLoadingSegments,
    
    // Operations
    saveSegment: (name: string) => saveSegmentMutation.mutateAsync(name),
    sendToSegment: () => sendToSegmentMutation.mutateAsync(),
    isLoadingOperation
  };
}
