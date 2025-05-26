
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import AuthButtons from '@/components/navbar/AuthButtons';

const Navbar = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu } = useMobileMenu();

  return (
    <nav className="bg-puzzle-black border-b border-puzzle-aqua/20 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-puzzle-aqua">The</span>{' '}
          <span className="text-puzzle-white">Puzzle</span>{' '}
          <span className="text-puzzle-gold">Boss</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile"
                  className="text-puzzle-aqua hover:text-puzzle-aqua/80"
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="text-puzzle-white hover:text-puzzle-aqua"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <AuthButtons isMobile={true} />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-puzzle-white">
                  Welcome, {user?.email}
                </span>
                <Link 
                  to="/profile"
                  className="text-puzzle-aqua hover:text-puzzle-aqua/80"
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  className="text-puzzle-white hover:text-puzzle-aqua"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <AuthButtons />
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
