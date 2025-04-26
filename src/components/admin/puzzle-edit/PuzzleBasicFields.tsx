
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import type { Puzzle } from '@/hooks/puzzles/puzzleTypes';

interface PuzzleBasicFieldsProps {
  puzzle: any;
  categories: any[];
  currentUser?: string;
  onChange: (field: string, value: any) => void;
}

const GRID_SIZES = [
  { value: '3x3', label: '3×3 (9 pieces)', pieces: 9 },
  { value: '4x4', label: '4×4 (16 pieces)', pieces: 16 },
  { value: '5x5', label: '5×5 (25 pieces)', pieces: 25 },
  { value: '6x6', label: '6×6 (36 pieces)', pieces: 36 },
  { value: '7x7', label: '7×7 (49 pieces)', pieces: 49 },
  { value: '8x8', label: '8×8 (64 pieces)', pieces: 64 },
  { value: '9x9', label: '9×9 (81 pieces)', pieces: 81 },
  { value: '10x10', label: '10×10 (100 pieces)', pieces: 100 },
];

// Map grid size values to difficulty levels
const mapGridSizeToDifficulty = (gridSize: string): "easy" | "medium" | "hard" => {
  // Logic to determine difficulty based on grid size
  const sizeParts = gridSize.split('x');
  const size = parseInt(sizeParts[0]) || 0;
  
  if (size <= 4) return "easy";
  if (size <= 6) return "medium";
  return "hard";
};

export const PuzzleBasicFields: React.FC<PuzzleBasicFieldsProps> = ({
  puzzle,
  categories,
  currentUser,
  onChange,
}) => {
  // Make sure the difficulty is always initialized
  useEffect(() => {
    if (!puzzle.difficulty && GRID_SIZES.length > 0) {
      // First set the grid size
      const gridSize = GRID_SIZES[0].value;
      onChange("gridSize", gridSize);
      
      // Then set the difficulty based on the grid size
      const difficulty = mapGridSizeToDifficulty(gridSize);
      onChange("difficulty", difficulty);
      
      // Set the pieces
      onChange("pieces", GRID_SIZES[0].pieces);
    }
  }, [puzzle, onChange]);

  const renderDifficultyBadge = (pieces: number) => {
    if (pieces <= 16) return <Badge variant="outline">Easy</Badge>;
    if (pieces <= 36) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="destructive">Hard</Badge>;
  };

  const currentGridSize = GRID_SIZES.find(size => size.value === puzzle?.gridSize) || 
                         GRID_SIZES.find(size => {
                           // Try to find by pieces if gridSize is not set
                           return size.pieces === puzzle?.pieces;
                         }) ||
                         GRID_SIZES[0];
  
  console.log("Current puzzle in PuzzleBasicFields:", puzzle);
  console.log("Current grid size:", currentGridSize);

  return (
    <>
      <div>
        <Label htmlFor="edit-name" className="block mb-1">Puzzle Name</Label>
        <Input
          id="edit-name"
          value={puzzle?.name ?? ""}
          onChange={e => onChange("name", e.target.value)}
          data-testid="edit-name"
          className="mb-1"
          autoFocus
        />
      </div>

      <div>
        <Label htmlFor="edit-puzzleowner" className="block mb-1">Puzzle Owner</Label>
        <Input
          id="edit-puzzleowner"
          value={puzzle?.puzzleOwner ?? currentUser ?? ""}
          onChange={e => onChange("puzzleOwner", e.target.value)}
          data-testid="edit-puzzleowner"
          className="mb-1"
          placeholder="Administrator who set it up"
        />
      </div>

      <div>
        <Label htmlFor="edit-category" className="block mb-1">Category</Label>
        <Select
          value={puzzle?.category ?? ""}
          onValueChange={v => onChange("category", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat: any) => (
              <SelectItem value={cat.name} key={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="edit-supplier" className="block mb-1">Supplier</Label>
        <Input
          id="edit-supplier"
          value={puzzle?.supplier ?? ""}
          onChange={e => onChange("supplier", e.target.value)}
          data-testid="edit-supplier"
          className="mb-1"
          placeholder="e.g. Brand or supplier name"
        />
      </div>

      <div>
        <Label htmlFor="edit-difficulty" className="block mb-1">Grid Size</Label>
        <Select
          value={puzzle?.gridSize ?? currentGridSize.value}
          onValueChange={v => {
            console.log("Grid size selected:", v);
            const selectedSize = GRID_SIZES.find(size => size.value === v);
            
            // Store the grid size for UI purposes
            onChange("gridSize", v);
            
            // Map grid size to difficulty level for backend
            const difficultyLevel = mapGridSizeToDifficulty(v);
            onChange("difficulty", difficultyLevel);
            
            // Set pieces count
            if (selectedSize) {
              onChange("pieces", selectedSize.pieces);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {puzzle?.gridSize ? (
                <span className="flex items-center gap-2">
                  {currentGridSize.label}
                  {renderDifficultyBadge(currentGridSize.pieces)}
                </span>
              ) : (
                "Select grid size..."
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {GRID_SIZES.map((size) => (
              <SelectItem value={size.value} key={size.value} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {size.label}
                  {renderDifficultyBadge(size.pieces)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="edit-description" className="block mb-1">Description</Label>
        <Textarea
          id="edit-description"
          value={puzzle?.description ?? ""}
          onChange={e => onChange("description", e.target.value)}
          data-testid="edit-description"
          className="mb-1"
          placeholder="Enter a description for this puzzle"
        />
      </div>
    </>
  );
};
