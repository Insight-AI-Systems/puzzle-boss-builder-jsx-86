
import React, { createContext, useContext, ReactNode } from 'react';
import { usePuzzleSettings } from '@/hooks/usePuzzleSettings';
import { usePuzzleProgress } from '@/hooks/usePuzzleProgress';

interface PuzzleContextType {
  settings: ReturnType<typeof usePuzzleSettings>;
  progress: ReturnType<typeof usePuzzleProgress> | null;
}

const PuzzleContext = createContext<PuzzleContextType | null>(null);

export function PuzzleProvider({ 
  children, 
  puzzleId 
}: { 
  children: ReactNode;
  puzzleId?: string;
}) {
  const settings = usePuzzleSettings();
  const progress = puzzleId ? usePuzzleProgress(puzzleId) : null;

  return (
    <PuzzleContext.Provider value={{ settings, progress }}>
      {children}
    </PuzzleContext.Provider>
  );
}

export function usePuzzleContext() {
  const context = useContext(PuzzleContext);
  if (!context) {
    throw new Error('usePuzzleContext must be used within a PuzzleProvider');
  }
  return context;
}
