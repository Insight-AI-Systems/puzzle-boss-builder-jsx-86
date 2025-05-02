
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoriesEmptyProps {
  onRefresh: () => void;
}

export const CategoriesEmpty: React.FC<CategoriesEmptyProps> = ({ onRefresh }) => {
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-4">
        No categories available in the database.
      </div>
      <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};
