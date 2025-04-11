
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Users, CreditCard, Award, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

/**
 * Component that displays the user's profile information in a card format
 */
const ProfileCard = ({ user, profile, onSignOut, onUpdateProfile }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');

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

  const handleUsernameSubmit = async () => {
    if (username.trim() === '') {
      toast({
        title: "Invalid username",
        description: "Username cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await onUpdateProfile({ username });
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      setEditingUsername(false);
      toast({
        title: "Username updated",
        description: "Your username has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="md:col-span-1 bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader className="text-center">
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
        
        <div className="mt-4">
          {editingUsername ? (
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-puzzle-black border border-puzzle-aqua/50 rounded px-2 py-1 text-puzzle-white text-center"
              />
              <div className="flex justify-center space-x-2">
                <Button 
                  onClick={handleUsernameSubmit} 
                  size="sm" 
                  className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80"
                >
                  Save
                </Button>
                <Button 
                  onClick={() => {
                    setEditingUsername(false);
                    setUsername(profile.username || '');
                  }} 
                  size="sm" 
                  variant="outline" 
                  className="border-puzzle-burgundy text-puzzle-burgundy hover:bg-puzzle-burgundy/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <CardTitle className="text-puzzle-white flex items-center justify-center">
              {profile.username || 'Username not set'}
              <button 
                onClick={() => setEditingUsername(true)} 
                className="ml-2 text-puzzle-aqua/70 hover:text-puzzle-aqua transition-colors"
              >
                ✏️
              </button>
            </CardTitle>
          )}
        </div>
        <CardDescription className="text-muted-foreground">
          {user.email}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-puzzle-aqua" />
            <div>
              <span className="font-semibold">Member since:</span> {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-puzzle-gold" />
            <div>
              <span className="font-semibold">Role:</span> {profile.role}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4 text-puzzle-gold" />
            <div>
              <span className="font-semibold">Credits:</span> {profile.credits || 0}
              <a href="#credit-history" className="ml-2 text-puzzle-aqua hover:underline text-xs">History</a>
            </div>
          </div>
          
          <div className="pt-4 border-t border-puzzle-aqua/20">
            <h4 className="text-sm font-semibold mb-3 flex items-center text-puzzle-white">
              <Award className="h-4 w-4 text-puzzle-gold mr-2" />
              Quick Stats
            </h4>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-puzzle-black/50 rounded p-2 border border-puzzle-aqua/20">
                <div className="text-lg font-bold text-puzzle-aqua">0</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="bg-puzzle-black/50 rounded p-2 border border-puzzle-aqua/20">
                <div className="text-lg font-bold text-puzzle-gold">--</div>
                <div className="text-xs text-muted-foreground">Best Time</div>
              </div>
              <div className="bg-puzzle-black/50 rounded p-2 border border-puzzle-aqua/20">
                <div className="text-lg font-bold text-puzzle-burgundy">--</div>
                <div className="text-xs text-muted-foreground">Rank</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onSignOut} 
          variant="outline" 
          className="w-full border-puzzle-burgundy text-puzzle-burgundy hover:bg-puzzle-burgundy/10"
        >
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
