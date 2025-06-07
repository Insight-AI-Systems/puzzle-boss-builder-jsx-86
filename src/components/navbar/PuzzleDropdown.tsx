
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Grid3X3, Brain, Zap, Square, BookOpen, Puzzle } from 'lucide-react';

const PuzzleDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const puzzleItems = [
    { name: 'Word Search Arena', href: '/puzzles/word-search', icon: Search },
    { name: 'Speed Sudoku', href: '/puzzles/sudoku', icon: Grid3X3 },
    { name: 'Memory Master', href: '/puzzles/memory', icon: Brain },
    { name: 'Trivia Lightning', href: '/puzzles/trivia', icon: Zap },
    { name: 'Block Puzzle Pro', href: '/puzzles/blocks', icon: Square },
    { name: 'Daily Crossword', href: '/puzzles/crossword', icon: BookOpen },
    { name: 'divider', href: '', icon: null },
    { name: 'All Puzzles', href: '/puzzles', icon: Puzzle, isBold: true }
  ];

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
        <div className="absolute top-full left-0 mt-1 w-64 bg-puzzle-black border border-puzzle-aqua/20 rounded-md shadow-lg z-50">
          <div className="py-2">
            {puzzleItems.map((item, index) => (
              item.name === 'divider' ? (
                <div 
                  key={`divider-${index}`}
                  className="my-2 h-px bg-puzzle-aqua/20 mx-3"
                />
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-puzzle-white hover:text-puzzle-gold hover:bg-puzzle-aqua/10 transition-colors duration-200 ${
                    item.isBold ? 'font-semibold' : ''
                  }`}
                  onClick={handleItemClick}
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleDropdown;
