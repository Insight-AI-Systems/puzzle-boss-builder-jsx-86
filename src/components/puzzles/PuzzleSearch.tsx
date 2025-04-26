
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PuzzleSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const PuzzleSearch: React.FC<PuzzleSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="relative w-full max-w-sm">
        <Input
          type="text"
          placeholder="Search puzzles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};
