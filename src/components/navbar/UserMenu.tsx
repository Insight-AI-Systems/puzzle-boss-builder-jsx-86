
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ShieldCheck, Settings, BarChart3, Users, Puzzle } from 'lucide-react';
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
import { useClerkAuth } from '@/hooks/useClerkAuth';

interface UserMenuProps {
  profile: UserProfile | null;
  isMobile?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ profile, isMobile = false }) => {
  const { hasRole, signOut } = useClerkAuth();

  // Check admin privileges based on role, not hardcoded emails
  const isAdminUser = hasRole('super_admin') || hasRole('admin') || hasRole('category_manager') || 
                     hasRole('social_media_manager') || hasRole('partner_manager') || hasRole('cfo');
  
  console.log('UserMenu - Admin Check:', {
    isAdminUser,
    profileRole: profile?.role
  });

  if (!profile) return null;

  const handleSignOut = async () => {
    try {
      console.log('UserMenu - Initiating sign out');
      await signOut();
      console.log('UserMenu - Sign out completed');
    } catch (error) {
      console.error('UserMenu - Sign out error:', error);
    }
  };

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
          <Link to="/account">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Admin Menu Section */}
        {isAdminUser && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center text-puzzle-aqua">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Access
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/admin">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            {(hasRole('super_admin') || hasRole('admin')) && (
              <DropdownMenuItem asChild>
                <Link to="/admin?tab=users">
                  <Users className="mr-2 h-4 w-4" />
                  <span>User Management</span>
                </Link>
              </DropdownMenuItem>
            )}
            {(hasRole('super_admin') || hasRole('admin') || hasRole('category_manager')) && (
              <DropdownMenuItem asChild>
                <Link to="/admin?tab=puzzles">
                  <Puzzle className="mr-2 h-4 w-4" />
                  <span>Puzzle Management</span>
                </Link>
              </DropdownMenuItem>
            )}
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
