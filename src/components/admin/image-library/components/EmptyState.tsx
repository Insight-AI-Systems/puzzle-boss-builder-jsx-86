
import React from 'react';
import { UploadCloud } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12 border rounded-md">
      <UploadCloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground mb-2">No images found</p>
      <p className="text-sm text-muted-foreground">
        Upload some images to get started or try a different search term
      </p>
    </div>
  );
};
