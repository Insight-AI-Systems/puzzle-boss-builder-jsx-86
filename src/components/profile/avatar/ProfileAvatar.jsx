
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Component that displays the user's avatar with upload functionality
 */
const ProfileAvatar = ({ user, profile, onUpdateProfile }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  const handleFileChange = async (event) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive"
        });
        return;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update the user's profile with the new avatar URL
      const { error: updateError } = await onUpdateProfile({
        avatar_url: publicUrl
      });
      
      if (updateError) {
        toast({
          title: "Profile update failed",
          description: updateError.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully."
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative mx-auto">
      <Avatar className="w-24 h-24 mx-auto">
        {profile.avatar_url ? (
          <AvatarImage src={profile.avatar_url} alt={profile.username || 'User'} />
        ) : (
          <AvatarFallback className="bg-puzzle-aqua text-puzzle-black text-2xl">
            {getInitials()}
          </AvatarFallback>
        )}
      </Avatar>
      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-puzzle-aqua rounded-full cursor-pointer hover:bg-puzzle-aqua/80 transition-colors">
        <Upload size={16} className="text-puzzle-black" />
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
};

export default ProfileAvatar;
