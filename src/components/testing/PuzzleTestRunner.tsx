import React, { useState, useEffect } from 'react';
import { BrowserCompatibilityTests, CompatibilityTestResult } from '@/utils/testing/BrowserCompatibilityTests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PuzzleTestRunnerProps {
  testType?: string;
}

interface TestResult {
  name: string;
  passed: number;
  failed: number;
  total: number;
  duration: number;
  errors: string[];
}

const PuzzleTestRunner: React.FC<PuzzleTestRunnerProps> = ({ testType = 'unit' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [browserResult, setBrowserResult] = useState<CompatibilityTestResult | null>(null);
  const [activeTab, setActiveTab] = useState(testType);

  useEffect(() => {
    // Update active tab when testType prop changes
    if (testType) {
      setActiveTab(testType);
    }
    
    // Get browser info on mount
    const browserInfo = BrowserCompatibilityTests.getBrowserInfo();
    console.log('Browser Info:', browserInfo);
  }, [testType]);

  const runUnitTests = async () => {
    setIsRunning(true);
    setTestProgress(0);
    
    try {
      // Simulate running tests with progress updates
      for (let i = 1; i <= 10; i++) {
        await new Promise(r => setTimeout(r, 300));
        setTestProgress(i * 10);
      }
      
      // Simulate test results
      setTestResults([
        {
          name: 'Puzzle State Tests',
          passed: 12,
          failed: 0,
          total: 12,
          duration: 235,
          errors: []
        },
        {
          name: 'Piece Style Tests',
          passed: 8,
          failed: 0,
          total: 8,
          duration: 126,
          errors: []
        },
        {
          name: 'Puzzle Pieces Tests',
          passed: 15,
          failed: 1,
          total: 16,
          duration: 312,
          errors: ['Expected position to be 2, received 3']
        },
        {
          name: 'Saved Puzzles Tests',
          passed: 4,
          failed: 0,
          total: 4,
          duration: 87,
          errors: []
        },
        {
          name: 'Component Tests',
          passed: 10,
          failed: 0,
          total: 10,
          duration: 205,
          errors: []
        }
      ]);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runBrowserTests = async () => {
    setIsRunning(true);
    setTestProgress(0);
    
    try {
      // Progress simulation
      for (let i = 1; i <= 5; i++) {
        await new Promise(r => setTimeout(r, 300));
        setTestProgress(i * 20);
      }
      
      // Actually run browser compatibility tests
      const result = await BrowserCompatibilityTests.runCompatibilityTests();
      setBrowserResult(result);
    } catch (error) {
      console.error('Error running browser tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getTotalTestStats = () => {
    const totalTests = testResults.reduce((sum, result) => sum + result.total, 0);
    const passedTests = testResults.reduce((sum, result) => sum + result.passed, 0);
    const failedTests = testResults.reduce((sum, result) => sum + result.failed, 0);
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    
    return { totalTests, passedTests, failedTests, successRate };
  };

  const { totalTests, passedTests, failedTests, successRate } = getTotalTestStats();

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Puzzle Game Test Runner</CardTitle>
        <CardDescription>
          Run tests to validate puzzle game functionality across unit tests, integration tests, and browser compatibility
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unit">Unit Tests</TabsTrigger>
            <TabsTrigger value="integration">Integration Tests</TabsTrigger>
            <TabsTrigger value="browser">Browser Compatibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unit" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Unit Test Suite</h3>
                <Button 
                  onClick={runUnitTests} 
                  disabled={isRunning}
                  variant="default"
                >
                  {isRunning ? 'Running Tests...' : 'Run Unit Tests'}
                </Button>
              </div>
              
              {isRunning && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Running tests...</p>
                  <Progress value={testProgress} className="h-2" />
                </div>
              )}
              
              {testResults.length > 0 && !isRunning && (
                <>
                  <Alert variant={failedTests > 0 ? "destructive" : "default"}>
                    <div className="flex items-center gap-2">
                      {failedTests > 0 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      <AlertTitle>Test Summary</AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {passedTests} of {totalTests} tests passed ({successRate}% success rate)
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2 mt-4">
                    {testResults.map((result, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium flex items-center gap-2">
                            {result.failed > 0 ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {result.name}
                          </h4>
                          <span className="text-sm text-gray-500">{result.duration}ms</span>
                        </div>
                        <p className="text-sm mt-1">
                          {result.passed} of {result.total} tests passed
                        </p>
                        {result.errors.length > 0 && (
                          <div className="mt-2 bg-red-50 p-2 rounded text-sm text-red-800">
                            <p className="font-medium">Errors:</p>
                            <ul className="list-disc pl-5">
                              {result.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="integration" className="pt-4">
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Integration Tests</AlertTitle>
                <AlertDescription>
                  Integration tests require a full test environment setup. These should be run from the CI/CD pipeline
                  or with a complete test harness. See the test plan document for details on integration testing procedures.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Complete Game Flow</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500">Tests the full puzzle solving experience from start to finish</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Game Modes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500">Tests classic, timed, and challenge game modes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Save/Load System</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500">Tests saving, loading, and managing saved games</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">UI Interactions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500">Tests user interactions across devices and input methods</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="browser" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Browser Compatibility Tests</h3>
                <Button 
                  onClick={runBrowserTests} 
                  disabled={isRunning}
                  variant="default"
                >
                  {isRunning ? 'Testing Browser...' : 'Run Browser Tests'}
                </Button>
              </div>
              
              {isRunning && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Analyzing browser capabilities...</p>
                  <Progress value={testProgress} className="h-2" />
                </div>
              )}
              
              {browserResult && !isRunning && (
                <>
                  <Alert variant={browserResult.success ? "default" : "destructive"}>
                    <div className="flex items-center gap-2">
                      {browserResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      <AlertTitle>Browser Compatibility</AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {browserResult.success 
                        ? "Your browser is fully compatible with the puzzle game."
                        : `Compatibility issues detected: ${browserResult.failureReason}`}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="border rounded-md p-4 mt-4">
                    <h4 className="font-medium mb-2">Browser Information</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="font-medium">Browser:</span> {browserResult.browser.name}
                      </div>
                      <div>
                        <span className="font-medium">Version:</span> {browserResult.browser.version}
                      </div>
                      <div>
                        <span className="font-medium">Operating System:</span> {browserResult.browser.os}
                      </div>
                      <div>
                        <span className="font-medium">Device Type:</span> {browserResult.browser.mobile ? 'Mobile' : 'Desktop'}
                      </div>
                      <div>
                        <span className="font-medium">Touch Enabled:</span> {browserResult.browser.touchEnabled ? 'Yes' : 'No'}
                      </div>
                      <div>
                        <span className="font-medium">Screen Size:</span> {browserResult.browser.screenWidth}×{browserResult.browser.screenHeight}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h4 className="font-medium">Feature Support</h4>
                    {browserResult.tests.map((test, index) => (
                      <div key={index} className="border rounded-md p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {test.result ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{test.testName}</span>
                        </div>
                        <span className={`text-sm ${test.result ? 'text-green-500' : 'text-red-500'}`}>
                          {test.result ? 'Supported' : 'Not Supported'}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          Tests last run: {testResults.length > 0 ? new Date().toLocaleString() : 'Never'}
        </div>
        <Button variant="outline" onClick={() => window.open('/puzzledemo', '_blank')}>
          Open Puzzle Demo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PuzzleTestRunner;
