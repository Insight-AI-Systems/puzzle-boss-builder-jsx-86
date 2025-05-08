
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserProfile } from '@/types/userTypes';
import { useAuth } from '@/contexts/AuthContext';
import { isProtectedAdmin } from '@/config/securityConfig';

interface UserMenuProps {
  profile: UserProfile | null;
  isMobile?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ profile, isMobile = false }) => {
  const { user, hasRole, signOut } = useAuth();

  // Enhanced admin check with proper logging
  const isProtectedAdminUser = isProtectedAdmin(user?.email);
  const isSuperAdmin = isProtectedAdminUser || hasRole('super_admin');
  const isAdmin = isSuperAdmin || hasRole('admin');
  const isCategoryManager = hasRole('category_manager');
  const isSocialMediaManager = hasRole('social_media_manager');
  const isPartnerManager = hasRole('partner_manager');
  const isCfo = hasRole('cfo');
  
  // Combined check for any admin-related role
  const isAdminUser = isAdmin || isCategoryManager || isSocialMediaManager || isPartnerManager || isCfo;
  
  console.log('UserMenu - Admin Check:', {
    userEmail: user?.email,
    isProtectedAdminUser,
    isSuperAdmin,
    isAdmin,
    isAdminUser,
    profileRole: profile?.role,
    hasRoles: {
      admin: hasRole('admin'),
      superAdmin: hasRole('super_admin'),
      categoryManager: hasRole('category_manager'),
    },
    accessStatus: isProtectedAdminUser ? 'protected_admin_access' : (isAdminUser ? 'role_based_access' : 'no_admin_access')
  });

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-8 w-8 rounded-full ${isMobile ? 'mr-2' : ''}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || 'User'} />
            <AvatarFallback className="bg-puzzle-aqua/20">
              {profile.display_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-puzzle-black border-puzzle-aqua/20">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        
        {/* Admin Menu Section - Show for any admin role */}
        {(isAdminUser || isProtectedAdminUser) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center text-puzzle-aqua">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Access
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/admin-dashboard">
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
