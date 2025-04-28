
import React from 'react';
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CalendarDays, 
  Calendar, 
  BarChart2 
} from "lucide-react";

interface DateRangeSelectorProps {
  dateRange: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
  className?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateChange,
  className
}) => {
  const handleTodayClick = () => {
    const today = new Date();
    onDateChange({ from: today, to: today });
  };

  const handleWeekClick = () => {
    const today = new Date();
    const startWeek = new Date(today);
    startWeek.setDate(today.getDate() - today.getDay());
    
    const endWeek = new Date(today);
    endWeek.setDate(startWeek.getDate() + 6);
    
    onDateChange({ from: startWeek, to: endWeek });
  };

  const handleMonthClick = () => {
    const today = new Date();
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    onDateChange({ from: startMonth, to: endMonth });
  };

  const handleYearClick = () => {
    const today = new Date();
    const startYear = new Date(today.getFullYear(), 0, 1);
    const endYear = new Date(today.getFullYear(), 11, 31);
    
    onDateChange({ from: startYear, to: endYear });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Date Range Filter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTodayClick}
            className="flex flex-col items-center p-2 h-auto"
          >
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs">Today</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleWeekClick}
            className="flex flex-col items-center p-2 h-auto"
          >
            <CalendarDays className="h-4 w-4 mb-1" />
            <span className="text-xs">This Week</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMonthClick}
            className="flex flex-col items-center p-2 h-auto"
          >
            <Calendar className="h-4 w-4 mb-1" />
            <span className="text-xs">This Month</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleYearClick}
            className="flex flex-col items-center p-2 h-auto"
          >
            <BarChart2 className="h-4 w-4 mb-1" />
            <span className="text-xs">This Year</span>
          </Button>
        </div>
        
        <CalendarDateRangePicker
          date={dateRange}
          onDateChange={onDateChange}
        />
      </CardContent>
    </Card>
  );
};
