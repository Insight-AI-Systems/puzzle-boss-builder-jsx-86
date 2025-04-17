
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTask, ProjectTest } from '@/utils/types/projectTypes';
import { PhaseContent } from './PhaseContent';
import { projectTracker } from '@/utils/ProjectTracker';

interface PhaseTabsProps {
  phases: number[];
  activePhase: string;
  onPhaseChange: (value: string) => void;
  tasks: ProjectTask[];
  tests: ProjectTest[];
  isTestRunning: boolean;
  onRunTests: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
}

export const PhaseTabs: React.FC<PhaseTabsProps> = ({
  phases,
  activePhase,
  onPhaseChange,
  tasks,
  tests,
  isTestRunning,
  onRunTests,
  onUpdateStatus
}) => {
  return (
    <Tabs value={activePhase} onValueChange={onPhaseChange}>
      <TabsList className="mb-4">
        {phases.map(phase => (
          <TabsTrigger key={phase} value={phase.toString()}>
            Phase {phase}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {phases.map(phase => (
        <TabsContent key={phase} value={phase.toString()}>
          <h3 className="text-lg font-semibold mb-2">
            Phase {phase} Tasks
          </h3>
          
          <PhaseContent 
            phaseTasks={projectTracker.getTasksByPhase(phase)}
            tests={tests}
            isTestRunning={isTestRunning}
            onRunTests={onRunTests}
            onUpdateStatus={onUpdateStatus}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
