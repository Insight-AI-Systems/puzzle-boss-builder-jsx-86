
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown } from "lucide-react";

interface UserFiltersProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

export function UserFilters({ filtersOpen, setFiltersOpen }: UserFiltersProps) {
  return (
    <div>
      <Button 
        variant="outline" 
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="flex gap-1 items-center mb-4"
      >
        <Filter className="h-4 w-4" />
        Filters
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {filtersOpen && (
        <div className="bg-muted/50 p-4 rounded-md mb-4">
          <p>Advanced filters will appear here</p>
        </div>
      )}
    </div>
  );
}
