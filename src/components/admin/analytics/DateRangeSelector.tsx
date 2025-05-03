
import React from "react";
import { DateRange } from '@/hooks/admin/useAnalytics';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Date Range</CardTitle>
      </CardHeader>
      <CardContent>
        <DateRangePicker
          value={{
            from: dateRange.from,
            to: dateRange.to
          }}
          onChange={onDateChange}
        />
      </CardContent>
    </Card>
  );
};
