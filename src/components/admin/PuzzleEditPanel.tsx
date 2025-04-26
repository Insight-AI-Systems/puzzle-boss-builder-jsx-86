
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { PuzzlePreview } from "./puzzle-edit/PuzzlePreview";
import { PuzzleBasicFields } from "./puzzle-edit/PuzzleBasicFields";
import { PuzzlePricingFields } from "./puzzle-edit/PuzzlePricingFields";
import { PuzzleTimerSettings } from "./puzzle-edit/PuzzleTimerSettings";
import { PuzzleStatusToggle } from "./puzzle-edit/PuzzleStatusToggle";
import { usePuzzleEditValidation } from "./puzzle-edit/usePuzzleEditValidation";

interface PuzzleEditPanelProps {
  puzzle: any;
  categories: any[];
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentUser?: string;
}

const PuzzleEditPanel: React.FC<PuzzleEditPanelProps> = ({
  puzzle,
  categories,
  onChange,
  onSave,
  onCancel,
  onImageUpload,
  currentUser,
}) => {
  const { validatePuzzleForm } = usePuzzleEditValidation();

  useEffect(() => {
    console.log("PuzzleEditPanel received puzzle:", puzzle);
  }, [puzzle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleForm(puzzle)) {
      console.log("Submitting puzzle form with data:", puzzle);
      onSave();
    }
  };

  return (
    <div className="w-full p-4 mt-2 mb-4 bg-muted border rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
      <PuzzlePreview 
        puzzle={puzzle}
        onImageUpload={onImageUpload}
        onChange={onChange}
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
        tabIndex={-1}
      >
        <PuzzleBasicFields 
          puzzle={puzzle}
          categories={categories}
          currentUser={currentUser}
          onChange={onChange}
        />

        <PuzzlePricingFields 
          puzzle={puzzle}
          onChange={onChange}
        />

        <PuzzleTimerSettings 
          puzzle={puzzle}
          onChange={onChange}
        />

        <PuzzleStatusToggle 
          puzzle={puzzle}
          onChange={onChange}
        />

        <div className="flex gap-2 mt-2">
          <Button type="submit" variant="default" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PuzzleEditPanel;
