
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName } from '@/utils/permissions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PermissionGate from '../PermissionGate';
import { ROLES } from '@/utils/permissions';
import { useAuth } from '@/contexts/auth';

const NavbarUserMenu = ({ isMobile = false, onItemClick = () => {} }) => {
  const { user, profile, signOut } = useAuth();

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <div className={isMobile ? "flex flex-col space-y-3 w-full pt-4" : "flex items-center space-x-4"}>
        <Link to="/auth" onClick={onItemClick}>
          <Button variant="outline" className={isMobile ? "w-full" : ""} + " border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
            Login
          </Button>
        </Link>
        <Link to="/auth?tab=register" onClick={onItemClick}>
          <Button className={isMobile ? "w-full" : ""} + " bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
            Register
          </Button>
        </Link>
      </div>
    );
  }

  if (isMobile) {
    return (
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
        <Link to="/profile" onClick={onItemClick}>
          <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
            Profile
          </Button>
        </Link>
        <Button 
          onClick={() => {
            signOut();
            onItemClick();
          }} 
          className="w-full bg-puzzle-burgundy text-puzzle-white hover:bg-puzzle-burgundy/90"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-puzzle-aqua text-sm">
        {profile?.credits || 0} <span className="text-muted-foreground">credits</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Avatar>
              <AvatarImage src={profile?.avatar_url} alt={profile?.username || 'User'} />
              <AvatarFallback className="bg-puzzle-aqua text-puzzle-black">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {profile?.role && profile.role !== ROLES.PLAYER && (
              <Badge className="bg-puzzle-gold/90 text-puzzle-black text-xs">
                {getRoleDisplayName(profile.role)}
              </Badge>
            )}
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56 bg-puzzle-black border border-puzzle-aqua/30">
          <DropdownMenuLabel className="text-puzzle-white">
            <div className="flex flex-col">
              <span>{profile?.username || 'User'}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-puzzle-aqua/20" />
          
          <DropdownMenuGroup>
            <DropdownMenuItem 
              className="text-puzzle-white hover:bg-puzzle-aqua/10 cursor-pointer"
              asChild
            >
              <Link to="/profile">
                <User className="mr-2 h-4 w-4 text-puzzle-aqua" />
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
                className="text-puzzle-white hover:bg-puzzle-aqua/10 cursor-pointer"
                asChild
              >
                <Link to="/admin">
                  <Shield className="mr-2 h-4 w-4 text-puzzle-gold" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </PermissionGate>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="bg-puzzle-aqua/20" />
          
          <DropdownMenuItem 
            className="text-puzzle-white hover:bg-puzzle-burgundy/80 cursor-pointer"
            onClick={signOut}
          >
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarUserMenu;
