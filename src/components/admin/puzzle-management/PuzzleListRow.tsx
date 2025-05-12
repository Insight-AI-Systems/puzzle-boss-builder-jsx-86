
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Shuffle } from "lucide-react";
import type { Puzzle } from '@/hooks/puzzles/puzzleTypes';

interface PuzzleListRowProps {
  puzzle: Puzzle;
  tabValue: string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export const PuzzleListRow: React.FC<PuzzleListRowProps> = ({
  puzzle,
  tabValue,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const formatTime = (seconds: number) => {
    if (seconds === 0) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TableRow>
      <TableCell className="font-medium align-top">
        <span className="flex items-center gap-2">
          {puzzle.imageUrl && (
            <img src={puzzle.imageUrl} alt="Puzzle" className="w-10 h-10 rounded object-cover border border-puzzle-aqua/20" />
          )}
          {puzzle.name}
        </span>
      </TableCell>
      <TableCell className="align-top">
        {puzzle.category}
      </TableCell>
      <TableCell>
        <Badge variant={
          puzzle.difficulty === "easy" ? "outline" :
          puzzle.difficulty === "medium" ? "secondary" : "destructive"
        }>
          {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="flex flex-col gap-1 align-top">
        {formatTime(puzzle.timeLimit)}
      </TableCell>
      <TableCell className="flex flex-col gap-1 align-top">
        <span className="flex items-center">
          {puzzle.prize || puzzle.name}
        </span>
      </TableCell>
      {tabValue !== "drafts" && tabValue !== "scheduled" && (
        <>
          <TableCell>
            {puzzle.completions}
          </TableCell>
          <TableCell>
            {formatTime(puzzle.avgTime || 0)}
          </TableCell>
        </>
      )}
      <TableCell className="text-right align-top">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          {(puzzle.status === "draft" || puzzle.status === "inactive") && (
            <Button variant="ghost" size="icon" onClick={onToggleStatus} title={puzzle.status === "inactive" ? "Make Active" : "Activate"}>
              <Shuffle className="h-4 w-4 text-green-500" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
