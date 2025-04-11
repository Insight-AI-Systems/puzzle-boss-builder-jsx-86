
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

/**
 * Component for viewing and editing profile information
 */
const ProfileForm = ({ profile, user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Character limit constants
  const MAX_USERNAME_LENGTH = 50;
  const MAX_AVATAR_URL_LENGTH = 500;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Strictly enforce character limits to prevent large messages
    if (name === 'username' && value.length > MAX_USERNAME_LENGTH) {
      toast({
        title: "Input too long",
        description: `Username cannot exceed ${MAX_USERNAME_LENGTH} characters.`,
        variant: "destructive"
      });
      return;
    }
    
    if (name === 'avatar_url' && value.length > MAX_AVATAR_URL_LENGTH) {
      toast({
        title: "Input too long",
        description: `Avatar URL cannot exceed ${MAX_AVATAR_URL_LENGTH} characters.`,
        variant: "destructive"
      });
      return;
    }
    
    // Truncate value if it somehow exceeds the limit
    const truncatedValue = name === 'username' 
      ? value.substring(0, MAX_USERNAME_LENGTH)
      : value.substring(0, MAX_AVATAR_URL_LENGTH);
    
    setFormData({
      ...formData,
      [name]: truncatedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    if (formData.username.length > MAX_USERNAME_LENGTH || formData.avatar_url.length > MAX_AVATAR_URL_LENGTH) {
      toast({
        title: "Input data too long",
        description: "Please shorten your inputs and try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { error } = await onUpdateProfile(formData);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="md:col-span-2 bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white">
          {isEditing ? 'Edit Profile' : 'Profile Information'}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update your profile information below' 
            : 'Your personal information and preferences'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-muted-foreground">Username</div>
              <div className="col-span-2 text-puzzle-white">{profile.username || 'Not set'}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-muted-foreground">Email</div>
              <div className="col-span-2 text-puzzle-white">{user.email}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-muted-foreground">Member Since</div>
              <div className="col-span-2 text-puzzle-white">
                {new Date(profile.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90 ml-auto"
          >
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
