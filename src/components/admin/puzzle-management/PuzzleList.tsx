
import React from 'react';
import { TableHeader, TableRow, TableHead, TableBody, Table } from "@/components/ui/table";
import { PuzzleListRow } from './PuzzleListRow';
import { PuzzleEditPanel } from '../puzzle-edit/PuzzleEditPanel';
import type { Puzzle } from '@/hooks/puzzles/puzzleTypes';
import { useUserProfile } from '@/hooks/useUserProfile';

interface PuzzleListProps {
  puzzles: Puzzle[];
  tabValue: string;
  editingId: string | null;
  editPuzzle: any;
  handleEditChange: (field: string, value: any) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  startEdit: (puzzle: Puzzle) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleStatus: (puzzle: Puzzle) => void;
  deletePuzzle: (id: string) => void;
  categories: any[];
}

export const PuzzleList: React.FC<PuzzleListProps> = ({
  puzzles,
  tabValue,
  editingId,
  editPuzzle,
  handleEditChange,
  saveEdit,
  cancelEdit,
  startEdit,
  handleImageUpload,
  handleToggleStatus,
  deletePuzzle,
  categories
}) => {
  const { profile } = useUserProfile();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Time Limit</TableHead>
            <TableHead>Prize</TableHead>
            {tabValue !== "drafts" && tabValue !== "scheduled" && (
              <>
                <TableHead>Completions</TableHead>
                <TableHead>Avg Time</TableHead>
              </>
            )}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puzzles.map((puzzle) =>
            editingId === puzzle.id ? (
              <TableRow key={puzzle.id}>
                <TableCell colSpan={tabValue !== "drafts" && tabValue !== "scheduled" ? 9 : 7} className="bg-muted pt-8 pb-8 px-2">
                  <PuzzleEditPanel
                    puzzle={editPuzzle}
                    categories={categories}
                    onChange={handleEditChange}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    onImageUpload={handleImageUpload}
                    currentUser={profile?.display_name || profile?.email || ""}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <PuzzleListRow
                key={puzzle.id}
                puzzle={puzzle}
                tabValue={tabValue}
                onEdit={() => startEdit(puzzle)}
                onDelete={() => {
                  if (window.confirm('Are you sure you want to delete this puzzle?')) {
                    deletePuzzle(puzzle.id);
                  }
                }}
                onToggleStatus={() => handleToggleStatus(puzzle)}
              />
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};
