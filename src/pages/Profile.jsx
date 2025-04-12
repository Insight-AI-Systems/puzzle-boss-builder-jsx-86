
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Loading from '@/components/ui/loading';
import Navbar from '@/components/Navbar';
import MainMenu from '@/components/MainMenu';
import Footer from '@/components/Footer';
import ProfileHeader from '@/components/profile-page/ProfileHeader';
import ProfileTabs from '@/components/profile-page/ProfileTabs';
import ProfileContent from '@/components/profile-page/ProfileContent';

/**
 * User dashboard/profile page that displays user information and game statistics
 */
const Profile = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  if (loading) {
    return <Loading />;
  }

  if (!user || !profile) {
    return <Loading />;
  }
  
  return (
    <div className="min-h-screen bg-puzzle-black flex flex-col">
      <Navbar />
      <MainMenu />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <ProfileHeader 
            profile={profile} 
          />
          
          {/* Mobile View - Tabs */}
          {isMobile ? (
            <ProfileTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              user={user} 
              profile={profile}
            />
          ) : (
            /* Desktop View - Grid Layout */
            <ProfileContent 
              user={user} 
              profile={profile} 
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
