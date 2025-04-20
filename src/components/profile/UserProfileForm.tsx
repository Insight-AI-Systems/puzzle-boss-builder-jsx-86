
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile, Gender } from '@/types/userTypes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileHeader } from './form/ProfileHeader';
import { ProfileAvatar } from './form/ProfileAvatar';
import { ProfileEditForm } from './form/ProfileEditForm';

export function UserProfileForm() {
  const { profile, isLoading, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<UserProfile>>({
    display_name: '',
    bio: '',
    avatar_url: '',
    gender: null,
    custom_gender: null,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        gender: profile.gender || null,
        custom_gender: profile.custom_gender || null,
      });
      console.log("Profile data loaded:", profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Updating field ${name} to: ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    console.log('Submitting profile update:', formData);
    
    // Process form data before submission
    const dataToSubmit = {
      ...formData,
      // If not custom gender, ensure custom_gender is null
      custom_gender: formData.gender === 'custom' ? formData.custom_gender : null
    };
    
    updateProfile.mutate(dataToSubmit, {
      onSuccess: () => {
        console.log('Profile updated successfully');
        setIsEditing(false);
      },
      onError: (error) => {
        console.error('Profile update error:', error);
      }
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
