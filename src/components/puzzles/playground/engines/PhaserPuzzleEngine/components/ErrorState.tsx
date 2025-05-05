
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="phaser-puzzle-error">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
