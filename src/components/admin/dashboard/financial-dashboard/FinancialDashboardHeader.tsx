
import React from 'react';
import { format } from 'date-fns';
import { Download, Loader2 } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FinancialDashboardHeaderProps {
  selectedMonth: string;
  onMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onExport: () => void;
  isExporting?: boolean;
}

export const FinancialDashboardHeader: React.FC<FinancialDashboardHeaderProps> = ({
  selectedMonth,
  onMonthChange,
  onExport,
  isExporting = false
}) => {
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthStr = format(date, 'yyyy-MM');
    months.push({ value: monthStr, label: format(date, 'MMMM yyyy') });
  }

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Financial Dashboard</CardTitle>
        <CardDescription>Revenue tracking and financial reports</CardDescription>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={selectedMonth}
          onChange={onMonthChange}
          className="border border-gray-300 rounded px-3 py-2 bg-background"
          aria-label="Select month"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport} 
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Export
            </>
          )}
        </Button>
      </div>
    </CardHeader>
  );
};
