
import React from 'react';
import { Input } from "@/components/ui/input";

interface PuzzleSearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const PuzzleSearchBar: React.FC<PuzzleSearchBarProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="relative w-full max-w-sm">
      <Input
        placeholder="Search puzzles..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  );
};
