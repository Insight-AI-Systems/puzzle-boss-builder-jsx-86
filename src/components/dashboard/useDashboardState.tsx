
import { useState, useEffect, useCallback } from 'react';
import { projectTracker } from '@/utils/ProjectTracker';
import { TestRunner } from '@/utils/testRunner';
import { ProjectTask, ProjectTest } from '@/utils/types/projectTypes';

export function useDashboardState() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [tests, setTests] = useState<ProjectTest[]>([]);
  const [activePhase, setActivePhase] = useState<string>("1");
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadData = useCallback(() => {
    try {
      // Load all tasks and tests from the project tracker
      const loadedTasks = projectTracker.getAllTasks();
      const loadedTests = projectTracker.getAllTests();
      
      setTasks(loadedTasks);
      setTests(loadedTests);
      
      // Find the active phase (lowest phase with incomplete tasks)
      const pendingPhases = Array.from(
        new Set(
          loadedTasks
            .filter(task => task.status !== 'completed')
            .map(task => task.phase)
        )
      ).sort();
      
      if (pendingPhases.length > 0) {
        setActivePhase(pendingPhases[0].toString());
      }
      
      console.log('Loaded tasks:', loadedTasks.length);
      console.log('Loaded tests:', loadedTests.length);
      console.log('Active phase set to:', pendingPhases[0] || activePhase);
      setError(null);
    } catch (e) {
      console.error('Error loading project data:', e);
      setError('Failed to load project data. Please refresh the page.');
    }
  }, [activePhase]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const runTaskTests = async (taskId: string) => {
    setIsTestRunning(true);
    console.log('Running tests for task:', taskId);
    try {
      await TestRunner.runAllTaskTests(taskId);
      
      // Refresh tasks after tests
      loadData();
    } catch (error) {
      console.error('Error running tests:', error);
      setError('Failed to run tests. Please try again.');
    } finally {
      setIsTestRunning(false);
    }
  };
  
  const updateTaskStatus = (taskId: string, status: ProjectTask['status']) => {
    try {
      console.log(`Updating task ${taskId} status to ${status}`);
      projectTracker.updateTaskStatus(taskId, status);
      loadData();
    } catch (e) {
      console.error('Error updating task status:', e);
      setError('Failed to update task status. Please try again.');
    }
  };
  
  const handlePhaseChange = (value: string) => {
    console.log('Changing active phase to:', value);
    setActivePhase(value);
  };
  
  const phases = Array.from(new Set(tasks.map(task => task.phase))).sort();
  
  return {
    tasks,
    tests,
    activePhase,
    isTestRunning,
    error,
    phases,
    loadData,
    runTaskTests,
    updateTaskStatus,
    handlePhaseChange
  };
}
