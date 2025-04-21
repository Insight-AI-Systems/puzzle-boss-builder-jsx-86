import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleLeft, ToggleRight, Image, Save, X } from "lucide-react";

interface PuzzleEditPanelProps {
  puzzle: any;
  categories: any[];
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PuzzleEditPanel: React.FC<PuzzleEditPanelProps> = ({
  puzzle,
  categories,
  onChange,
  onSave,
  onCancel,
  onImageUpload,
}) => {
  // ghost image grid
  const grid = { easy: 3, medium: 4, hard: 5 }[puzzle?.difficulty] || 4;
  const boxSize = 56;
  const total = grid * grid;

  // timer toggle logic
  const [timerEnabled, setTimerEnabled] = useState(Boolean(puzzle?.timeLimit && puzzle.timeLimit > 0));

  useEffect(() => {
    // when puzzle changes, update toggled state accordingly
    setTimerEnabled(Boolean(puzzle?.timeLimit && puzzle.timeLimit > 0));
  }, [puzzle?.timeLimit]);

  const handleToggleTimer = (checked: boolean) => {
    setTimerEnabled(checked);
    if (!checked) {
      onChange("timeLimit", 0);
    } else {
      // Set to default (if necessary) or leave value as is.
      if (!puzzle.timeLimit || puzzle.timeLimit === 0) {
        onChange("timeLimit", 300);
      }
    }
  };

  return (
    <div className="w-full p-4 mt-2 mb-4 bg-muted border rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Puzzle Ghost Image Preview */}
      <div className="flex flex-col items-center gap-2">
        <Label className="text-xs mb-1">Puzzle Preview ("Ghost" as seen by users)</Label>
        <div 
          className="relative bg-gradient-to-br from-puzzle-aqua/20 to-puzzle-black/70 rounded border border-puzzle-aqua/40 flex items-center justify-center overflow-hidden transition-all"
          style={{ width: boxSize * grid, height: boxSize * grid }}
        >
          <img
            src={puzzle.imageUrl}
            alt="Puzzle Ghost"
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
          />
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateRows: `repeat(${grid}, 1fr)`,
              gridTemplateColumns: `repeat(${grid}, 1fr)`,
            }}
          >
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="border border-puzzle-aqua/30"
                style={{
                  width: boxSize,
                  height: boxSize,
                  background: "rgba(255,255,255,0.07)",
                }}
              />
            ))}
          </div>
          <span className="absolute left-1 top-1 text-xs rounded px-2 py-0.5 bg-black/60 text-puzzle-aqua z-10">Ghost Image</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor="edit-upload-img" className="flex items-center text-xs cursor-pointer px-2 py-1 rounded border border-puzzle-aqua/50 bg-puzzle-aqua/10 text-puzzle-aqua hover:bg-puzzle-aqua/20">
            <Image className="h-4 w-4 mr-1" />
            Change image
          </label>
          <input
            id="edit-upload-img"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
          />
        </div>
      </div>

      {/* Form Fields */}
      <form
        onSubmit={e => { e.preventDefault(); onSave(); }}
        className="flex flex-col gap-3"
        tabIndex={-1}
      >
        <div>
          <Label htmlFor="edit-name" className="block mb-1">Name</Label>
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
          <Label htmlFor="edit-prize" className="block mb-1">Prize Name</Label>
          <Input
            id="edit-prize"
            value={puzzle?.prize ?? ""}
            onChange={e => onChange("prize", e.target.value)}
            data-testid="edit-prize"
            className="mb-1"
          />
        </div>

        <div>
          <Label htmlFor="edit-prizevalue" className="block mb-1">Prize Value ($)</Label>
          <Input
            id="edit-prizevalue"
            type="number"
            min={0}
            step={0.01}
            value={puzzle?.prizeValue ?? ""}
            onChange={e => onChange("prizeValue", Number(e.target.value))}
            data-testid="edit-prizevalue"
            className="w-28 inline-block"
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
          <Label htmlFor="edit-difficulty" className="block mb-1">Difficulty</Label>
          <Select
            value={puzzle?.difficulty ?? ""}
            onValueChange={v => onChange("difficulty", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Difficulty..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">
                <Badge variant="outline" className="mr-2">Easy</Badge>
              </SelectItem>
              <SelectItem value="medium">
                <Badge variant="secondary" className="mr-2">Medium</Badge>
              </SelectItem>
              <SelectItem value="hard">
                <Badge variant="destructive" className="mr-2">Hard</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TIMER SWITCH */}
        <div className="flex items-center gap-3">
          <Label htmlFor="edit-enable-timer" className="mb-0">Enable Timer</Label>
          <Switch
            id="edit-enable-timer"
            checked={timerEnabled}
            onCheckedChange={handleToggleTimer}
          />
          <span className={`text-xs ml-2 ${timerEnabled ? "text-green-600" : "text-gray-400"}`}>
            {timerEnabled ? "On" : "Off"}
          </span>
        </div>

        {/* Timer (seconds) input, only active when timerEnabled */}
        {timerEnabled && (
          <div>
            <Label htmlFor="edit-timelimit" className="block mb-1">Timer (seconds)</Label>
            <Input
              id="edit-timelimit"
              type="number"
              min={0}
              value={puzzle?.timeLimit ?? ""}
              onChange={e => onChange("timeLimit", Number(e.target.value))}
              data-testid="edit-timelimit"
              className="w-28 inline-block"
            />
          </div>
        )}

        <div>
          <Label htmlFor="edit-costperplay" className="block mb-1">Cost per Play ($)</Label>
          <Input
            id="edit-costperplay"
            type="number"
            step={0.01}
            min={0}
            value={puzzle?.costPerPlay ?? ""}
            onChange={e => onChange("costPerPlay", Number(e.target.value))}
            data-testid="edit-costperplay"
            className="w-28 inline-block"
          />
        </div>

        <div>
          <Label htmlFor="edit-targetrev" className="block mb-1">Target Revenue ($)</Label>
          <Input
            id="edit-targetrev"
            type="number"
            step={1}
            min={0}
            value={puzzle?.targetRevenue ?? ""}
            onChange={e => onChange("targetRevenue", Number(e.target.value))}
            data-testid="edit-targetrev"
            className="w-32 inline-block"
          />
        </div>

        <div className="flex items-center gap-3">
          <Label htmlFor="edit-status" className="mb-0">Puzzle Status</Label>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() =>
              onChange(
                "status",
                puzzle.status === "active" ? "inactive" : "active"
              )
            }
            tabIndex={0}
            aria-pressed={puzzle.status === "active" ? "true" : "false"}
            aria-label={puzzle.status === "active" ? "Active" : "Inactive"}
          >
            {puzzle.status === "active"
              ? <ToggleRight className="h-6 w-6 text-green-500" />
              : <ToggleLeft className="h-6 w-6 text-gray-400" />
            }
          </Button>
          <span className={`text-xs ml-2 ${puzzle.status === "active" ? "text-green-600" : "text-gray-500"}`}>
            {puzzle.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

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
