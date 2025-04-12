
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, profile, updateUserProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-puzzle-aqua"></div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await updateUserProfile(formData);
      
      if (!error) {
        setIsEditing(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-puzzle-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-puzzle-white mb-8">User Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1 bg-puzzle-black border-puzzle-aqua/30">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={profile.avatar_url} alt={profile.username || 'User'} />
                <AvatarFallback className="bg-puzzle-aqua text-puzzle-black text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-puzzle-white mt-4">
                {profile.username || 'Username not set'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-semibold">Role:</span> {profile.role}
                </div>
                <div>
                  <span className="font-semibold">Credits:</span> {profile.credits}
                </div>
                <div>
                  <span className="font-semibold">Member since:</span> {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                className="w-full border-puzzle-burgundy text-puzzle-burgundy hover:bg-puzzle-burgundy/10"
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
          
          {/* Profile Edit Form */}
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
