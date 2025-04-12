
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, PuzzlePiece, Trophy, Settings, ShoppingCart, Info, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { cn } from '@/lib/utils';

/**
 * MainMenu component that provides consistent navigation across all pages
 */
const MainMenu = ({ className }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Menu items - these will be available for all users
  const menuItems = [
    { 
      title: 'Home', 
      path: '/', 
      icon: Home 
    },
    { 
      title: 'Puzzles', 
      path: '/puzzles', 
      icon: PuzzlePiece 
    },
    { 
      title: 'Leaderboard', 
      path: '/leaderboard', 
      icon: Trophy 
    }
  ];
  
  // Only show these items if user is logged in
  const authMenuItems = [
    { 
      title: 'Profile', 
      path: '/profile', 
      icon: User 
    },
    { 
      title: 'Shop Credits', 
      path: '/shop', 
      icon: ShoppingCart 
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: Settings 
    }
  ];
  
  // Helper items
  const helperItems = [
    { 
      title: 'Help', 
      path: '/help', 
      icon: HelpCircle 
    },
    { 
      title: 'About', 
      path: '/about', 
      icon: Info 
    }
  ];
  
  // Combine items based on auth status
  const allItems = [
    ...menuItems,
    ...(user ? authMenuItems : []),
    ...helperItems
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className={cn("py-4 flex justify-center bg-puzzle-black/90 backdrop-blur-md border-b border-puzzle-aqua/20", className)}>
      <div className="container flex justify-between">
        <div className="hidden md:flex items-center space-x-8">
          {allItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 py-2 nav-link transition-colors duration-200",
                isActive(item.path) 
                  ? "text-puzzle-aqua" 
                  : "text-muted-foreground hover:text-puzzle-aqua"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden flex justify-center w-full">
          <div className="flex items-center space-x-4">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 py-1 px-3 nav-link transition-colors duration-200",
                  isActive(item.path) 
                    ? "text-puzzle-aqua" 
                    : "text-muted-foreground hover:text-puzzle-aqua"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.title}</span>
              </Link>
            ))}
            
            {user && (
              <Link
                to="/profile"
                className={cn(
                  "flex flex-col items-center gap-1 py-1 px-3 nav-link transition-colors duration-200",
                  isActive('/profile') 
                    ? "text-puzzle-aqua" 
                    : "text-muted-foreground hover:text-puzzle-aqua"
                )}
              >
                <User className="h-5 w-5" />
                <span className="text-xs">Profile</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainMenu;
