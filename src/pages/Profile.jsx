
import React from 'react';
import { useAuth } from '@/contexts/auth';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';
import Loading from '@/components/ui/loading';

/**
 * User profile page that displays user information and allows editing
 */
const Profile = () => {
  const { user, profile, updateUserProfile, signOut } = useAuth();

  if (!user || !profile) {
    return <Loading />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-puzzle-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-puzzle-white mb-8">User Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard 
            user={user} 
            profile={profile} 
            onSignOut={handleSignOut} 
          />
          
          <ProfileForm 
            user={user} 
            profile={profile} 
            onUpdateProfile={updateUserProfile} 
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
