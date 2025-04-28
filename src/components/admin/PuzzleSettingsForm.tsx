
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Grid, LayoutGrid } from "lucide-react";
import { PuzzleConfig } from './PuzzleAdminPanel';

interface PuzzleSettingsFormProps {
  config: PuzzleConfig;
  onConfigChange: (config: Partial<PuzzleConfig>) => void;
}

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy (3×3)", rows: 3, columns: 3 },
  { value: "medium", label: "Medium (4×4)", rows: 4, columns: 4 },
  { value: "hard", label: "Hard (5×5)", rows: 5, columns: 5 },
  { value: "expert", label: "Expert (6×6)", rows: 6, columns: 6 },
  { value: "master", label: "Master (8×8)", rows: 8, columns: 8 },
  { value: "impossible", label: "Impossible (12×12)", rows: 12, columns: 12 },
];

export const PuzzleSettingsForm: React.FC<PuzzleSettingsFormProps> = ({ 
  config, 
  onConfigChange 
}) => {
  const handleDifficultyChange = (value: string) => {
    const selectedDifficulty = DIFFICULTY_OPTIONS.find(option => option.value === value);
    if (selectedDifficulty) {
      onConfigChange({
        difficulty: {
          value: selectedDifficulty.value,
          rows: selectedDifficulty.rows,
          columns: selectedDifficulty.columns
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LayoutGrid className="h-5 w-5 mr-2" />
          Puzzle Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <Select 
            value={config.difficulty.value} 
            onValueChange={handleDifficultyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} ({option.rows}×{option.columns})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Current grid: {config.difficulty.rows}×{config.difficulty.columns} 
            ({config.difficulty.rows * config.difficulty.columns} pieces)
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Piece Style</Label>
          <Select 
            value={config.pieceStyle} 
            onValueChange={(value) => onConfigChange({ pieceStyle: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select piece style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="custom">Custom SVG</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            {config.pieceStyle === 'custom' 
              ? 'Using custom SVG piece style' 
              : `Using ${config.pieceStyle} piece style`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
