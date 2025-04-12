
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Shield, Home, LayoutDashboard, InfoIcon, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/auth';
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
import PermissionGate from './PermissionGate';
import { ROLES } from '@/utils/permissions';

const MainHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 backdrop-blur-sm bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-cyan-400">The</span> Puzzle <span className="text-yellow-400">Boss</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-cyan-400' : 'text-white hover:text-cyan-400'}`}
            >
              <span className="flex items-center gap-1">
                <Home size={16} />
                <span>Home</span>
              </span>
            </Link>
            
            <Link 
              to="/terms" 
              className={`transition-colors ${isActive('/terms') ? 'text-cyan-400' : 'text-white hover:text-cyan-400'}`}
            >
              <span className="flex items-center gap-1">
                <FileText size={16} />
                <span>Terms</span>
              </span>
            </Link>
            
            <Link 
              to="/privacy" 
              className={`transition-colors ${isActive('/privacy') ? 'text-cyan-400' : 'text-white hover:text-cyan-400'}`}
            >
              <span className="flex items-center gap-1">
                <InfoIcon size={16} />
                <span>Privacy</span>
              </span>
            </Link>
            
            {/* Admin dashboard link for admins */}
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
                className={`transition-colors ${isActive('/admin') ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}
              >
                <span className="flex items-center gap-1">
                  <LayoutDashboard size={16} />
                  <span>Admin</span>
                </span>
              </Link>
            </PermissionGate>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
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
            ) : (
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
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-b border-cyan-500/20">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-white hover:text-cyan-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                <span className="flex items-center gap-2">
                  <Home size={18} />
                  <span>Home</span>
                </span>
              </Link>
              
              <Link to="/terms" className="text-white hover:text-cyan-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                <span className="flex items-center gap-2">
                  <FileText size={18} />
                  <span>Terms</span>
                </span>
              </Link>
              
              <Link to="/privacy" className="text-white hover:text-cyan-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                <span className="flex items-center gap-2">
                  <InfoIcon size={18} />
                  <span>Privacy</span>
                </span>
              </Link>
              
              {/* Admin link for mobile */}
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
                  className="text-white hover:text-yellow-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    <span>Admin Dashboard</span>
                  </span>
                </Link>
              </PermissionGate>
              
              {user ? (
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
                  
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                      Profile
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }} 
                    className="w-full bg-red-900 text-white hover:bg-red-800"
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-cyan-500/20">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-400/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
