
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';
import GameHistory from '@/components/profile/GameHistory';
import AvailablePuzzles from '@/components/profile/AvailablePuzzles';
import RewardsReferrals from '@/components/profile/RewardsReferrals';
import AccountSettings from '@/components/profile/AccountSettings';
import Loading from '@/components/ui/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  PuzzlePiece,
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  Trophy,
  ShoppingCart,
  HelpCircle,
  Info
} from 'lucide-react';
import { getRoleDisplayName } from '@/utils/permissions';
import RoleBasedNavigation from '@/components/RoleBasedNavigation';

/**
 * User dashboard/profile page that displays user information and game statistics
 */
const Profile = () => {
  const { user, profile, updateUserProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!user || !profile) {
    return <Loading />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      // Silent failure, don't log large objects
    }
  };
  
  return (
    <div className="min-h-screen bg-puzzle-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top navigation bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-puzzle-white">User Dashboard</h1>
          
          <div className="flex items-center gap-4">
            {/* Quick navigation for desktop */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/" className="text-puzzle-white hover:text-puzzle-aqua flex items-center gap-2">
                  <Home size={18} />
                  <span>Home</span>
                </Link>
                <Link to="/categories" className="text-puzzle-white hover:text-puzzle-aqua flex items-center gap-2">
                  <PuzzlePiece size={18} />
                  <span>Puzzles</span>
                </Link>
                <Link to="/leaderboard" className="text-puzzle-white hover:text-puzzle-aqua flex items-center gap-2">
                  <Trophy size={18} />
                  <span>Leaderboard</span>
                </Link>
              </div>
            )}
            
            {/* Dropdown menu for both mobile and desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="bg-puzzle-aqua/20 hover:bg-puzzle-aqua/30 transition-colors p-2 rounded-md">
                  <Menu className="text-puzzle-white" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black border border-puzzle-aqua/30 text-puzzle-white">
                <div className="px-3 py-2 text-sm font-medium border-b border-puzzle-aqua/20">
                  Signed in as <span className="text-puzzle-aqua">{profile.email || user.email}</span>
                  <div className="text-xs text-puzzle-white/60">{getRoleDisplayName(profile.role)}</div>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <Home size={16} className="text-puzzle-aqua" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/categories" className="flex items-center gap-2 cursor-pointer">
                    <PuzzlePiece size={16} className="text-puzzle-aqua" />
                    <span>Puzzles</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/leaderboard" className="flex items-center gap-2 cursor-pointer">
                    <Trophy size={16} className="text-puzzle-aqua" />
                    <span>Leaderboard</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/shop" className="flex items-center gap-2 cursor-pointer">
                    <ShoppingCart size={16} className="text-puzzle-aqua" />
                    <span>Shop Credits</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-puzzle-aqua/20" />
                
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User size={16} className="text-puzzle-aqua" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings size={16} className="text-puzzle-aqua" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                
                {/* Display admin navigation if user has admin role */}
                {profile.role && profile.role !== 'player' && (
                  <>
                    <DropdownMenuSeparator className="bg-puzzle-aqua/20" />
                    <div className="px-3 py-2 text-xs text-puzzle-gold">Admin Access</div>
                    <div className="px-2 py-1">
                      <RoleBasedNavigation className="text-sm" />
                    </div>
                  </>
                )}
                
                <DropdownMenuSeparator className="bg-puzzle-aqua/20" />
                
                <DropdownMenuItem asChild>
                  <Link to="/help" className="flex items-center gap-2 cursor-pointer">
                    <HelpCircle size={16} className="text-puzzle-aqua" />
                    <span>Help</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center gap-2 cursor-pointer">
                    <Info size={16} className="text-puzzle-aqua" />
                    <span>About</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-puzzle-aqua/20" />
                
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-400">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile View - Tabs */}
        {isMobile ? (
          <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-puzzle-black border border-puzzle-aqua/30">
              <TabsTrigger value="profile" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
                Profile
              </TabsTrigger>
              <TabsTrigger value="gameplay" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
                Gameplay
              </TabsTrigger>
              <TabsTrigger value="account" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
                Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileCard 
                user={user} 
                profile={profile} 
                onSignOut={handleSignOut} 
                onUpdateProfile={updateUserProfile}
              />
              <ProfileForm 
                user={user} 
                profile={profile} 
                onUpdateProfile={updateUserProfile} 
              />
            </TabsContent>
            
            <TabsContent value="gameplay" className="space-y-6">
              <GameHistory user={user} profile={profile} />
              <AvailablePuzzles user={user} profile={profile} />
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <RewardsReferrals user={user} profile={profile} />
              <AccountSettings user={user} profile={profile} onSignOut={handleSignOut} />
            </TabsContent>
          </Tabs>
        ) : (
          /* Desktop View - Grid Layout */
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProfileCard 
                user={user} 
                profile={profile} 
                onSignOut={handleSignOut}
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
            <AccountSettings user={user} profile={profile} onSignOut={handleSignOut} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
