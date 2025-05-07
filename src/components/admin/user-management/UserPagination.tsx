
import React from 'react';
import { Button } from "@/components/ui/button";

export interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentCount?: number;
  totalCount?: number;
}

export function UserPagination({ 
  currentPage, 
  totalPages,
  onPageChange,
  currentCount,
  totalCount
}: UserPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      {currentCount && totalCount && (
        <div className="text-sm text-muted-foreground">
          Showing {currentCount} of {totalCount} users
        </div>
      )}
      <div className="flex items-center space-x-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage + 1} of {Math.max(1, totalPages)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
