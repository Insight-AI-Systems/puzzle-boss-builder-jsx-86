
import React from 'react';
import { Loader2 } from 'lucide-react';

export const CategoriesLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
    </div>
  );
};
