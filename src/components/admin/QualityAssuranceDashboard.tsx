
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertTriangle, 
  Code, 
  Layers,
  Zap,
  Shield,
  FileText,
  Settings
} from 'lucide-react';
import { CodeAuditRunner } from '@/utils/codeAudit/CodeAuditRunner';
import { TypeScriptAuditor } from '@/utils/codeAudit/TypeScriptAuditor';
import { ArchitectureAuditor } from '@/utils/codeAudit/ArchitectureAuditor';
import { AutoFixer } from '@/utils/codeAudit/AutoFixer';

export function QualityAssuranceDashboard() {
  const [activePhase, setActivePhase] = useState<'audit' | 'fix' | 'monitor'>('audit');
  const [auditResults, setAuditResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runComprehensiveAudit = async () => {
    setIsRunning(true);
    try {
      // Phase 1: TypeScript Analysis
      const tsAuditor = new TypeScriptAuditor();
      const tsResults = tsAuditor.analyzeAdminComponents();
      
      // Phase 2: Architecture Analysis
      const archAuditor = new ArchitectureAuditor();
      const archResults = archAuditor.analyzeComponentComplexity();
      
      // Phase 3: Full Code Audit
      const codeAuditor = new CodeAuditRunner();
      const { results: codeResults } = await codeAuditor.runFullAudit();
      
      const allResults = [...tsResults, ...archResults, ...codeResults];
      setAuditResults(allResults);
      
      console.log('🎯 Comprehensive audit completed:', {
        typescript: tsResults.length,
        architecture: archResults.length,
        general: codeResults.length,
        total: allResults.length
      });
      
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAutoFixes = async () => {
    const autoFixer = new AutoFixer();
    const fixableIssues = auditResults.filter(result => result.autoFixable);
    
    if (fixableIssues.length > 0) {
      const { fixed, failed } = await autoFixer.applyAutoFixes(fixableIssues);
      console.log(`🔧 Auto-fixed ${fixed.length} issues, ${failed.length} failed`);
    }
  };

  const getCriticalIssues = () => auditResults.filter(r => r.severity === 'critical').length;
  const getHighIssues = () => auditResults.filter(r => r.severity === 'high').length;
  const getAutoFixable = () => auditResults.filter(r => r.autoFixable).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Quality Assurance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Critical Issues</p>
                    <p className="text-2xl font-bold">{getCriticalIssues()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Code className="h-5 w-5 text-orange-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">High Priority</p>
                    <p className="text-2xl font-bold">{getHighIssues()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Auto-fixable</p>
                    <p className="text-2xl font-bold">{getAutoFixable()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Total Issues</p>
                    <p className="text-2xl font-bold">{auditResults.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activePhase} onValueChange={(value: any) => setActivePhase(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="fix">Fix</TabsTrigger>
              <TabsTrigger value="monitor">Monitor</TabsTrigger>
            </TabsList>

            <TabsContent value="audit" className="mt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={runComprehensiveAudit} disabled={isRunning}>
                    {isRunning ? 'Running Audit...' : 'Run Comprehensive Audit'}
                  </Button>
                </div>
                
                {auditResults.length > 0 && (
                  <div className="space-y-3">
                    {auditResults.map((result, index) => (
                      <Alert key={index} className="border-l-4 border-l-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="flex items-center space-x-2">
                          <span>{result.issue}</span>
                          <Badge variant={result.severity === 'critical' ? 'destructive' : 'default'}>
                            {result.severity}
                          </Badge>
                          {result.autoFixable && (
                            <Badge variant="outline" className="text-green-600">
                              Auto-fixable
                            </Badge>
                          )}
                        </AlertTitle>
                        <AlertDescription>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>File:</strong> {result.file}
                          </p>
                          <p className="mb-2">{result.description}</p>
                          <p className="text-sm text-blue-600">
                            <strong>Fix:</strong> {result.recommendation}
                          </p>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="fix" className="mt-6">
              <div className="space-y-4">
                <Button onClick={runAutoFixes} disabled={getAutoFixable() === 0}>
                  Apply Auto-Fixes ({getAutoFixable()} available)
                </Button>
                
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertTitle>Manual Fixes Required</AlertTitle>
                  <AlertDescription>
                    Some issues require manual intervention. Review the audit results above for detailed recommendations.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="monitor" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Code Quality Score</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>TypeScript Coverage</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Architecture Health</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
