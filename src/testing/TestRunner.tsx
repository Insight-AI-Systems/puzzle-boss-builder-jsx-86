
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle, XCircle, Clock, Zap, Users, Target } from 'lucide-react';

import { GameEngineTests, TestResult } from './unit/GameEngineTests';
import { ServiceLayerTests } from './integration/ServiceLayerTests';
import { UILayerTests } from './component/UILayerTests';
import { RepositoryTests } from './repository/RepositoryTests';
import { EndToEndTests } from './e2e/EndToEndTests';
import { PerformanceTests, PerformanceMetric } from './performance/PerformanceTests';

interface TestSuite {
  name: string;
  icon: React.ReactNode;
  runner: () => Promise<any>;
  results: TestResult[];
  metrics?: PerformanceMetric[];
  isRunning: boolean;
  completed: boolean;
}

export function TestRunner() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: 'Game Engines',
      icon: <Target className="h-4 w-4" />,
      runner: async () => {
        const gameEngineTests = new GameEngineTests();
        const crosswordResults = await gameEngineTests.runCrosswordEngineTests();
        const wordSearchResults = await gameEngineTests.runWordSearchEngineTests();
        return [...crosswordResults, ...wordSearchResults];
      },
      results: [],
      isRunning: false,
      completed: false
    },
    {
      name: 'Service Layer',
      icon: <Zap className="h-4 w-4" />,
      runner: async () => {
        const serviceTests = new ServiceLayerTests();
        const gameResults = await serviceTests.runGameServiceTests();
        const paymentResults = await serviceTests.runPaymentServiceTests();
        return [...gameResults, ...paymentResults];
      },
      results: [],
      isRunning: false,
      completed: false
    },
    {
      name: 'UI Components',
      icon: <CheckCircle className="h-4 w-4" />,
      runner: async () => {
        const uiTests = new UILayerTests();
        return await uiTests.runCrosswordComponentTests();
      },
      results: [],
      isRunning: false,
      completed: false
    },
    {
      name: 'Repository Layer',
      icon: <Users className="h-4 w-4" />,
      runner: async () => {
        const repoTests = new RepositoryTests();
        const gameResults = await repoTests.runGameRepositoryTests();
        const userResults = await repoTests.runUserRepositoryTests();
        return [...gameResults, ...userResults];
      },
      results: [],
      isRunning: false,
      completed: false
    },
    {
      name: 'End-to-End',
      icon: <Clock className="h-4 w-4" />,
      runner: async () => {
        const e2eTests = new EndToEndTests();
        return await e2eTests.runCompleteUserFlows();
      },
      results: [],
      isRunning: false,
      completed: false
    },
    {
      name: 'Performance',
      icon: <Zap className="h-4 w-4" />,
      runner: async () => {
        const perfTests = new PerformanceTests();
        return await perfTests.runGameEnginePerformanceTests();
      },
      results: [],
      metrics: [],
      isRunning: false,
      completed: false
    }
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const runSingleTest = async (index: number) => {
    const newSuites = [...testSuites];
    newSuites[index].isRunning = true;
    setTestSuites(newSuites);

    try {
      const result = await newSuites[index].runner();
      
      if (newSuites[index].name === 'Performance' && result.results && result.metrics) {
        newSuites[index].results = result.results;
        newSuites[index].metrics = result.metrics;
      } else {
        newSuites[index].results = result;
      }
      
      newSuites[index].completed = true;
    } catch (error) {
      console.error(`Test suite ${newSuites[index].name} failed:`, error);
      newSuites[index].results = [{
        testName: 'Suite Error',
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: 0
      }];
      newSuites[index].completed = true;
    } finally {
      newSuites[index].isRunning = false;
      setTestSuites([...newSuites]);
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    setOverallProgress(0);

    for (let i = 0; i < testSuites.length; i++) {
      await runSingleTest(i);
      setOverallProgress(((i + 1) / testSuites.length) * 100);
    }

    setIsRunningAll(false);
  };

  const resetAllTests = () => {
    setTestSuites(testSuites.map(suite => ({
      ...suite,
      results: [],
      metrics: [],
      isRunning: false,
      completed: false
    })));
    setOverallProgress(0);
  };

  const getTestSummary = (results: TestResult[]) => {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    const avgDuration = total > 0 ? results.reduce((sum, r) => sum + r.duration, 0) / total : 0;

    return { total, passed, failed, avgDuration };
  };

  const getStatusBadge = (suite: TestSuite) => {
    if (suite.isRunning) {
      return <Badge className="bg-blue-500/20 text-blue-400">Running</Badge>;
    }
    if (!suite.completed) {
      return <Badge className="bg-gray-500/20 text-gray-400">Pending</Badge>;
    }
    
    const summary = getTestSummary(suite.results);
    if (summary.failed === 0) {
      return <Badge className="bg-green-500/20 text-green-400">Passed</Badge>;
    }
    
    return <Badge className="bg-red-500/20 text-red-400">Failed</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Runner Dashboard</span>
            <div className="flex gap-2">
              <Button
                onClick={runAllTests}
                disabled={isRunningAll}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunningAll ? 'Running...' : 'Run All Tests'}
              </Button>
              <Button
                onClick={resetAllTests}
                variant="outline"
                disabled={isRunningAll}
              >
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isRunningAll && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={overallProgress} className="w-full" />
            </div>
          )}

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="overview">Test Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testSuites.map((suite, index) => {
                  const summary = getTestSummary(suite.results);
                  
                  return (
                    <Card key={suite.name} className="bg-gray-50 dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {suite.icon}
                            {suite.name}
                          </div>
                          {getStatusBadge(suite)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {suite.completed && (
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-green-100 dark:bg-green-900/20 rounded p-2">
                              <div className="text-lg font-bold text-green-600">
                                {summary.passed}
                              </div>
                              <div className="text-xs text-green-600">Passed</div>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/20 rounded p-2">
                              <div className="text-lg font-bold text-red-600">
                                {summary.failed}
                              </div>
                              <div className="text-xs text-red-600">Failed</div>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/20 rounded p-2">
                              <div className="text-lg font-bold text-blue-600">
                                {summary.avgDuration.toFixed(1)}ms
                              </div>
                              <div className="text-xs text-blue-600">Avg Time</div>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={() => runSingleTest(index)}
                          disabled={suite.isRunning || isRunningAll}
                          className="w-full"
                          variant="outline"
                        >
                          {suite.isRunning ? 'Running...' : 'Run Tests'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              {testSuites.map((suite) => (
                <Card key={suite.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {suite.icon}
                      {suite.name} Results
                      {getStatusBadge(suite)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {suite.results.length > 0 ? (
                      <div className="space-y-2">
                        {suite.results.map((result, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded p-3"
                          >
                            <div className="flex items-center gap-2">
                              {result.passed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-medium">{result.testName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {result.duration.toFixed(2)}ms
                              </span>
                              <Badge
                                className={
                                  result.passed
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }
                              >
                                {result.passed ? 'PASS' : 'FAIL'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        
                        {suite.metrics && suite.metrics.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Performance Metrics</h4>
                            <div className="space-y-2">
                              {suite.metrics.map((metric, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded p-3"
                                >
                                  <span className="font-medium">{metric.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                      {metric.value.toFixed(2)} {metric.unit}
                                    </span>
                                    <Badge
                                      className={
                                        metric.passed
                                          ? 'bg-green-500/20 text-green-400'
                                          : 'bg-yellow-500/20 text-yellow-400'
                                      }
                                    >
                                      {metric.passed ? 'GOOD' : 'SLOW'}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No test results yet. Click "Run Tests" to begin.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
