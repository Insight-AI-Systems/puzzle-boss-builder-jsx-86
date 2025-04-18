
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from '@/types/userTypes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileHeader } from './form/ProfileHeader';
import { ProfileAvatar } from './form/ProfileAvatar';
import { ProfileEditForm } from './form/ProfileEditForm';

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
        <CardContent>Loading profile information...</CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full">
        <CardContent>Profile not found</CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <ProfileHeader profile={profile} />
      <CardContent>
        <ProfileAvatar profile={profile} />
        <ProfileEditForm
          isEditing={isEditing}
          formData={formData}
          profile={profile}
          updateProfile={updateProfile}
          onEditToggle={() => setIsEditing(!isEditing)}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
