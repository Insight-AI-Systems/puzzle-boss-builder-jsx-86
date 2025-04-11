
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

/**
 * Component for viewing and editing profile information
 * With optimizations to prevent excessive data being generated
 */
const ProfileForm = ({ profile, user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username?.substring(0, 50) || '',
    avatar_url: profile?.avatar_url?.substring(0, 500) || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Character limit constants
  const MAX_USERNAME_LENGTH = 50;
  const MAX_AVATAR_URL_LENGTH = 500;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Truncate value if it exceeds the limit
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
    const sanitizedData = {
      username: formData.username.substring(0, MAX_USERNAME_LENGTH),
      avatar_url: formData.avatar_url.substring(0, MAX_AVATAR_URL_LENGTH)
    };
    
    setIsSubmitting(true);

    try {
      const { error } = await onUpdateProfile(sanitizedData);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
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
                maxLength={MAX_USERNAME_LENGTH}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                maxLength={MAX_AVATAR_URL_LENGTH}
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-muted-foreground">Username</div>
              <div className="col-span-2 text-puzzle-white">
                {profile.username?.substring(0, MAX_USERNAME_LENGTH) || 'Not set'}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-muted-foreground">Email</div>
              <div className="col-span-2 text-puzzle-white">
                {user.email?.substring(0, 100) || 'Not available'}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-muted-foreground">Member Since</div>
              <div className="col-span-2 text-puzzle-white">
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Not available'}
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
