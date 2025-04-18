
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ShieldAlert, RefreshCw, Download, Check, X } from "lucide-react";
import { runSecurityAudit, getSecurityScore, generateSecurityReport, SecurityAuditResult } from '@/utils/security/securityAudit';
import { useSecurity } from '@/hooks/useSecurityContext';

export function SecurityAuditDashboard() {
  const [auditResults, setAuditResults] = useState<SecurityAuditResult[]>([]);
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastAuditTime, setLastAuditTime] = useState<Date | null>(null);
  
  const { securityLevel, setSecurityLevel } = useSecurity();
  
  // Run initial security audit
  useEffect(() => {
    runAudit();
  }, []);
  
  // Run security audit
  const runAudit = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const results = runSecurityAudit();
      setAuditResults(results);
      setSecurityScore(getSecurityScore(results));
      setLastAuditTime(new Date());
      setIsLoading(false);
    }, 1000); // Simulate loading time
  };
  
  // Download security report
  const downloadReport = () => {
    const report = generateSecurityReport(auditResults);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Group audit results by severity
  const criticalIssues = auditResults.filter(r => !r.pass && r.severity === 'critical');
  const highIssues = auditResults.filter(r => !r.pass && r.severity === 'high');
  const mediumIssues = auditResults.filter(r => !r.pass && r.severity === 'medium');
  const lowIssues = auditResults.filter(r => !r.pass && r.severity === 'low');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-puzzle-aqua" />
          Security Audit Dashboard
        </CardTitle>
        <CardDescription>
          Analyze and monitor the security of your account and system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Security Score</h3>
            <span className="text-sm text-muted-foreground">
              Last updated: {lastAuditTime ? lastAuditTime.toLocaleTimeString() : 'Never'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Progress value={securityScore} className="flex-1" />
            <span className="text-2xl font-bold">{securityScore}%</span>
          </div>
          
          <div className="flex justify-end space-x-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runAudit}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Running...' : 'Run Audit'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadReport}
              disabled={auditResults.length === 0 || isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
        
        {/* Issues Summary */}
        {auditResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={`bg-red-950/20 ${criticalIssues.length > 0 ? 'border-red-500' : 'border-green-500'}`}>
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center">
                  <ShieldAlert className={`h-4 w-4 mr-2 ${criticalIssues.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <span className={`text-2xl font-bold ${criticalIssues.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {criticalIssues.length}
                </span>
              </CardContent>
            </Card>
            
            <Card className={`bg-amber-950/20 ${highIssues.length > 0 ? 'border-amber-500' : 'border-green-500'}`}>
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center">
                  <ShieldAlert className={`h-4 w-4 mr-2 ${highIssues.length > 0 ? 'text-amber-500' : 'text-green-500'}`} />
                  High Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <span className={`text-2xl font-bold ${highIssues.length > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                  {highIssues.length}
                </span>
              </CardContent>
            </Card>
            
            <Card className={`bg-yellow-950/20 ${mediumIssues.length > 0 ? 'border-yellow-500' : 'border-green-500'}`}>
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center">
                  <ShieldAlert className={`h-4 w-4 mr-2 ${mediumIssues.length > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
                  Medium Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <span className={`text-2xl font-bold ${mediumIssues.length > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {mediumIssues.length}
                </span>
              </CardContent>
            </Card>
            
            <Card className={`bg-blue-950/20 ${lowIssues.length > 0 ? 'border-blue-500' : 'border-green-500'}`}>
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center">
                  <ShieldAlert className={`h-4 w-4 mr-2 ${lowIssues.length > 0 ? 'text-blue-500' : 'text-green-500'}`} />
                  Low Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <span className={`text-2xl font-bold ${lowIssues.length > 0 ? 'text-blue-500' : 'text-green-500'}`}>
                  {lowIssues.length}
                </span>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Security Level Controls */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Security Level</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={securityLevel === 'normal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSecurityLevel('normal')}
            >
              Normal
            </Button>
            <Button 
              variant={securityLevel === 'elevated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSecurityLevel('elevated')}
            >
              Elevated
            </Button>
            <Button 
              variant={securityLevel === 'lockdown' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSecurityLevel('lockdown')}
            >
              Lockdown
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {securityLevel === 'normal' && 'Standard security measures are in place.'}
            {securityLevel === 'elevated' && 'Enhanced security with additional verification steps.'}
            {securityLevel === 'lockdown' && 'Maximum security with strict access controls.'}
          </p>
        </div>
        
        {/* Detailed Audit Results */}
        {auditResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Audit Details</h3>
            <div className="rounded-md border divide-y">
              {auditResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 flex justify-between items-start ${!result.pass ? 'bg-red-950/10' : ''}`}
                >
                  <div>
                    <div className="flex items-center">
                      {result.pass ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      <span className="font-medium">{result.test}</span>
                    </div>
                    {result.details && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.details}
                      </p>
                    )}
                    {!result.pass && result.remediation && (
                      <p className="text-sm text-amber-400 mt-1">
                        Remediation: {result.remediation}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${result.severity === 'critical' ? 'bg-red-500/20 text-red-400' : ''}
                      ${result.severity === 'high' ? 'bg-amber-500/20 text-amber-400' : ''}
                      ${result.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                      ${result.severity === 'low' ? 'bg-blue-500/20 text-blue-400' : ''}
                    `}>
                      {result.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Security Recommendations */}
        <Alert className="bg-puzzle-aqua/10 border-puzzle-aqua">
          <Shield className="h-4 w-4" />
          <AlertTitle>Security Recommendations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Enable two-factor authentication for additional account security</li>
              <li>Regularly update your password (last changed: never)</li>
              <li>Verify your active sessions and log out from unused devices</li>
              <li>Keep your browser and operating system updated</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
