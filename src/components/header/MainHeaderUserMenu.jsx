
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName } from '@/utils/permissions';
import { useAuth } from '@/contexts/auth';
import PermissionGate from '../PermissionGate';
import { ROLES } from '@/utils/permissions';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MainHeaderUserMenu = ({ isMobile = false, onItemClick = () => {} }) => {
  const { user, profile, signOut } = useAuth();
  
  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };
  
  // If user is not logged in
  if (!user) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-cyan-500/20">
          <Link to="/auth" onClick={onItemClick}>
            <Button variant="outline" className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
              Log In
            </Button>
          </Link>
          <Link to="/auth?tab=register" onClick={onItemClick}>
            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-400/90">
              Sign Up
            </Button>
          </Link>
        </div>
      );
    }
    
    return (
      <>
        <Link to="/auth">
          <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
            Log In
          </Button>
        </Link>
        <Link to="/auth?tab=register">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-400/90">
            Sign Up
          </Button>
        </Link>
      </>
    );
  }
  
  // For mobile view with logged in user
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 pt-4 border-t border-cyan-500/20">
        <div className="flex items-center gap-2 py-2">
          <Avatar>
            <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User'} />
            <AvatarFallback className="bg-cyan-400 text-black">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-white">{profile?.username || 'User'}</div>
            <div className="text-xs text-gray-400">{user.email}</div>
          </div>
        </div>
        
        <div className="text-cyan-400 text-sm py-2">
          {profile?.credits || 0} <span className="text-gray-400">credits</span>
        </div>
        
        <Link to="/profile" onClick={onItemClick}>
          <Button variant="outline" className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
            Profile
          </Button>
        </Link>
        
        <Button 
          onClick={() => {
            signOut();
            onItemClick();
          }} 
          className="w-full bg-red-900 text-white hover:bg-red-800"
        >
          Log out
        </Button>
      </div>
    );
  }
  
  // Desktop view with logged in user
  return (
    <div className="flex items-center space-x-4">
      <div className="text-cyan-400 text-sm">
        {profile?.credits || 0} <span className="text-gray-400">credits</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Avatar>
              <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User'} />
              <AvatarFallback className="bg-cyan-400 text-black">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {profile?.role && profile.role !== ROLES.PLAYER && (
              <Badge className="bg-yellow-400/90 text-black text-xs">
                {getRoleDisplayName(profile.role)}
              </Badge>
            )}
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56 bg-black border border-cyan-500/30">
          <DropdownMenuLabel className="text-white">
            <div className="flex flex-col">
              <span>{profile?.username || 'User'}</span>
              <span className="text-xs text-gray-400">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-cyan-500/20" />
          
          <DropdownMenuGroup>
            <DropdownMenuItem 
              className="text-white hover:bg-cyan-400/10 cursor-pointer"
              asChild
            >
              <Link to="/profile">
                <User className="mr-2 h-4 w-4 text-cyan-400" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            
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
              <DropdownMenuItem 
                className="text-white hover:bg-cyan-400/10 cursor-pointer"
                asChild
              >
                <Link to="/admin">
                  <Shield className="mr-2 h-4 w-4 text-yellow-400" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </PermissionGate>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="bg-cyan-500/20" />
          
          <DropdownMenuItem 
            className="text-white hover:bg-red-500/20 cursor-pointer"
            onClick={signOut}
          >
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MainHeaderUserMenu;
