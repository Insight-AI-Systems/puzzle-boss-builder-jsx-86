
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { runBrowserCompatibilityTests } from '@/utils/testing/BrowserCompatibilityTests';
import { Card } from '@/components/ui/card';

interface PuzzleTestRunnerProps {
  testType: 'unit' | 'integration' | 'performance';
}

const PuzzleTestRunner: React.FC<PuzzleTestRunnerProps> = ({ testType }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      // Different test types execute different test runners
      let testResults;
      
      if (testType === 'unit') {
        // Run unit tests
        console.log('Running unit tests...');
        // Mock unit test results for now
        testResults = { success: true, passedTests: 8, totalTests: 10 };
      } else if (testType === 'integration') {
        // Run integration tests
        console.log('Running integration tests...');
        // Mock integration test results for now
        testResults = { success: true, passedTests: 4, totalTests: 5 };
      } else if (testType === 'performance') {
        // Run performance/compatibility tests
        console.log('Running browser compatibility tests...');
        testResults = await runBrowserCompatibilityTests();
      }
      
      setResults(testResults);
    } catch (error) {
      console.error('Error running tests:', error);
      setResults({ error: true, message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Test Runner: {testType}</h2>
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Tests'}
        </Button>
      </div>

      {results && !results.error && (
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {results.success ? '✓ Tests Passed' : '✗ Tests Failed'}
            </div>
            <div className="text-sm text-gray-600">
              {results.passedTests} / {results.totalTests} tests passed
            </div>
          </div>
        </Card>
      )}

      {results && results.error && (
        <Card className="p-4 border-red-300 bg-red-50">
          <div className="text-center text-red-600">
            <div className="text-lg font-medium mb-2">Error Running Tests</div>
            <div className="text-sm">{results.message}</div>
          </div>
        </Card>
      )}

      {!results && !isRunning && (
        <div className="text-center text-gray-500 py-8">
          Click "Run Tests" to start testing
        </div>
      )}

      {isRunning && (
        <div className="text-center text-gray-500 py-8 animate-pulse">
          Running tests...
        </div>
      )}
    </div>
  );
};

export default PuzzleTestRunner;
