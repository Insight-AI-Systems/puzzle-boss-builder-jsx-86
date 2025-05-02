
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFinance } from '@/contexts/FinanceContext';

export function FinancePeriodSelector() {
  const { 
    currentPeriod, 
    availablePeriods, 
    setPeriod 
  } = useFinance();

  const handlePeriodChange = (value: string) => {
    const period = availablePeriods.find(p => p.label === value);
    if (period) {
      setPeriod(period);
    }
  };

  return (
    <Select
      value={currentPeriod.label}
      onValueChange={handlePeriodChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        {availablePeriods.map((period) => (
          <SelectItem key={period.label} value={period.label}>
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
