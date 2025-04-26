
import React from 'react';
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PuzzleList } from './PuzzleList';
import type { Puzzle } from '@/hooks/puzzles/puzzleTypes';

interface PuzzleTabsProps {
  puzzles: Puzzle[];
  categories: any[];
  editingId: string | null;
  editPuzzle: any;
  handleEditChange: (field: string, value: any) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  startEdit: (puzzle: Puzzle) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleStatus: (puzzle: Puzzle) => void;
  deletePuzzle: (id: string) => void;
}

export const PuzzleTabs: React.FC<PuzzleTabsProps> = ({
  puzzles,
  categories,
  editingId,
  editPuzzle,
  handleEditChange,
  saveEdit,
  cancelEdit,
  startEdit,
  handleImageUpload,
  handleToggleStatus,
  deletePuzzle,
}) => {
  const activePuzzles = puzzles.filter(p => p.status === "active");
  const scheduledPuzzles = puzzles.filter(p => p.status === "scheduled");
  const completedPuzzles = puzzles.filter(p => p.status === "completed");
  const draftPuzzles = puzzles.filter(p => p.status === "draft");

  return (
    <>
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="active" className="flex items-center">
          <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
            {activePuzzles.length}
          </Badge>
          Active
        </TabsTrigger>
        <TabsTrigger value="scheduled" className="flex items-center">
          <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
            {scheduledPuzzles.length}
          </Badge>
          Scheduled
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center">
          <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
            {completedPuzzles.length}
          </Badge>
          Completed
        </TabsTrigger>
        <TabsTrigger value="drafts" className="flex items-center">
          <Badge className="h-5 w-5 mr-2 flex items-center justify-center rounded-full text-xs p-0">
            {draftPuzzles.length}
          </Badge>
          Drafts
        </TabsTrigger>
      </TabsList>

      {["active", "scheduled", "completed", "drafts"].map(tabValue => (
        <TabsContent key={tabValue} value={tabValue} className="space-y-4">
          <PuzzleList
            puzzles={puzzles.filter(puzzle => {
              if (tabValue === "active") return puzzle.status === "active";
              if (tabValue === "scheduled") return puzzle.status === "scheduled";
              if (tabValue === "completed") return puzzle.status === "completed";
              if (tabValue === "drafts") return puzzle.status === "draft";
              return false;
            })}
            tabValue={tabValue}
            editingId={editingId}
            editPuzzle={editPuzzle}
            handleEditChange={handleEditChange}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            startEdit={startEdit}
            handleImageUpload={handleImageUpload}
            handleToggleStatus={handleToggleStatus}
            deletePuzzle={deletePuzzle}
            categories={categories}
          />
        </TabsContent>
      ))}
    </>
  );
};
