
import React from 'react';
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

export const CategoryTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Playable Puzzles</TableHead>
        <TableHead>Active</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
