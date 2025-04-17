
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";

export const DashboardHeader: React.FC = () => {
  return (
    <>
      <CardTitle>The Puzzle Boss - Development Dashboard</CardTitle>
      <CardDescription>
        Track development progress and run tests
      </CardDescription>
    </>
  );
};
