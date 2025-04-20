
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

interface UserPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function UserPagination({ page, totalPages, onPageChange }: UserPaginationProps) {
  return totalPages > 1 ? (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="gap-1 pl-2.5"
          >
            <span>Previous</span>
          </Button>
        </PaginationItem>
        <PaginationItem className="flex items-center">
          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="gap-1 pr-2.5"
          >
            <span>Next</span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ) : null;
}
