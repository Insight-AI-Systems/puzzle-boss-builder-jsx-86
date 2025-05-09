
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDashboardState } from './dashboard/useDashboardState';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { ErrorDisplay } from './dashboard/ErrorDisplay';
import { PhaseTabs } from './dashboard/PhaseTabs';

const DevelopmentDashboard: React.FC = () => {
  const {
    tests,
    activePhase,
    isTestRunning,
    error,
    phases,
    runTaskTests,
    updateTaskStatus,
    handlePhaseChange
  } = useDashboardState();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <DashboardHeader />
      </CardHeader>
      <CardContent>
        <ErrorDisplay error={error} />
        
        <PhaseTabs
          phases={phases}
          activePhase={activePhase}
          onPhaseChange={handlePhaseChange}
          tasks={[]} // Not needed since we use projectTracker directly in PhaseTabs
          tests={tests}
          isTestRunning={isTestRunning}
          onRunTests={runTaskTests}
          onUpdateStatus={updateTaskStatus}
        />
      </CardContent>
    </Card>
  );
};

export default DevelopmentDashboard;
