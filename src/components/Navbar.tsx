
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth';
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
import { ROLES, PERMISSIONS } from '@/utils/permissions';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="sticky top-0 z-50 bg-puzzle-black/90 backdrop-blur-md border-b border-puzzle-aqua/20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-game text-puzzle-white">
              <span className="text-puzzle-aqua">The</span> Puzzle <span className="text-puzzle-gold">Boss</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <a href="#categories" className="nav-link">Categories</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#prizes" className="nav-link">Prizes</a>
            
            {/* Admin links based on permissions */}
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
              <Link to="/admin" className="nav-link text-puzzle-gold">
                Admin
              </Link>
            </PermissionGate>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
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
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-puzzle-white hover:text-puzzle-aqua">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 space-y-4 flex flex-col items-center">
            <Link to="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <a href="#categories" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Categories</a>
            <a href="#how-it-works" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#prizes" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Prizes</a>
            
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
                className="nav-link py-2 text-puzzle-gold"
                onClick={() => setIsMenuOpen(false)}
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
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }} 
                  className="w-full bg-puzzle-burgundy text-puzzle-white hover:bg-puzzle-burgundy/90"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 w-full pt-4">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
