
import React from 'react';
import { Badge } from '@/components/ui/badge';

const PUZZLE_CATEGORIES = [
  'Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Gaming', 'All Categories'
];

export const PuzzleCategories: React.FC = () => {
  return (
    <div className="hidden md:flex space-x-2">
      {PUZZLE_CATEGORIES.map((category) => (
        <Badge 
          key={category} 
          variant={category === 'All Categories' ? 'default' : 'outline'}
          className={category === 'All Categories' ? 'bg-puzzle-aqua hover:bg-puzzle-aqua/80' : 'hover:bg-puzzle-aqua/10'}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};
