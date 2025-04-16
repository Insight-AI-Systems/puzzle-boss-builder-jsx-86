
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserProfile } from '@/types/userTypes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ROLE_DEFINITIONS } from '@/types/userTypes';
import { Badge } from "@/components/ui/badge";
import { Pencil, Save, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfileForm({ userId }: { userId?: string }) {
  const { profile, isLoading, updateProfile } = useUserProfile(userId);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<UserProfile>>({
    display_name: '',
    bio: '',
    avatar_url: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    updateProfile.mutate(formData, {
      onSuccess: () => setIsEditing(false)
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Profile not found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const roleInfo = ROLE_DEFINITIONS[profile.role];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </div>
        <Badge 
          className={
            profile.role === 'super_admin' ? 'bg-red-600' :
            profile.role === 'admin' ? 'bg-purple-600' :
            profile.role === 'category_manager' ? 'bg-blue-600' :
            profile.role === 'social_media_manager' ? 'bg-green-600' :
            profile.role === 'partner_manager' ? 'bg-amber-600' :
            profile.role === 'cfo' ? 'bg-emerald-600' :
            'bg-slate-600'
          }
        >
          {roleInfo.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || 'User'} />
            <AvatarFallback className="bg-puzzle-aqua/20 text-puzzle-aqua">
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-puzzle-white">
              {profile.display_name || 'Anonymous Player'}
            </h3>
            <p className="text-sm text-puzzle-white/60">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-sm text-puzzle-gold mr-2">{profile.credits || 0} credits</p>
              {profile.referral_code && (
                <p className="text-xs text-puzzle-white/60">Referral: {profile.referral_code}</p>
              )}
            </div>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-puzzle-white mb-1">About</h3>
              <p className="text-puzzle-white/80">
                {profile.bio || 'No bio information added yet.'}
              </p>
            </div>
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline" 
              className="mt-4 border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-puzzle-white">Display Name</Label>
              <Input
                id="display_name"
                name="display_name"
                value={formData.display_name || ''}
                onChange={handleChange}
                className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar_url" className="text-puzzle-white">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url || ''}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-puzzle-white">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white min-h-[100px]"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button 
                type="submit" 
                className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? 'Saving...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  if (profile) {
                    setFormData({
                      display_name: profile.display_name || '',
                      bio: profile.bio || '',
                      avatar_url: profile.avatar_url || '',
                    });
                  }
                }}
                className="border-puzzle-white/20 text-puzzle-white hover:bg-puzzle-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
