
import React from 'react';
import { Box, Loader } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  isLoading = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-muted/30 rounded-md">
      <div className="mb-4 p-3 rounded-full bg-muted">
        {isLoading ? (
          <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
        ) : (
          icon || <Box className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
};
