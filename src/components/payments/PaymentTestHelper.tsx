
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Wallet,
  CreditCard
} from 'lucide-react';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export function PaymentTestHelper() {
  const [testGameId, setTestGameId] = useState('test-game-123');
  const [testEntryFee, setTestEntryFee] = useState(5.00);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const { user } = useClerkAuth();
  const { processPayment, isProcessing } = usePaymentSystem();

  const addTestResult = (test: string, success: boolean, message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toISOString()
    }]);
  };

  const runPaymentTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      // Test 1: Basic Payment Processing
      console.log('Test 1: Basic Payment Processing');
      const paymentResult = await processPayment(testEntryFee, `Test payment for ${testGameId}`);
      addTestResult(
        'Basic Payment Processing',
        paymentResult,
        paymentResult ? 'Payment processed successfully' : 'Payment processing failed'
      );

      // Test 2: Large Amount Payment
      console.log('Test 2: Large Amount Payment');
      const largePaymentResult = await processPayment(100.00, 'Large amount test');
      addTestResult(
        'Large Amount Payment',
        largePaymentResult,
        largePaymentResult ? 'Large payment processed successfully' : 'Large payment failed'
      );

    } catch (error) {
      addTestResult(
        'Test Suite Error',
        false,
        `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsRunningTests(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getTestIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  if (!user) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-puzzle-white">Please log in to test payment system</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Payment System Test Helper
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-puzzle-white">Test Game ID</label>
              <Input
                value={testGameId}
                onChange={(e) => setTestGameId(e.target.value)}
                className="bg-gray-800 border-gray-600 text-puzzle-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-puzzle-white">Test Entry Fee</label>
              <Input
                type="number"
                step="0.01"
                value={testEntryFee}
                onChange={(e) => setTestEntryFee(parseFloat(e.target.value) || 0)}
                className="bg-gray-800 border-gray-600 text-puzzle-white"
              />
            </div>
          </div>

          {/* Test Actions */}
          <div className="flex gap-2">
            <Button
              onClick={runPaymentTests}
              disabled={isRunningTests}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              {isRunningTests ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-puzzle-black border-t-transparent rounded-full mr-2"></div>
                  Running Tests...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Run Payment Tests
                </>
              )}
            </Button>
            
            {testResults.length > 0 && (
              <Button
                onClick={clearResults}
                variant="outline"
                className="border-gray-600 text-gray-400"
              >
                Clear Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                  {getTestIcon(result.success)}
                  <div className="flex-1">
                    <div className="text-puzzle-white font-medium">{result.test}</div>
                    <div className="text-sm text-gray-400">{result.message}</div>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-puzzle-aqua cursor-pointer">
                          Show Details
                        </summary>
                        <pre className="text-xs text-gray-500 mt-1 overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <Badge 
                    variant={result.success ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {result.success ? 'PASS' : 'FAIL'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
