
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoriesErrorProps {
  onRetry: () => void;
  error?: any;
}

export const CategoriesError: React.FC<CategoriesErrorProps> = ({ onRetry, error }) => {
  console.error('Error loading categories:', error);
  
  return (
    <div className="text-center py-8">
      <div className="text-red-500 mb-4">
        Failed to load categories. Please try again later.
      </div>
      <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
};
