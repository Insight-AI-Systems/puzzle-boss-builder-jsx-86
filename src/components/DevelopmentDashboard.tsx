
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { projectTracker } from '@/utils/ProjectTracker';
import { TestRunner } from '@/utils/testRunner';
import { ProjectTask, ProjectTest } from '@/utils/types/projectTypes';

const DevelopmentDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [tests, setTests] = useState<ProjectTest[]>([]);
  const [activePhase, setActivePhase] = useState<number>(1);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  
  useEffect(() => {
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
      setActivePhase(pendingPhases[0]);
    }
    
    console.log('Loaded tasks:', loadedTasks.length);
    console.log('Loaded tests:', loadedTests.length);
  }, []);
  
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const runTaskTests = async (taskId: string) => {
    setIsTestRunning(true);
    console.log('Running tests for task:', taskId);
    try {
      await TestRunner.runAllTaskTests(taskId);
      
      // Refresh tasks after tests
      setTasks(projectTracker.getAllTasks());
      setTests(projectTracker.getAllTests());
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsTestRunning(false);
    }
  };
  
  const updateTaskStatus = (taskId: string, status: ProjectTask['status']) => {
    console.log(`Updating task ${taskId} status to ${status}`);
    projectTracker.updateTaskStatus(taskId, status);
    setTasks(projectTracker.getAllTasks());
  };
  
  const phases = Array.from(new Set(tasks.map(task => task.phase))).sort();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>The Puzzle Boss - Development Dashboard</CardTitle>
        <CardDescription>
          Track development progress and run tests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activePhase.toString()} onValueChange={(value) => setActivePhase(parseInt(value))}>
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
              
              <div className="space-y-3">
                {projectTracker.getTasksByPhase(phase).map(task => {
                  const taskTests = task.testIds?.map(testId => 
                    tests.find(test => test.id === testId)
                  ).filter(Boolean) || [];
                  
                  return (
                    <Card key={task.id} className="overflow-hidden">
                      <div className="flex justify-between items-start p-4">
                        <div>
                          <h4 className="font-medium">{task.name}</h4>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      
                      {taskTests.length > 0 && (
                        <>
                          <Separator />
                          <div className="p-4 bg-gray-50">
                            <h5 className="text-sm font-medium mb-2">Tests</h5>
                            <div className="space-y-2">
                              {taskTests.map(test => test && (
                                <div key={test.id} className="flex justify-between items-center">
                                  <span className="text-sm">{test.name}</span>
                                  {test.lastResult !== undefined && (
                                    <Badge className={test.lastResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                      {test.lastResult ? 'Passed' : 'Failed'}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      
                      <CardFooter className="flex justify-between bg-gray-50 border-t">
                        <div className="flex space-x-2">
                          {task.status !== 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, 'in-progress')}
                              disabled={task.status === 'in-progress'}
                            >
                              Start
                            </Button>
                          )}
                          
                          {task.status === 'in-progress' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                        
                        {taskTests.length > 0 && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => runTaskTests(task.id)}
                            disabled={isTestRunning}
                          >
                            Run Tests
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DevelopmentDashboard;
