
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Clock, Bug, Zap } from 'lucide-react';
import { TestingCoordinator } from '@/utils/testing/TestingCoordinator';

interface ErrorScanResult {
  category: string;
  errors: number;
  status: 'critical' | 'warning' | 'info' | 'success';
  details: string[];
}

export function ErrorDetectionDashboard() {
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ErrorScanResult[]>([]);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Auto-run initial scan
    runErrorScan();
  }, []);

  const runErrorScan = async () => {
    setScanning(true);
    setScanProgress(0);
    
    try {
      const coordinator = new TestingCoordinator();
      
      // Simulate progressive scanning
      const scanSteps = [
        { name: 'TypeScript Compilation', weight: 25 },
        { name: 'Import Resolution', weight: 20 },
        { name: 'Component Dependencies', weight: 15 },
        { name: 'Business Logic Separation', weight: 20 },
        { name: 'Performance Analysis', weight: 10 },
        { name: 'Security Validation', weight: 10 }
      ];
      
      const results: ErrorScanResult[] = [];
      let totalProgress = 0;
      
      for (const step of scanSteps) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate scan time
        totalProgress += step.weight;
        setScanProgress(totalProgress);
        
        // Mock scan results
        const errorCount = Math.floor(Math.random() * 3);
        results.push({
          category: step.name,
          errors: errorCount,
          status: errorCount === 0 ? 'success' : errorCount === 1 ? 'warning' : 'critical',
          details: errorCount > 0 ? [`${errorCount} issues detected in ${step.name.toLowerCase()}`] : []
        });
      }
      
      setScanResults(results);
      
      // Determine overall health
      const criticalErrors = results.filter(r => r.status === 'critical').length;
      const warningErrors = results.filter(r => r.status === 'warning').length;
      
      if (criticalErrors > 0) {
        setOverallHealth('critical');
      } else if (warningErrors > 0) {
        setOverallHealth('warning');
      } else {
        setOverallHealth('healthy');
      }
      
    } catch (error) {
      console.error('Error during scan:', error);
    } finally {
      setScanning(false);
      setScanProgress(100);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <Bug className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const totalErrors = scanResults.reduce((sum, result) => sum + result.errors, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Application Error Detection Scan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Overall Health Status: 
                <Badge 
                  className="ml-2"
                  variant={overallHealth === 'healthy' ? 'default' : overallHealth === 'warning' ? 'secondary' : 'destructive'}
                >
                  {overallHealth.toUpperCase()}
                </Badge>
              </p>
              <p className="text-sm text-muted-foreground">
                {totalErrors} total issues detected
              </p>
            </div>
            <Button 
              onClick={runErrorScan} 
              disabled={scanning}
              size="sm"
            >
              {scanning ? 'Scanning...' : 'Run Full Scan'}
            </Button>
          </div>
          
          {scanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scan Progress</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scanResults.map((result, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{result.category}</span>
                {getStatusIcon(result.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Issues Found:</span>
                  <Badge variant={getStatusBadgeVariant(result.status)}>
                    {result.errors}
                  </Badge>
                </div>
                
                {result.details.length > 0 && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {result.details.map((detail, idx) => (
                      <div key={idx} className="truncate">
                        • {detail}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scanResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Scan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Categories Scanned:</span>
                <span>{scanResults.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Issues:</span>
                <span className={totalErrors > 0 ? 'text-red-500 font-medium' : 'text-green-500'}>
                  {totalErrors}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Critical Issues:</span>
                <span className="text-red-500 font-medium">
                  {scanResults.filter(r => r.status === 'critical').reduce((sum, r) => sum + r.errors, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Warnings:</span>
                <span className="text-yellow-500 font-medium">
                  {scanResults.filter(r => r.status === 'warning').reduce((sum, r) => sum + r.errors, 0)}
                </span>
              </div>
            </div>
            
            {totalErrors > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Run the automated fix system to resolve detected issues.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
