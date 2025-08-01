import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Gamepad2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { gameItems } from './NavbarData';
import { cn } from '@/lib/utils';

interface GamesDropdownProps {
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const GamesDropdown: React.FC<GamesDropdownProps> = ({ 
  className, 
  isMobile = false, 
  onItemClick 
}) => {
  if (isMobile) {
    // For mobile, render as a collapsible list
    return (
      <div className="space-y-1">
        <div className={cn(
          'flex items-center px-3 py-2 text-puzzle-white font-medium',
          className
        )}>
          <Gamepad2 className="h-5 w-5 mr-2" />
          Games
        </div>
        <div className="pl-6 space-y-1">
          {gameItems.map((game) => (
            <Link
              key={game.href}
              to={game.href}
              className="block px-3 py-2 text-sm text-puzzle-white/80 hover:text-puzzle-aqua hover:bg-white/10 rounded transition-colors"
              onClick={onItemClick}
            >
              {game.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Desktop dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center text-puzzle-white hover:text-puzzle-aqua hover:bg-white/10 px-3 py-2 rounded transition-colors',
            className
          )}
        >
          <Gamepad2 className="h-5 w-5 mr-2" />
          Games
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-puzzle-black border-puzzle-aqua/20 z-50"
      >
        {gameItems.map((game) => (
          <DropdownMenuItem key={game.href} asChild>
            <Link
              to={game.href}
              className="flex flex-col items-start w-full px-3 py-3 text-puzzle-white hover:text-puzzle-aqua hover:bg-white/10 transition-colors"
              onClick={onItemClick}
            >
              <span className="font-medium">{game.name}</span>
              {game.description && (
                <span className="text-xs text-puzzle-white/60 mt-1">
                  {game.description}
                </span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GamesDropdown;