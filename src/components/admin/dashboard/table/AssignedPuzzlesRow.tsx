
import React from 'react';
import { TableRow, TableCell, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PuzzleInfo } from '@/hooks/admin/usePuzzlesByCategory';

interface AssignedPuzzlesRowProps {
  categoryId: string;
  isEditing: boolean;
  puzzles: PuzzleInfo[];
  isLoading: boolean;
  handleDeletePuzzle?: (puzzleId: string) => void;
}

export const AssignedPuzzlesRow: React.FC<AssignedPuzzlesRowProps> = ({
  categoryId,
  isEditing,
  puzzles,
  isLoading,
  handleDeletePuzzle
}) => {
  if (!isEditing) return null;

  return (
    <TableRow>
      <TableCell colSpan={6} className="bg-gray-50 p-3">
        <div className="mt-2 mb-3">
          <h4 className="text-sm font-semibold mb-2 text-blue-700">Assigned Puzzles</h4>
          {isLoading ? (
            <p className="text-sm text-blue-700">Loading puzzles...</p>
          ) : puzzles.length > 0 ? (
            <div className="border rounded-md bg-gray-100">
              <Table>
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="text-blue-700 font-bold">Title</TableHead>
                    <TableHead className="text-blue-700 font-bold">Status</TableHead>
                    <TableHead className="text-blue-700 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {puzzles.map((puzzle) => (
                    <TableRow key={puzzle.id} className="bg-gray-100 hover:bg-gray-200">
                      <TableCell className="text-blue-700 font-medium">{puzzle.title}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${puzzle.status === 'active' ? 'bg-green-100 text-green-800' : 
                            puzzle.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                            'bg-amber-100 text-amber-800'}`
                        }>
                          {puzzle.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePuzzle && handleDeletePuzzle(puzzle.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={!handleDeletePuzzle}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-blue-700">No puzzles assigned to this category</p>
          )}
          <p className="text-xs text-blue-700 mt-2 font-medium">
            Note: All puzzles must be removed before the category can be deleted.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};
