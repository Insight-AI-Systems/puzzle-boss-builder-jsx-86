
import React from 'react';
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from '@/components/dashboard/ErrorDisplay';

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="mb-4">
    <ErrorDisplay error={error.message} />
    <div className="flex justify-center mt-2">
      <Button 
        onClick={onRetry}
        variant="outline" 
        size="sm"
      >
        Retry Loading Data
      </Button>
    </div>
  </div>
);
