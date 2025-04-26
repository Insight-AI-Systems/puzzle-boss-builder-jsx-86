
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PuzzleTimerSettingsProps {
  puzzle: any;
  onChange: (field: string, value: any) => void;
}

export const PuzzleTimerSettings: React.FC<PuzzleTimerSettingsProps> = ({
  puzzle,
  onChange,
}) => {
  const [timerEnabled, setTimerEnabled] = useState(Boolean(puzzle?.timeLimit && puzzle.timeLimit > 0));

  useEffect(() => {
    setTimerEnabled(Boolean(puzzle?.timeLimit && puzzle.timeLimit > 0));
  }, [puzzle?.timeLimit]);

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

  return (
    <>
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
    </>
  );
};
