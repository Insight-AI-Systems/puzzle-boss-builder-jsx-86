
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';
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
import { useAdminStatus } from '@/hooks/profile/useAdminStatus';

interface UserMenuProps {
  profile: UserProfile | null;
  isMobile?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ profile, isMobile = false }) => {
  const { signOut, userRole, hasRole } = useAuth();
  const { isAdmin } = useAdminStatus(profile);

  // Enhanced debug logging for admin status
  console.log('UserMenu - Profile:', profile);
  console.log('UserMenu - UserRole from AuthContext:', userRole);
  console.log('UserMenu - Is Admin from useAdminStatus:', isAdmin);
  console.log('UserMenu - Has Admin Role (hasRole):', hasRole('admin'));
  console.log('UserMenu - Has Super Admin Role (hasRole):', hasRole('super_admin'));
  console.log('UserMenu - Email:', profile?.id);

  // Check for super admin by email
  const isSuperAdminEmail = profile?.id === 'alan@insight-ai-systems.com';
  const isTestAdmin = profile?.id === 'rob.small.1234@gmail.com';
  
  // Either they have the admin role or they're the special super admin account
  const showAdminMenu = isAdmin || 
                       profile?.role === 'super_admin' || 
                       profile?.role === 'admin' ||
                       isSuperAdminEmail ||
                       hasRole('admin') || 
                       hasRole('super_admin');
  
  console.log('UserMenu - Show Admin Menu:', showAdminMenu);
  console.log('UserMenu - Is Test Admin:', isTestAdmin);

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
          <Link to="/membership">Membership</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        
        {/* Admin Menu Section - Now showing debug info for users who should have access */}
        {isTestAdmin && !showAdminMenu && (
          <DropdownMenuItem className="text-red-500">
            You should have admin access but don't. Role: {profile.role}
          </DropdownMenuItem>
        )}
        
        {showAdminMenu && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center text-puzzle-aqua">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Access
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/admin-dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
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
