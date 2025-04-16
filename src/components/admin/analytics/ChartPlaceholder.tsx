
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";

interface ChartPlaceholderProps {
  title: string;
  description?: string;
  type: 'bar' | 'line' | 'pie';
  height?: string;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ 
  title, 
  description, 
  type,
  height = "h-80"
}) => {
  const IconComponent = {
    bar: BarChart,
    line: LineChart,
    pie: PieChart
  }[type];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={`${height} flex items-center justify-center`}>
        <div className="text-center text-muted-foreground">
          <IconComponent className="h-10 w-10 mx-auto mb-2 opacity-25" />
          <p>Chart data will be populated here</p>
        </div>
      </CardContent>
    </Card>
  );
};
