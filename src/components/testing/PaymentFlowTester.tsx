
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Play
} from 'lucide-react';

interface PaymentTest {
  id: string;
  game: string;
  scenario: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  amount: number;
  duration: number;
  error?: string;
}

interface PaymentTestSuite {
  id: string;
  name: string;
  tests: PaymentTest[];
  status: 'idle' | 'running' | 'completed';
}

export function PaymentFlowTester() {
  const [testSuites, setTestSuites] = useState<PaymentTestSuite[]>([
    {
      id: 'normal-flow',
      name: 'Normal Payment Flow',
      status: 'idle',
      tests: [
        { id: 'jigsaw-success', game: 'Jigsaw', scenario: 'Successful Payment', status: 'pending', amount: 1.99, duration: 0 },
        { id: 'crossword-success', game: 'Crossword', scenario: 'Successful Payment', status: 'pending', amount: 2.99, duration: 0 },
        { id: 'tetris-success', game: 'Tetris', scenario: 'Successful Payment', status: 'pending', amount: 1.49, duration: 0 },
        { id: 'sudoku-success', game: 'Sudoku', scenario: 'Successful Payment', status: 'pending', amount: 2.49, duration: 0 },
        { id: 'word-search-success', game: 'Word Search', scenario: 'Successful Payment', status: 'pending', amount: 1.99, duration: 0 }
      ]
    },
    {
      id: 'error-handling',
      name: 'Error Handling',
      status: 'idle',
      tests: [
        { id: 'card-declined', game: 'Jigsaw', scenario: 'Card Declined', status: 'pending', amount: 1.99, duration: 0 },
        { id: 'insufficient-funds', game: 'Crossword', scenario: 'Insufficient Funds', status: 'pending', amount: 2.99, duration: 0 },
        { id: 'expired-card', game: 'Tetris', scenario: 'Expired Card', status: 'pending', amount: 1.49, duration: 0 },
        { id: 'network-timeout', game: 'Sudoku', scenario: 'Network Timeout', status: 'pending', amount: 2.49, duration: 0 },
        { id: 'invalid-cvv', game: 'Word Search', scenario: 'Invalid CVV', status: 'pending', amount: 1.99, duration: 0 }
      ]
    },
    {
      id: 'edge-cases',
      name: 'Edge Cases',
      status: 'idle',
      tests: [
        { id: 'rapid-payments', game: 'Jigsaw', scenario: 'Rapid Multiple Payments', status: 'pending', amount: 1.99, duration: 0 },
        { id: 'concurrent-sessions', game: 'Crossword', scenario: 'Concurrent Payment Sessions', status: 'pending', amount: 2.99, duration: 0 },
        { id: 'partial-completion', game: 'Tetris', scenario: 'Partial Form Completion', status: 'pending', amount: 1.49, duration: 0 },
        { id: 'browser-refresh', game: 'Sudoku', scenario: 'Browser Refresh During Payment', status: 'pending', amount: 2.49, duration: 0 },
        { id: 'mobile-payment', game: 'Word Search', scenario: 'Mobile Payment Flow', status: 'pending', amount: 1.99, duration: 0 }
      ]
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const simulatePaymentTest = async (test: PaymentTest): Promise<PaymentTest> => {
    const startTime = Date.now();
    
    // Simulate different test scenarios
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
    
    const duration = Date.now() - startTime;
    let status: 'passed' | 'failed' = 'passed';
    let error: string | undefined;

    // Simulate different failure scenarios
    if (test.scenario.includes('Declined') || test.scenario.includes('Insufficient') || test.scenario.includes('Expired')) {
      // These should "pass" because we expect them to fail gracefully
      status = 'passed';
    } else if (test.scenario.includes('Timeout') || test.scenario.includes('CVV')) {
      // Simulate some failures in error handling
      status = Math.random() > 0.8 ? 'failed' : 'passed';
      if (status === 'failed') {
        error = 'Error handling did not work as expected';
      }
    } else if (test.scenario.includes('Rapid') || test.scenario.includes('Concurrent')) {
      // Edge cases might fail more often
      status = Math.random() > 0.7 ? 'failed' : 'passed';
      if (status === 'failed') {
        error = 'Concurrent access caused payment conflicts';
      }
    } else {
      // Normal successful payments
      status = Math.random() > 0.05 ? 'passed' : 'failed';
      if (status === 'failed') {
        error = 'Unexpected payment processing error';
      }
    }

    return {
      ...test,
      status,
      duration,
      error
    };
  };

  const runTestSuite = async (suiteId: string) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? { ...suite, status: 'running' }
        : suite
    ));

    const suite = testSuites.find(s => s.id === suiteId);
    if (!suite) return;

    for (const test of suite.tests) {
      // Update test status to running
      setTestSuites(prev => prev.map(s => 
        s.id === suiteId 
          ? {
              ...s,
              tests: s.tests.map(t => 
                t.id === test.id ? { ...t, status: 'running' } : t
              )
            }
          : s
      ));

      // Run the test
      const result = await simulatePaymentTest(test);
      
      // Update test with result
      setTestSuites(prev => prev.map(s => 
        s.id === suiteId 
          ? {
              ...s,
              tests: s.tests.map(t => 
                t.id === test.id ? result : t
              )
            }
          : s
      ));
    }

    // Mark suite as completed
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? { ...suite, status: 'completed' }
        : suite
    ));
  };

  const runAllPaymentTests = async () => {
    setIsRunning(true);
    
    for (const suite of testSuites) {
      await runTestSuite(suite.id);
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getOverallStats = () => {
    const allTests = testSuites.flatMap(suite => suite.tests);
    const passed = allTests.filter(test => test.status === 'passed').length;
    const failed = allTests.filter(test => test.status === 'failed').length;
    const total = allTests.length;
    const totalRevenue = allTests
      .filter(test => test.status === 'passed' && !test.scenario.includes('Declined') && !test.scenario.includes('Insufficient'))
      .reduce((sum, test) => sum + test.amount, 0);
    
    return { passed, failed, total, totalRevenue };
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tests Passed</p>
                <p className="text-2xl font-bold text-green-400">{stats.passed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tests Failed</p>
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-puzzle-aqua">
                  {stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0'}%
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-puzzle-aqua" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Test Revenue</p>
                <p className="text-2xl font-bold text-puzzle-gold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-puzzle-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-puzzle-white">Payment Flow Test Suites</h3>
        <Button
          onClick={runAllPaymentTests}
          disabled={isRunning}
          className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run All Payment Tests
            </>
          )}
        </Button>
      </div>

      {/* Test Suites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {testSuites.map((suite) => (
          <Card key={suite.id} className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-puzzle-white">{suite.name}</CardTitle>
                <Badge 
                  variant={suite.status === 'completed' ? 'default' : 'outline'}
                  className={
                    suite.status === 'running' 
                      ? 'text-blue-400 border-blue-400' 
                      : suite.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 border-gray-400'
                  }
                >
                  {suite.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {suite.tests.map((test) => (
                <div key={test.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="text-sm font-medium text-gray-300">{test.game}</span>
                    </div>
                    <span className="text-xs text-gray-500">${test.amount}</span>
                  </div>
                  <div className="text-xs text-gray-400 ml-6">{test.scenario}</div>
                  {test.error && (
                    <Alert className="ml-6 p-2 border-red-600 bg-red-950/50">
                      <AlertTriangle className="h-3 w-3" />
                      <AlertDescription className="text-xs">{test.error}</AlertDescription>
                    </Alert>
                  )}
                  {test.duration > 0 && (
                    <div className="text-xs text-gray-500 ml-6">
                      Completed in {test.duration}ms
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => runTestSuite(suite.id)}
                disabled={suite.status === 'running' || isRunning}
                className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                {suite.status === 'running' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Suite
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
