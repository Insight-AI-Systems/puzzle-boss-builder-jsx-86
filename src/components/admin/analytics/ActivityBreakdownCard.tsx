
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, CalendarDays, Calendar, BarChart2 } from "lucide-react";
import type { ActivityBreakdown } from '@/hooks/admin/useAnalytics';

interface ActivityBreakdownCardProps {
  data: ActivityBreakdown;
  className?: string;
}

export const ActivityBreakdownCard: React.FC<ActivityBreakdownCardProps> = ({
  data,
  className
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Active Users by Timeframe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Daily</p>
              <p className="text-xl font-bold">{Math.round(data.daily)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md">
              <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Weekly</p>
              <p className="text-xl font-bold">{Math.round(data.weekly)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-md">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monthly</p>
              <p className="text-xl font-bold">{Math.round(data.monthly)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-md">
              <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Yearly</p>
              <p className="text-xl font-bold">{Math.round(data.yearly)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
