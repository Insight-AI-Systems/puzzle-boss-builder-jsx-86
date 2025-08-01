import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PuzzleGameSidebar } from './PuzzleGameSidebar';

interface PuzzleGameLayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
  gameStats?: {
    timeElapsed: number;
    moves: number;
    completionPercentage: number;
    hintsUsed: number;
  };
  onAction?: (action: string) => void;
  showSidebar?: boolean;
}

export const PuzzleGameLayout: React.FC<PuzzleGameLayoutProps> = ({
  children,
  sidebarContent,
  gameStats,
  onAction,
  showSidebar = true
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-80 flex-shrink-0">
              {sidebarContent || (
                <PuzzleGameSidebar 
                  gameStats={gameStats}
                  onAction={onAction}
                />
              )}
            </div>
          )}
          
          {/* Main Game Area */}
          <div className="flex-1">
            <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
              <CardContent className="p-6">
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};