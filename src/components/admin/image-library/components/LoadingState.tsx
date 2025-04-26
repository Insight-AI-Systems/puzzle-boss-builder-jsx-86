
import React from 'react';
import { RefreshCw } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center gap-2">
        <RefreshCw className="h-8 w-8 animate-spin text-puzzle-aqua" />
        <p className="text-sm text-muted-foreground">Loading images...</p>
      </div>
    </div>
  );
};
