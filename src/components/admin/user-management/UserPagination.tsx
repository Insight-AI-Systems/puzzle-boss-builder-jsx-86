
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UserPagination({
  currentPage,
  totalPages,
  onPageChange
}: UserPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(0);
    
    // Logic for page numbers around current page
    const rangeStart = Math.max(1, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 2, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 1) {
      pages.push(-1); // -1 represents ellipsis
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 2) {
      pages.push(-2); // -2 represents ellipsis
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage + 1} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((pageNum, index) => {
          // Handle ellipsis
          if (pageNum < 0) {
            return (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            );
          }
          
          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="w-8 h-8 p-0"
            >
              {pageNum + 1}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
