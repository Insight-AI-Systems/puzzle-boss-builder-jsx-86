
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName } from '@/utils/permissions';
import PermissionGate from '../PermissionGate';
import { ROLES } from '@/utils/permissions';

const MobileNavigation = ({ isOpen, toggleMenu, user, profile, signOut }) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden mt-4 py-4 space-y-4 flex flex-col items-center">
      <Link to="/" className="nav-link py-2" onClick={() => toggleMenu(false)}>Home</Link>
      <a href="#categories" className="nav-link py-2" onClick={() => toggleMenu(false)}>Categories</a>
      <a href="#how-it-works" className="nav-link py-2" onClick={() => toggleMenu(false)}>How It Works</a>
      <a href="#prizes" className="nav-link py-2" onClick={() => toggleMenu(false)}>Prizes</a>
      
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
        <Link 
          to="/admin" 
          className="nav-link py-2 text-puzzle-gold"
          onClick={() => toggleMenu(false)}
        >
          Admin Dashboard
        </Link>
      </PermissionGate>
      
      {user ? (
        <div className="flex flex-col space-y-3 w-full pt-4">
          {profile?.role && profile.role !== ROLES.PLAYER && (
            <div className="text-center">
              <Badge className="bg-puzzle-gold/90 text-puzzle-black">
                {getRoleDisplayName(profile.role)}
              </Badge>
            </div>
          )}
        
          <div className="text-puzzle-aqua text-center">
            {profile?.credits || 0} <span className="text-muted-foreground">credits</span>
          </div>
          <Link to="/profile" onClick={() => toggleMenu(false)}>
            <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
              Profile
            </Button>
          </Link>
          <Button 
            onClick={() => {
              signOut();
              toggleMenu(false);
            }} 
            className="w-full bg-puzzle-burgundy text-puzzle-white hover:bg-puzzle-burgundy/90"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-3 w-full pt-4">
          <Link to="/auth" onClick={() => toggleMenu(false)}>
            <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
              Login
            </Button>
          </Link>
          <Link to="/auth?tab=register" onClick={() => toggleMenu(false)}>
            <Button className="w-full bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
