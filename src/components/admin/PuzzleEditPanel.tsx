// Minor foundational code quality refactor for readability and dead code comments.
// No changes to logic, API, UI, or behavior per Maslow protocol.

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleLeft, ToggleRight, Image, Save, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface PuzzleEditPanelProps {
  puzzle: any;
  categories: any[];
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentUser?: { display_name?: string; email?: string };
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
  // ghost image grid
  const grid = { easy: 3, medium: 4, hard: 5 }[puzzle?.difficulty] || 4;
  const boxSize = 56;
  const total = grid * grid;

  // timer toggle logic
  const [timerEnabled, setTimerEnabled] = useState(Boolean(puzzle?.timeLimit && puzzle.timeLimit > 0));

  // Track if targetRevenue was manually changed by the admin
  const [hasManualTargetRevenueEdit, setHasManualTargetRevenueEdit] = useState(false);

  // To prevent onChange("prizeValue") from re-running logic on mount
  const isFirstRender = useRef(true);

  // Set default puzzle owner when creating a new puzzle
  useEffect(() => {
    if (
      (!puzzle?.puzzleOwner || puzzle.puzzleOwner === "") && 
      currentUser && 
      !puzzle.id // Only set default for new puzzles
    ) {
      const ownerName = currentUser.display_name || currentUser.email || "Admin";
      onChange("puzzleOwner", ownerName);
    }
  }, [puzzle?.id, puzzle?.puzzleOwner, currentUser, onChange]);

  useEffect(() => {
    setTimerEnabled(Boolean(puzzle?.timeLimit && puzzle.timeLimit > 0));
  }, [puzzle?.timeLimit]);

  // Prize Value → Target Revenue sync unless manually overridden
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (
      puzzle?.prizeValue === "" || puzzle?.prizeValue === undefined || Number(puzzle?.prizeValue) === 0
    ) {
      setHasManualTargetRevenueEdit(false);
      onChange("targetRevenue", "");
      return;
    }
    if (!hasManualTargetRevenueEdit) {
      const valueNum = Number(puzzle.prizeValue);
      if (!isNaN(valueNum)) {
        onChange("targetRevenue", Math.round(valueNum * 2 * 100) / 100);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle?.prizeValue]);

  useEffect(() => {
    setHasManualTargetRevenueEdit(false);
  }, [puzzle?.id]);

  const handleToggleTimer = (checked: boolean) => {
    setTimerEnabled(checked);
    if (!checked) {
      onChange("timeLimit", 0);
    } else {
      if (!puzzle.timeLimit || puzzle.timeLimit === 0) {
        onChange("timeLimit", 300);
      }
    }
  };

  const onPrizeValueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = value === "" ? "" : Number(value);
    onChange("prizeValue", num);
  };

  const onTargetRevenueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange("targetRevenue", newValue === "" ? "" : Number(newValue));
    if (
      puzzle.prizeValue !== "" &&
      puzzle.prizeValue !== undefined &&
      Number(newValue) !== Math.round(Number(puzzle.prizeValue) * 2 * 100) / 100
    ) {
      setHasManualTargetRevenueEdit(true);
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
        {/* Puzzle Name */}
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

        {/* Puzzle Owner */}
        <div>
          <Label htmlFor="edit-puzzleowner" className="block mb-1">Puzzle Owner</Label>
          <Input
            id="edit-puzzleowner"
            value={puzzle?.puzzleOwner ?? ""}
            onChange={e => onChange("puzzleOwner", e.target.value)}
            data-testid="edit-puzzleowner"
            className="mb-1"
            placeholder={currentUser ? (currentUser.display_name || currentUser.email || "Administrator") : "Administrator who set it up"}
          />
        </div>

        {/* Cost-related fields in one row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Prize Value */}
          <div className="flex-1">
            <Label htmlFor="edit-prizevalue" className="block mb-1">Prize Value ($)</Label>
            <Input
              id="edit-prizevalue"
              type="number"
              min={0}
              step={0.01}
              value={puzzle?.prizeValue ?? ""}
              onChange={onPrizeValueInput}
              data-testid="edit-prizevalue"
              className="w-full"
            />
          </div>
          {/* Cost Per Play */}
          <div className="flex-1">
            <Label htmlFor="edit-costperplay" className="block mb-1">Cost per Play ($)</Label>
            <Input
              id="edit-costperplay"
              type="number"
              step={0.01}
              min={0}
              value={puzzle?.costPerPlay ?? ""}
              onChange={e => onChange("costPerPlay", Number(e.target.value))}
              data-testid="edit-costperplay"
              className="w-full"
            />
          </div>
          {/* Target Revenue */}
          <div className="flex-1">
            <Label htmlFor="edit-targetrev" className="block mb-1">
              Target Revenue ($)
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (defaults to 2x Prize Value)
              </span>
            </Label>
            <Input
              id="edit-targetrev"
              type="number"
              step={1}
              min={0}
              value={puzzle?.targetRevenue ?? ""}
              onChange={onTargetRevenueInput}
              data-testid="edit-targetrev"
              className="w-full"
            />
          </div>
        </div>

        {/* Category select */}
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

        {/* Supplier */}
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

        {/* Difficulty select */}
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
