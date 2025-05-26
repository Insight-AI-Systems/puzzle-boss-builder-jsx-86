
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import AuthButtons from './AuthButtons';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuthState } from '@/contexts/auth/AuthStateContext';
import { mainNavItems } from './NavbarData';

const Navbar = () => {
  const { isAuthenticated } = useAuthState();
  const { profile } = useUserProfile();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-puzzle-aqua/20 bg-puzzle-black/95 backdrop-blur">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-game text-xl font-bold">
              <span className="text-puzzle-aqua">The</span>{' '}
              <span className="text-puzzle-white">Puzzle</span>{' '}
              <span className="text-puzzle-gold">Boss</span>
            </span>
          </Link>
        </div>

        {isMobile ? (
          <>
            <div className="flex flex-1 items-center justify-end space-x-2">
              {isAuthenticated && profile && <UserMenu profile={profile} isMobile />}
              
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-0 text-base hover:bg-transparent focus:ring-0"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-puzzle-black border-puzzle-aqua/20">
                  <div className="flex justify-between items-center py-4">
                    <Link 
                      to="/" 
                      className="font-game text-xl font-bold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-puzzle-aqua">The</span>{' '}
                      <span className="text-puzzle-white">Puzzle</span>{' '}
                      <span className="text-puzzle-gold">Boss</span>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-0 text-base hover:bg-transparent focus:ring-0"
                    >
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close Menu</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-4 mt-4">
                    <NavLinks 
                      items={mainNavItems}
                      className="block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMobileMenuOpen(false)} 
                    />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1">
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <NavLinks items={mainNavItems} />
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && profile ? (
                <UserMenu profile={profile} />
              ) : (
                <AuthButtons />
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
