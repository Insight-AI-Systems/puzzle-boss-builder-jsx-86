
import React from 'react';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';
import GameHistory from '@/components/profile/GameHistory';
import AvailablePuzzles from '@/components/profile/AvailablePuzzles';
import RewardsReferrals from '@/components/profile/RewardsReferrals';
import AccountSettings from '@/components/profile/account/AccountSettings';
import { useAuth } from '@/contexts/auth';

const ProfileContent = ({ user, profile }) => {
  const { updateUserProfile, signOut } = useAuth();

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileCard 
          user={user} 
          profile={profile} 
          onSignOut={signOut}
          onUpdateProfile={updateUserProfile}
        />
        
        <div className="md:col-span-2">
          <ProfileForm 
            user={user} 
            profile={profile} 
            onUpdateProfile={updateUserProfile} 
          />
        </div>
      </div>
      
      <GameHistory user={user} profile={profile} />
      <AvailablePuzzles user={user} profile={profile} />
      <RewardsReferrals user={user} profile={profile} />
      <AccountSettings user={user} profile={profile} onSignOut={signOut} />
    </div>
  );
};

export default ProfileContent;
