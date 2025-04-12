
import React from 'react';
import { Link } from 'react-router-dom';
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
import { useAuth } from '@/contexts/auth';

const ProfileHeader = ({ profile }) => {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by auth state change in AuthProvider
    } catch (error) {
      // Silent failure, don't log large objects
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-puzzle-white">User Dashboard</h1>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="bg-puzzle-aqua/20 hover:bg-puzzle-aqua/30 transition-colors p-2 rounded-md">
              <Menu className="text-puzzle-white" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black border border-puzzle-aqua/30 text-puzzle-white">
            <div className="px-3 py-2 text-sm font-medium border-b border-puzzle-aqua/20">
              Signed in as <span className="text-puzzle-aqua">{profile.email}</span>
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
  );
};

export default ProfileHeader;
