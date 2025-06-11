
import React from 'react';
import UserProfileForm from '../UserProfileForm';

interface ProfileInfoTabProps {
  profile: any;
  updateProfile: (data: any) => Promise<any>;
  acceptTerms: () => Promise<any>;
}

const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({ profile, updateProfile, acceptTerms }) => {
  return <UserProfileForm />;
};

export default ProfileInfoTab;
