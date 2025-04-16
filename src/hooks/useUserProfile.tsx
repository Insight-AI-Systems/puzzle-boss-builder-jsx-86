
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
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (error) throw error;
      
      // Transform the data to match our UserProfile interface
      const userProfile: UserProfile = {
        id: data.id,
        display_name: data.username || null,
        bio: null, // Not in the original profiles table
        avatar_url: data.avatar_url,
        role: (data.role || 'player') as UserRole,
        credits: data.credits || 0,
        achievements: [],
        referral_code: null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
      
      return userProfile;
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
      
      // Transform back to match the profiles table structure
      const profileUpdate = {
        username: updatedProfile.display_name,
        avatar_url: updatedProfile.avatar_url,
        // We don't update role here since that's handled separately
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', profileId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform the response back to our UserProfile interface
      const updatedUserProfile: UserProfile = {
        id: data.id,
        display_name: data.username || null,
        bio: null,
        avatar_url: data.avatar_url,
        role: (data.role || 'player') as UserRole,
        credits: data.credits || 0,
        achievements: [],
        referral_code: null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
      
      return updatedUserProfile;
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
      // Since we don't have the RPC function, we'll directly update the role in the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUserId)
        .select();
      
      if (error) throw error;
      
      // Transform the response to our UserProfile interface
      const updatedUserProfile: UserProfile = {
        id: data[0].id,
        display_name: data[0].username || null,
        bio: null,
        avatar_url: data[0].avatar_url,
        role: (data[0].role || 'player') as UserRole,
        credits: data[0].credits || 0,
        achievements: [],
        referral_code: null,
        created_at: data[0].created_at || new Date().toISOString(),
        updated_at: data[0].updated_at || new Date().toISOString()
      };
      
      return updatedUserProfile;
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
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our UserProfile interface
      return data.map(profile => ({
        id: profile.id,
        display_name: profile.username || null,
        bio: null,
        avatar_url: profile.avatar_url,
        role: (profile.role || 'player') as UserRole,
        credits: profile.credits || 0,
        achievements: [],
        referral_code: null,
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      } as UserProfile));
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
