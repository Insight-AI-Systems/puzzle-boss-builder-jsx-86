
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Users, DollarSign, Play } from "lucide-react";

interface AnalyticsTabsProps {
  defaultValue?: string;
}

export const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({ defaultValue = "overview" }) => {
  return (
    <TabsList>
      <TabsTrigger value="overview">
        <BarChart2 className="h-4 w-4 mr-2" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="users">
        <Users className="h-4 w-4 mr-2" />
        Users
      </TabsTrigger>
      <TabsTrigger value="revenue">
        <DollarSign className="h-4 w-4 mr-2" />
        Revenue
      </TabsTrigger>
      <TabsTrigger value="puzzles">
        <Play className="h-4 w-4 mr-2" />
        Puzzles
      </TabsTrigger>
    </TabsList>
  );
};
