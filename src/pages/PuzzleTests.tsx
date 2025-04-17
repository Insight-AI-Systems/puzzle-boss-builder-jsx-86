
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info, AlertCircle, ExternalLink, FileDown } from 'lucide-react';
import PageLayout from '@/components/layouts/PageLayout';
import Breadcrumb from '@/components/common/Breadcrumb';
import { PuzzleTestRunner } from '@/utils/testing/puzzleTestRunner';
import PuzzleTestRunner as PuzzleTestRunnerComponent from '@/components/testing/PuzzleTestRunner';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

const PuzzleTests: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<any>(null);
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Development', path: '/dev' },
    { label: 'Puzzle Tests', active: true }
  ];
  
  useEffect(() => {
    // Get browser info on mount
    const info = PuzzleTestRunner.getBrowserInfo();
    setBrowserInfo(info);
  }, []);
  
  const runBasicTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await PuzzleTestRunner.runTests();
      setResults(testResults);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  const downloadTestPlan = () => {
    fetch('/src/components/puzzles/testing/PuzzleTestPlan.md')
      .then(response => response.text())
      .then(text => {
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PuzzleTestPlan.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading test plan:', error);
      });
  };
  
  const downloadTestSheet = () => {
    fetch('/src/components/puzzles/testing/ManualTestSheet.md')
      .then(response => response.text())
      .then(text => {
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ManualTestSheet.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading test sheet:', error);
      });
  };
  
  return (
    <PageLayout
      title="Puzzle Game Tests"
      subtitle="Run tests and verify puzzle game functionality"
    >
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 gap-8 my-8">
        <Card>
          <CardHeader>
            <CardTitle>Testing Documentation</CardTitle>
            <CardDescription>
              Download test plans and manual test sheets for the puzzle game implementation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Test Documentation</AlertTitle>
              <AlertDescription>
                These documents provide comprehensive testing procedures for the puzzle game component.
                Use them to ensure all features work as expected across different browsers and devices.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Test Plan</CardTitle>
                  <CardDescription>
                    Comprehensive test plan for the puzzle game
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Button variant="outline" className="w-full" onClick={downloadTestPlan}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Test Plan
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Manual Test Sheet</CardTitle>
                  <CardDescription>
                    Checklist for manual testing of puzzle features
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Button variant="outline" className="w-full" onClick={downloadTestSheet}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Test Sheet
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Tests</CardTitle>
            <CardDescription>
              Run basic functionality tests for the puzzle game
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Browser Information</h3>
                {browserInfo && (
                  <p className="text-sm text-gray-500">
                    {browserInfo.name} {browserInfo.version} on {browserInfo.os} 
                    ({browserInfo.mobile ? 'Mobile' : 'Desktop'})
                  </p>
                )}
              </div>
              <Button 
                onClick={runBasicTests} 
                disabled={isRunning}
              >
                {isRunning ? 'Running Tests...' : 'Run Basic Tests'}
              </Button>
            </div>
            
            {results.length > 0 && (
              <div className="space-y-2 mt-4">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <h4 className="font-medium">{result.name}</h4>
                    </div>
                    {result.message && (
                      <p className={`text-sm mt-1 ${result.passed ? 'text-gray-500' : 'text-red-500'}`}>
                        {result.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" asChild>
                <a href="/puzzledemo" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Puzzle Demo
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <PuzzleTestRunnerComponent />
      </div>
    </PageLayout>
  );
};

export default PuzzleTests;
