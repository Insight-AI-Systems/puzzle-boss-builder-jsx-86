
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Puzzle } from 'lucide-react';

interface LoadingGameProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

export function LoadingGame({ 
  message = 'Loading game...', 
  showProgress = false,
  progress = 0,
  className = '' 
}: LoadingGameProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Puzzle className="h-12 w-12 text-primary opacity-20" />
            <Loader2 className="h-8 w-8 absolute top-2 left-2 animate-spin text-primary" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">{message}</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we prepare your game experience
            </p>
          </div>

          {showProgress && (
            <div className="w-full max-w-xs">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <p className="text-xs text-center mt-1 text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
