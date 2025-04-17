
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTask, ProjectTest } from '@/utils/types/projectTypes';
import { PhaseContent } from './PhaseContent';
import { projectTracker } from '@/utils/ProjectTracker';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const handlePhaseChange = (phase: string) => {
    console.log('Phase changed to:', phase);
    onPhaseChange(phase);
    toast({
      title: `Switched to Phase ${phase}`,
      description: `Now viewing tasks for Phase ${phase}`,
    });
  };

  return (
    <Tabs value={activePhase} onValueChange={handlePhaseChange}>
      <TabsList className="mb-4">
        {phases.map(phase => (
          <TabsTrigger 
            key={phase} 
            value={phase.toString()}
            data-state={activePhase === phase.toString() ? 'active' : 'inactive'}
            className="data-[state=active]:bg-puzzle-aqua/10 data-[state=active]:text-puzzle-aqua"
          >
            Phase {phase}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {phases.map(phase => (
        <TabsContent 
          key={phase} 
          value={phase.toString()}
        >
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
