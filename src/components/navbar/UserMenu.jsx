
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRoleDisplayName } from '@/utils/permissions';
import PermissionGate from '../PermissionGate';
import { ROLES } from '@/utils/permissions';

const UserMenu = ({ user, profile, signOut, getInitials }) => {
  return (
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
  );
};

export default UserMenu;
