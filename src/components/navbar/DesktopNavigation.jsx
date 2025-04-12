
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PermissionGate from '../PermissionGate';
import { ROLES } from '@/utils/permissions';
import UserMenu from './UserMenu';

const DesktopNavigation = ({ user, profile, signOut, getInitials }) => {
  return (
    <>
      <div className="hidden md:flex space-x-8">
        <Link to="/" className="nav-link">Home</Link>
        <a href="#categories" className="nav-link">Categories</a>
        <a href="#how-it-works" className="nav-link">How It Works</a>
        <a href="#prizes" className="nav-link">Prizes</a>
        
        <PermissionGate
          role={[
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.CATEGORY_MANAGER,
            ROLES.CFO,
            ROLES.SOCIAL_MEDIA_MANAGER,
            ROLES.PARTNER_MANAGER
          ]}
        >
          <Link to="/admin" className="nav-link text-puzzle-gold">
            Admin
          </Link>
        </PermissionGate>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-puzzle-aqua text-sm">
              {profile?.credits || 0} <span className="text-muted-foreground">credits</span>
            </div>
            
            <UserMenu 
              user={user} 
              profile={profile} 
              signOut={signOut} 
              getInitials={getInitials} 
            />
          </div>
        ) : (
          <>
            <Link to="/auth">
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                Login
              </Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default DesktopNavigation;
