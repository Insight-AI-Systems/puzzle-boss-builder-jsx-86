
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MemoryGameWrapper } from './MemoryGameWrapper';
import { MemoryLayout, MemoryTheme } from './types/memoryTypes';

interface MemoryGameLauncherProps {
  initialLayout?: MemoryLayout;
  initialTheme?: MemoryTheme;
  requiresPayment?: boolean;
  entryFee?: number;
  onBackToTournament?: () => void;
}

export function MemoryGameLauncher({
  initialLayout = '3x4',
  initialTheme = 'animals',
  requiresPayment = false,
  entryFee = 0,
  onBackToTournament
}: MemoryGameLauncherProps) {
  return (
    <div className="min-h-screen bg-puzzle-black">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={onBackToTournament}
          className="text-puzzle-white hover:text-puzzle-aqua"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tournament
        </Button>
      </div>

      {/* Game Container */}
      <div className="container mx-auto px-4 pb-8">
        <MemoryGameWrapper
          layout={initialLayout}
          theme={initialTheme}
          requiresPayment={requiresPayment}
          entryFee={entryFee}
        />
      </div>
    </div>
  );
}
