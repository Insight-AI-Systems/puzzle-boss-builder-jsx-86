
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string | number;
    direction: 'up' | 'down';
  };
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trend,
  subtext
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <p className="text-3xl font-bold text-puzzle-aqua">{value}</p>
          {trend && (
            <span className={`ml-2 flex items-center text-sm ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend.direction === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {trend.value}
            </span>
          )}
        </div>
        {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  );
};
