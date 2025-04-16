
import React from 'react';
import { Link } from 'react-router-dom';
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
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Settings, Shield, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { profile, isLoading, isAdmin, currentUserId } = useUserProfile();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'There was a problem signing you out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="bg-gradient-to-r from-puzzle-black to-puzzle-black/95 py-4 sticky top-0 z-40 w-full border-b border-puzzle-aqua/20">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-puzzle-aqua font-game text-2xl tracking-wider">Puzzle Boss</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-white/80 hover:text-puzzle-aqua transition-colors">
            Home
          </Link>
          <Link to="/puzzles" className="text-white/80 hover:text-puzzle-aqua transition-colors">
            Puzzles
          </Link>
          <Link to="/prizes" className="text-white/80 hover:text-puzzle-aqua transition-colors">
            Prizes
          </Link>
          <Link to="/how-it-works" className="text-white/80 hover:text-puzzle-aqua transition-colors">
            How It Works
          </Link>
          
          {(isAdmin || profile?.role === 'super_admin') && (
            <Link to="/admin-dashboard" className="text-puzzle-aqua font-bold hover:text-puzzle-aqua/80 transition-colors flex items-center">
              <Shield className="mr-1 h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {!isLoading && currentUserId ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9 border border-puzzle-aqua/50">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.display_name || ''} />
                    <AvatarFallback className="bg-puzzle-aqua/20 text-puzzle-aqua">
                      {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.display_name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.role || 'user'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                {(isAdmin || profile?.role === 'super_admin') && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin-dashboard" className="flex w-full cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer" 
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="default" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button variant="outline" className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold/10">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
