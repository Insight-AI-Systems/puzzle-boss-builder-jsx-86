
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PuzzlePricingFieldsProps {
  puzzle: any;
  onChange: (field: string, value: any) => void;
}

export const PuzzlePricingFields: React.FC<PuzzlePricingFieldsProps> = ({
  puzzle,
  onChange,
}) => {
  const [hasManualTargetRevenueEdit, setHasManualTargetRevenueEdit] = useState(false);
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (
      puzzle?.prizeValue === "" || 
      puzzle?.prizeValue === undefined || 
      Number(puzzle?.prizeValue) === 0
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
  }, [puzzle?.prizeValue]);

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
    <div className="flex flex-col md:flex-row gap-3">
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
      <div className="flex-1">
        <Label htmlFor="edit-targetrev" className="block mb-1">Target Revenue ($)</Label>
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
  );
};
