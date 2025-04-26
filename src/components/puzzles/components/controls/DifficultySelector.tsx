
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DifficultyLevel } from '../../types/puzzle-types';

interface DifficultySelectorProps {
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  isLoading: boolean;
  isMobile?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  setDifficulty,
  isLoading,
  isMobile = false
}) => {
  return (
    <Select
      value={difficulty}
      onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
      disabled={isLoading}
    >
      <SelectTrigger className={isMobile ? "w-16 h-8 text-xs" : "w-36"}>
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3x3">{isMobile ? "3×3" : "3×3 (Easy)"}</SelectItem>
        <SelectItem value="4x4">{isMobile ? "4×4" : "4×4 (Medium)"}</SelectItem>
        <SelectItem value="5x5">{isMobile ? "5×5" : "5×5 (Hard)"}</SelectItem>
      </SelectContent>
    </Select>
  );
};
