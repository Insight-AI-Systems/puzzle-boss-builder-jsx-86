
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

export function useUserProfile(userId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get the current user session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setCurrentUserId(data.session.user.id);
      }
    };
    
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setCurrentUserId(session?.user.id || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch the user profile
  const profileId = userId || currentUserId;
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!profileId,
  });

  // Check admin status
  useEffect(() => {
    if (profile) {
      setIsAdmin(profile.role === 'super_admin' || profile.role === 'admin');
    }
  }, [profile]);

  // Mutation to update profile
  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      if (!profileId) throw new Error('No user ID provided');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updatedProfile)
        .eq('id', profileId)
        .select()
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', profileId], data);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  // Mutation to update user role (admin only)
  const updateUserRole = useMutation({
    mutationFn: async ({ targetUserId, newRole }: { targetUserId: string; newRole: UserRole }) => {
      const { data, error } = await supabase
        .rpc('update_user_role', {
          user_id: targetUserId,
          new_role: newRole
        });
      
      if (error) throw error;
      
      // If successful, fetch the updated profile
      const { data: updatedProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();
      
      if (profileError) throw profileError;
      return updatedProfile as UserProfile;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['profile', variables.targetUserId], data);
      toast({
        title: 'Role updated',
        description: `User role has been updated to ${data.role}.`,
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Role update failed',
        description: `Error: ${error instanceof Error ? error.message : 'You do not have permission to update this role.'}`,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  // Fetch all profiles (admin only)
  const { data: allProfiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      if (!isAdmin) return [];
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: isAdmin && !!currentUserId,
  });

  return {
    profile,
    isLoading,
    error,
    isAdmin,
    allProfiles,
    isLoadingProfiles,
    updateProfile,
    updateUserRole,
    currentUserId
  };
}
