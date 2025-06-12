import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Grid3X3, Brain, Zap, Square, BookOpen, Puzzle, User } from 'lucide-react';
import { MainNavItem } from './NavbarData';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useClerkAuth } from '@/hooks/useClerkAuth';

// Check if Clerk is available
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface MobileMenuProps {
  isOpen: boolean;
  navItems: MainNavItem[];
  isLoggedIn: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navItems, isLoggedIn, onClose }) => {
  const [expandedPuzzles, setExpandedPuzzles] = useState(false);
  const { profile } = useUserProfile();
  
  // Only use Clerk auth hooks if Clerk is configured
  let hasRole = () => false;
  let isAdmin = false;
  
  if (PUBLISHABLE_KEY) {
    try {
      const clerkAuth = useClerkAuth();
      hasRole = clerkAuth.hasRole;
      isAdmin = clerkAuth.isAdmin;
    } catch (error) {
      console.warn('Clerk not available in MobileMenu, running without authentication');
    }
  }

  if (!isOpen) return null;

  const shouldShowLink = (item: MainNavItem) => {
    if (!item.roles) return true;
    if (!profile) return false;
    
    return isAdmin || item.roles.some(role => hasRole(role));
  };

  const getPuzzleDropdownItems = () => [
    { name: 'Word Search Arena', href: '/puzzles/word-search', icon: Search },
    { name: 'Speed Sudoku', href: '/puzzles/sudoku', icon: Grid3X3 },
    { name: 'Memory Master', href: '/puzzles/memory', icon: Brain },
    { name: 'Trivia Lightning', href: '/puzzles/trivia', icon: Zap },
    { name: 'Block Puzzle Pro', href: '/puzzles/blocks', icon: Square },
    { name: 'Daily Crossword', href: '/puzzles/crossword', icon: BookOpen },
    { name: 'divider', href: '', icon: null },
    { name: 'All Puzzles', href: '/puzzles', icon: Puzzle, isBold: true }
  ];

  const handlePuzzlesToggle = () => {
    setExpandedPuzzles(!expandedPuzzles);
  };
  
  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-puzzle-aqua/20">
        {/* Profile Link for logged-in users - only show if Clerk is configured */}
        {PUBLISHABLE_KEY && isLoggedIn && (
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-puzzle-white hover:bg-white/10"
            onClick={onClose}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        )}

        {navItems.map((item) => shouldShowLink(item) && (
          <div key={item.href}>
            {item.name === 'Puzzles' ? (
              <>
                <button
                  onClick={handlePuzzlesToggle}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-puzzle-white hover:bg-white/10"
                >
                  <span>Puzzles</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-300 ${
                      expandedPuzzles ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {/* Expandable Puzzles Sub-menu */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  expandedPuzzles ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pl-4 space-y-1">
                    {getPuzzleDropdownItems().map((dropdownItem, index) => (
                      dropdownItem.name === 'divider' ? (
                        <div 
                          key={`divider-${index}`}
                          className="my-2 h-px bg-puzzle-aqua/20 mx-3"
                        />
                      ) : (
                        <Link
                          key={dropdownItem.href}
                          to={dropdownItem.href}
                          className={`flex items-center gap-3 px-4 py-3 text-white hover:text-puzzle-gold hover:bg-puzzle-aqua/10 transition-colors duration-200 rounded-md ${
                            dropdownItem.isBold ? 'font-semibold' : ''
                          }`}
                          style={{ fontSize: '15px' }}
                          onClick={onClose}
                        >
                          {dropdownItem.icon && (
                            <dropdownItem.icon className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span>{dropdownItem.name}</span>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link
                to={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-puzzle-white hover:bg-white/10"
                onClick={onClose}
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
        
        {/* Sign up button - only show if Clerk is configured and user is not logged in */}
        {PUBLISHABLE_KEY && !isLoggedIn && (
          <Link
            to="/auth?signup=true"
            className="block px-3 py-2 rounded-md text-base font-medium text-puzzle-white bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-center mt-4"
            onClick={onClose}
          >
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
