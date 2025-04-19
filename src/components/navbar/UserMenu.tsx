
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
import { useAdminStatus } from '@/hooks/profile/useAdminStatus';

interface UserMenuProps {
  profile: UserProfile | null;
  isMobile?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ profile, isMobile = false }) => {
  const { signOut } = useAuth();
  const { isAdmin } = useAdminStatus(profile);

  // Debug logging for admin status
  console.log('UserMenu - Profile:', profile);
  console.log('UserMenu - Is Admin:', isAdmin);
  console.log('UserMenu - Is Super Admin:', profile?.role === 'super_admin');
  console.log('UserMenu - Profile ID:', profile?.id);

  // Check for super admin by email
  const isSuperAdminEmail = profile?.id === 'alan@insight-ai-systems.com';
  
  // Either they have the admin role or they're the special super admin account
  const showAdminMenu = isAdmin || profile?.role === 'super_admin' || isSuperAdminEmail;
  
  console.log('UserMenu - Show Admin Menu:', showAdminMenu);

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
        
        {/* Super Admin/Admin Menu Section */}
        {showAdminMenu && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center text-puzzle-aqua">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Access
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/test-dashboard">Dev Dashboard</Link>
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
