
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

export function useProfileMutation(profileId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      if (!profileId) throw new Error('No user ID provided');
      
      // Validate fields
      if (updatedProfile.display_name && updatedProfile.display_name.length < 2) {
        throw new Error('Display name must be at least 2 characters long');
      }
      
      if (updatedProfile.bio && updatedProfile.bio.length > 500) {
        throw new Error('Bio must be no more than 500 characters long');
      }
      
      // Check if avatar_url is a valid URL
      if (updatedProfile.avatar_url && !isValidUrl(updatedProfile.avatar_url)) {
        throw new Error('Avatar URL must be a valid URL');
      }
      
      console.log('Updating profile with data:', updatedProfile);
      
      // Map UserProfile fields to profiles table columns
      const profileUpdate: Record<string, any> = {};
      
      if (updatedProfile.display_name !== undefined) {
        profileUpdate.username = updatedProfile.display_name;
      }
      
      if (updatedProfile.avatar_url !== undefined) {
        profileUpdate.avatar_url = updatedProfile.avatar_url;
      }
      
      if (updatedProfile.bio !== undefined) {
        profileUpdate.bio = updatedProfile.bio;
      }
      
      profileUpdate.updated_at = new Date().toISOString();
      
      console.log('Mapped profile update for Supabase:', profileUpdate);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', profileId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile in Supabase:', error);
        throw error;
      }
      
      console.log('Profile updated successfully, response:', data);
      
      const updatedUserProfile: UserProfile = {
        id: data.id,
        display_name: data.username || null,
        bio: data.bio || null,
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
      queryClient.invalidateQueries({queryKey: ['profile', profileId]});
      
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

  // Helper function to check if a string is a valid URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      if (!profileId) throw new Error('No user ID provided');
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 5MB');
      }
      
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile with new avatar URL
      const { data: profile, error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrlData.publicUrl
        })
        .eq('id', profileId)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      return {
        avatar_url: publicUrlData.publicUrl,
        profile
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', profileId], (oldData: any) => ({
        ...oldData,
        avatar_url: data.avatar_url
      }));
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been successfully updated.',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Avatar update failed',
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
        duration: 5000,
      });
    }
  });

  return { updateProfile, uploadAvatar };
}
