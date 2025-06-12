import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Grid3X3, Brain, Zap, Square, BookOpen, Puzzle, Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { usePuzzles } from '@/hooks/usePuzzles';

const PuzzleDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { puzzles = [], isLoading: puzzlesLoading } = usePuzzles();

  // Static game links for main game types - updated to use correct routes
  const mainGameTypes = [
    { name: 'Word Search Arena', href: '/games/word-search', icon: Search },
    { name: 'Speed Sudoku', href: '/games/sudoku', icon: Grid3X3 },
    { name: 'Memory Master', href: '/games/memory', icon: Brain },
    { name: 'Trivia Lightning', href: '/games/trivia', icon: Zap },
    { name: 'Block Puzzle Pro', href: '/games/blocks', icon: Square },
    { name: 'Daily Crossword', href: '/games/crossword', icon: BookOpen },
    { name: 'Mahjong Solitaire', href: '/games/mahjong', icon: Puzzle }
  ];

  // Filter active categories and get puzzle counts
  const activeCategories = categories.filter(cat => cat.status === 'active');
  const activePuzzles = puzzles.filter(puzzle => puzzle.status === 'active');

  // Group puzzles by category
  const puzzlesByCategory = activeCategories.map(category => ({
    ...category,
    puzzles: activePuzzles.filter(puzzle => puzzle.category_id === category.id),
    puzzleCount: activePuzzles.filter(puzzle => puzzle.category_id === category.id).length
  })).filter(category => category.puzzleCount > 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  const isLoading = categoriesLoading || puzzlesLoading;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-puzzle-white hover:text-puzzle-aqua hover:bg-white/10 transition-colors"
      >
        Puzzles
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-puzzle-black border border-puzzle-aqua/20 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-puzzle-aqua mr-2" />
                <span className="text-puzzle-white text-sm">Loading puzzles...</span>
              </div>
            )}

            {/* Main Game Types */}
            {!isLoading && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-puzzle-aqua uppercase tracking-wide">
                  Quick Play Games
                </div>
                {mainGameTypes.map((game) => (
                  <Link
                    key={game.href}
                    to={game.href}
                    className="flex items-center gap-3 px-4 py-2 text-puzzle-white hover:text-puzzle-gold hover:bg-puzzle-aqua/10 transition-colors duration-200"
                    onClick={handleItemClick}
                  >
                    <game.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{game.name}</span>
                  </Link>
                ))}

                {/* Divider */}
                <div className="my-2 h-px bg-puzzle-aqua/20 mx-3" />

                {/* Puzzle Categories */}
                <div className="px-4 py-2 text-xs font-semibold text-puzzle-aqua uppercase tracking-wide">
                  Puzzle Categories
                </div>
                
                {puzzlesByCategory.length > 0 ? (
                  puzzlesByCategory.map((category) => (
                    <div key={category.id} className="mb-2">
                      <Link
                        to={`/category/${category.id}`}
                        className="flex items-center justify-between px-4 py-2 text-puzzle-white hover:text-puzzle-gold hover:bg-puzzle-aqua/10 transition-colors duration-200 font-medium"
                        onClick={handleItemClick}
                      >
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs bg-puzzle-aqua/20 px-2 py-1 rounded">
                          {category.puzzleCount}
                        </span>
                      </Link>
                      
                      {/* Show first 3 puzzles in category */}
                      {category.puzzles.slice(0, 3).map((puzzle) => (
                        <Link
                          key={puzzle.id}
                          to={`/puzzle/${puzzle.id}`}
                          className="flex items-center gap-2 px-8 py-1 text-puzzle-white/80 hover:text-puzzle-gold hover:bg-puzzle-aqua/5 transition-colors duration-200"
                          onClick={handleItemClick}
                        >
                          <div className="w-2 h-2 bg-puzzle-aqua/40 rounded-full flex-shrink-0" />
                          <span className="text-xs truncate">{puzzle.name}</span>
                        </Link>
                      ))}
                      
                      {/* Show "view more" if more than 3 puzzles */}
                      {category.puzzles.length > 3 && (
                        <Link
                          to={`/category/${category.id}`}
                          className="flex items-center gap-2 px-8 py-1 text-puzzle-aqua/80 hover:text-puzzle-aqua transition-colors duration-200"
                          onClick={handleItemClick}
                        >
                          <span className="text-xs">
                            + {category.puzzles.length - 3} more puzzles
                          </span>
                        </Link>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-puzzle-white/60 text-sm">
                    No puzzles available yet
                  </div>
                )}

                {/* Divider */}
                <div className="my-2 h-px bg-puzzle-aqua/20 mx-3" />

                {/* All Puzzles Link */}
                <Link
                  to="/puzzles"
                  className="flex items-center gap-3 px-4 py-3 text-puzzle-white hover:text-puzzle-gold hover:bg-puzzle-aqua/10 transition-colors duration-200 font-semibold"
                  onClick={handleItemClick}
                >
                  <Puzzle className="h-4 w-4 flex-shrink-0" />
                  <span>All Puzzles</span>
                  {activePuzzles.length > 0 && (
                    <span className="ml-auto text-xs bg-puzzle-gold/20 text-puzzle-gold px-2 py-1 rounded">
                      {activePuzzles.length} total
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleDropdown;
