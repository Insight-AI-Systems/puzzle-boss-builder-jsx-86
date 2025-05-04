
import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-30">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-3"></div>
        <p className="text-sm text-muted-foreground">Loading puzzle...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
