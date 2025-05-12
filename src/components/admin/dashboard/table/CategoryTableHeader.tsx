
import React from 'react';
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

export const CategoryTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-foreground">Image</TableHead>
        <TableHead className="text-foreground">Name</TableHead>
        <TableHead className="text-foreground">Description</TableHead>
        <TableHead className="text-foreground">Playable Puzzles</TableHead>
        <TableHead className="text-foreground">Active</TableHead>
        <TableHead className="text-right text-foreground">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
