
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <div className="flex flex-col items-center">
      <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
      <p className="mt-2 text-sm text-muted-foreground">Loading financial data...</p>
    </div>
  </div>
);
