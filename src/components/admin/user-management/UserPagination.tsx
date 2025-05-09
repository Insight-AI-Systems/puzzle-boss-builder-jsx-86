
import React from 'react';
import { Button } from "@/components/ui/button";

interface UserPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  currentCount: number;
  totalCount: number;
}

export function UserPagination({ 
  page, 
  setPage, 
  totalPages,
  currentCount,
  totalCount
}: UserPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {currentCount} of {totalCount} users
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page + 1} of {Math.max(1, totalPages)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
