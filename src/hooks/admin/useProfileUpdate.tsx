
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/userTypes';

export function useProfileUpdate() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<UserProfile> }) => {
      const { data, error } = await supabase.functions.invoke('admin-update-profile', {
        body: { userId, updates },
        headers: {
          'x-user-email': user?.primaryEmailAddress?.emailAddress || '',
        },
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to update profile');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
      toast({
        title: "Profile updated",
        description: "User profile has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update user profile",
        variant: "destructive",
      });
    },
  });
}
