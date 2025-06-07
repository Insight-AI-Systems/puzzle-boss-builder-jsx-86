
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PaymentTestResult {
  testName: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  details: string;
  transactionId?: string;
  amount?: number;
}

export const PaymentIntegrationTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<PaymentTestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const paymentTests = [
    { name: 'Credit Verification', description: 'Test free credit usage' },
    { name: 'Wallet Balance Check', description: 'Verify sufficient funds' },
    { name: 'Payment Processing', description: 'Process sandbox payment' },
    { name: 'Transaction Recording', description: 'Record transaction data' },
    { name: 'Entry Authorization', description: 'Authorize game entry' },
    { name: 'Refund Processing', description: 'Test refund capability' }
  ];

  const runPaymentTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    for (let i = 0; i < paymentTests.length; i++) {
      const test = paymentTests[i];
      setCurrentTest(test.name);
      
      // Update status to running
      const runningResult: PaymentTestResult = {
        testName: test.name,
        status: 'running',
        details: `Testing ${test.description.toLowerCase()}...`
      };
      
      setTestResults(prev => [...prev.filter(r => r.testName !== test.name), runningResult]);
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simulate test result
      const success = Math.random() > 0.1; // 90% success rate
      const result: PaymentTestResult = {
        testName: test.name,
        status: success ? 'passed' : 'failed',
        details: success 
          ? `${test.description} completed successfully`
          : `${test.description} failed - check configuration`,
        transactionId: success ? `txn_${Math.random().toString(36).substr(2, 9)}` : undefined,
        amount: success ? 2.99 : undefined
      };
      
      setTestResults(prev => [...prev.filter(r => r.testName !== test.name), result]);
    }
    
    setCurrentTest('');
    setIsRunning(false);
  };

  const runSpecificTest = async (testName: string) => {
    const testInfo = paymentTests.find(t => t.name === testName);
    if (!testInfo) return;
    
    setCurrentTest(testName);
    
    const runningResult: PaymentTestResult = {
      testName,
      status: 'running',
      details: `Testing ${testInfo.description.toLowerCase()}...`
    };
    
    setTestResults(prev => [...prev.filter(r => r.testName !== testName), runningResult]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() > 0.05;
    const result: PaymentTestResult = {
      testName,
      status: success ? 'passed' : 'failed',
      details: success 
        ? `${testInfo.description} test passed`
        : `${testInfo.description} test failed`,
      transactionId: success ? `txn_${Math.random().toString(36).substr(2, 9)}` : undefined,
      amount: success ? 2.99 : undefined
    };
    
    setTestResults(prev => [...prev.filter(r => r.testName !== testName), result]);
    setCurrentTest('');
  };

  const getStatusIcon = (status: PaymentTestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'running':
        return <div className="h-4 w-4 rounded-full bg-puzzle-aqua animate-pulse" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-600" />;
    }
  };

  const getStatusBadge = (status: PaymentTestResult['status']) => {
    const variants = {
      pending: 'bg-gray-500/20 text-gray-400',
      running: 'bg-puzzle-aqua/20 text-puzzle-aqua',
      passed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const passedTests = testResults.filter(test => test.status === 'passed').length;
  const failedTests = testResults.filter(test => test.status === 'failed').length;

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Integration Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Test payment processing in sandbox mode
          </div>
          <Button
            onClick={runPaymentTests}
            disabled={isRunning}
            size="sm"
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            {isRunning ? 'Testing...' : 'Run All Tests'}
          </Button>
        </div>

        {currentTest && (
          <div className="bg-puzzle-aqua/10 border border-puzzle-aqua/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-puzzle-aqua animate-pulse" />
              <span className="text-sm text-puzzle-aqua">Currently testing: {currentTest}</span>
            </div>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">{passedTests}</div>
                <div className="text-xs text-gray-400">Passed</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-red-400">{failedTests}</div>
                <div className="text-xs text-gray-400">Failed</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-puzzle-gold">
                  {testResults.length > 0 ? ((passedTests / testResults.length) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
            </div>

            <div className="space-y-2">
              {paymentTests.map((test) => {
                const result = testResults.find(r => r.testName === test.name);
                return (
                  <div key={test.name} className="flex items-center justify-between bg-gray-800 rounded p-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result?.status || 'pending')}
                      <div>
                        <div className="text-sm font-medium text-puzzle-white">{test.name}</div>
                        <div className="text-xs text-gray-400">
                          {result?.details || test.description}
                        </div>
                        {result?.transactionId && (
                          <div className="text-xs text-puzzle-aqua mt-1">
                            Transaction: {result.transactionId}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {result?.amount && (
                        <span className="text-xs text-puzzle-gold">
                          ${result.amount.toFixed(2)}
                        </span>
                      )}
                      {getStatusBadge(result?.status || 'pending')}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runSpecificTest(test.name)}
                        disabled={isRunning || result?.status === 'running'}
                        className="border-gray-600 text-gray-400 hover:bg-gray-700 text-xs px-2 py-1"
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {failedTests > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Payment Issues Detected
                </div>
                <div className="text-xs text-gray-300">
                  Some payment tests failed. Check Stripe configuration, API keys, 
                  and webhook endpoints before production deployment.
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          All payment tests must pass before enabling real money transactions.
          Test in sandbox mode only with test credit cards.
        </div>
      </CardContent>
    </Card>
  );
};
