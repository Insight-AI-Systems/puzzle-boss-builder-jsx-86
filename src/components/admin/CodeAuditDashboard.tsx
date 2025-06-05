import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings,
  FileText,
  Zap,
  Shield,
  Database
} from 'lucide-react';
import { CodeAuditRunner, AuditResult, AuditSummary } from '@/utils/codeAudit/CodeAuditRunner';

export function CodeAuditDashboard() {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [auditSummary, setAuditSummary] = useState<AuditSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const runAudit = async () => {
    setIsRunning(true);
    try {
      const auditor = new CodeAuditRunner();
      const { results, summary } = await auditor.runFullAudit();
      setAuditResults(results);
      setAuditSummary(summary);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'typescript': return <FileText className="h-4 w-4" />;
      case 'unused-code': return <XCircle className="h-4 w-4" />;
      case 'dependencies': return <Database className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'architecture': return <Settings className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredResults = selectedCategory === 'all' 
    ? auditResults 
    : auditResults.filter(result => result.category === selectedCategory);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Code Audit Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Comprehensive code quality analysis and improvement recommendations
            </p>
            <Button onClick={runAudit} disabled={isRunning}>
              {isRunning ? 'Running Audit...' : 'Run Full Audit'}
            </Button>
          </div>

          {auditSummary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Critical Issues</p>
                      <p className="text-2xl font-bold">{auditSummary.criticalIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-orange-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">High Priority</p>
                      <p className="text-2xl font-bold">{auditSummary.highPriorityIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Auto-fixable</p>
                      <p className="text-2xl font-bold">{auditSummary.autoFixableIssues}</p>
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
                      <p className="text-2xl font-bold">{auditSummary.totalIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              <TabsTrigger value="unused-code">Unused</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <Alert key={index} className="border-l-4 border-l-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getCategoryIcon(result.category)}
                        <div className="flex-1">
                          <AlertTitle className="flex items-center space-x-2">
                            <span>{result.issue}</span>
                            <Badge variant={getSeverityColor(result.severity)}>
                              {result.severity}
                            </Badge>
                            {result.autoFixable && (
                              <Badge variant="outline" className="text-green-600">
                                Auto-fixable
                              </Badge>
                            )}
                          </AlertTitle>
                          <AlertDescription className="mt-2">
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>File:</strong> {result.file}
                              {result.line && <span> (Line {result.line})</span>}
                            </p>
                            <p className="mb-2">{result.description}</p>
                            <p className="text-sm text-blue-600">
                              <strong>Recommendation:</strong> {result.recommendation}
                            </p>
                          </AlertDescription>
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
                
                {filteredResults.length === 0 && auditSummary && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">No issues found in this category</p>
                    <p className="text-muted-foreground">Great work! This category is clean.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
