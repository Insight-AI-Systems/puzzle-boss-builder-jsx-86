
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { usePuzzleSettings } from '@/hooks/usePuzzleSettings';
import { usePuzzleProgress } from '@/hooks/usePuzzleProgress';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface PuzzleContextType {
  settings: ReturnType<typeof usePuzzleSettings>;
  progress: ReturnType<typeof usePuzzleProgress> | null;
  isAuthenticated: boolean;
}

const PuzzleContext = createContext<PuzzleContextType | null>(null);

export function PuzzleProvider({ 
  children, 
  puzzleId 
}: { 
  children: ReactNode;
  puzzleId?: string;
}) {
  const [progressData, setProgressData] = useState(null);
  
  // Check authentication status
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return { isAuthenticated: !!user };
    }
  });

  const isAuthenticated = authData?.isAuthenticated || false;
  
  const settings = usePuzzleSettings();
  
  // Always call the hook, but only use its result if conditions are met
  const progressResult = usePuzzleProgress(puzzleId || '');
  
  // Only use the progress result if user is authenticated and puzzleId is provided
  const progress = (isAuthenticated && puzzleId) ? progressResult : null;

  return (
    <PuzzleContext.Provider value={{ settings, progress, isAuthenticated }}>
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
