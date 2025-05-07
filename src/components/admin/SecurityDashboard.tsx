
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getSecurityEvents, SecurityEventType, SecurityEventSeverity } from '@/utils/security/auditLogging';
import { SecurityTestRunner } from '@/utils/security/testHelpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, Activity, Check, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';

/**
 * Security Dashboard Component
 * 
 * Provides administrators with security monitoring, testing, and analytics
 * Implements real-time alerting for security events
 */
export const SecurityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [remoteEvents, setRemoteEvents] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eventStats, setEventStats] = useState({
    critical: 0,
    error: 0,
    warning: 0,
    info: 0,
    total: 0
  });
  
  const { toast } = useToast();
  
  // Fetch security events on load
  useEffect(() => {
    // Get locally stored events
    const localEvents = getSecurityEvents();
    setSecurityEvents(localEvents);
    
    // Calculate statistics
    calculateEventStats(localEvents);
    
    // Fetch remote events from database
    fetchRemoteEvents();
  }, []);
  
  // Calculate event statistics by severity
  const calculateEventStats = (events: any[]) => {
    const stats = {
      critical: 0,
      error: 0,
      warning: 0,
      info: 0,
      total: events.length
    };
    
    events.forEach(event => {
      if (event.severity in stats) {
        stats[event.severity as keyof typeof stats]++;
      }
    });
    
    setEventStats(stats);
  };
  
  // Fetch events from database
  const fetchRemoteEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('security-events', {
        body: { action: 'getRecent', limit: 50 }
      });
      
      if (error) {
        throw error;
      }
      
      if (data && Array.isArray(data.events)) {
        setRemoteEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching security events:', error);
      toast({
        title: "Error",
        description: "Failed to load security events from database",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Run security tests
  const runSecurityTests = async () => {
    setIsTestRunning(true);
    const testRunner = new SecurityTestRunner();
    
    try {
      const results = await testRunner.runAllTests();
      setTestResults(results);
      
      // Show toast with overall result
      const allPassed = results.every(r => r.success);
      toast({
        title: allPassed ? "All Tests Passed" : "Test Failures Detected",
        description: allPassed 
          ? "All security tests completed successfully" 
          : `${results.filter(r => !r.success).length} security tests failed`,
        variant: allPassed ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error running security tests:', error);
      toast({
        title: "Error",
        description: "Failed to complete security tests",
        variant: "destructive"
      });
    } finally {
      setIsTestRunning(false);
    }
  };
  
  // Prepare chart data
  const prepareEventTimelineData = () => {
    // Group events by day
    const groupedByDay = remoteEvents.reduce((acc, event) => {
      const date = new Date(event.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, total: 0, info: 0, warning: 0, error: 0, critical: 0 };
      
      acc[date].total++;
      acc[date][event.severity] = (acc[date][event.severity] || 0) + 1;
      
      return acc;
    }, {});
    
    // Convert to array for chart
    return Object.values(groupedByDay);
  };
  
  // Prepare event type distribution data
  const prepareEventTypeData = () => {
    // Count events by type
    const countByType = remoteEvents.reduce((acc, event) => {
      const type = event.event_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array and sort by count
    return Object.entries(countByType)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 10); // Top 10
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Security Dashboard</CardTitle>
        <CardDescription>Monitor and manage platform security</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="tests">Security Tests</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                    <h3 className="text-2xl font-bold">{eventStats.total}</h3>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                    <h3 className="text-2xl font-bold">{eventStats.critical}</h3>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Error Events</p>
                    <h3 className="text-2xl font-bold">{eventStats.error}</h3>
                  </div>
                  <ShieldAlert className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                    <h3 className="text-2xl font-bold">{eventStats.warning}</h3>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Event Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {remoteEvents.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={prepareEventTimelineData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#8884d8" name="All Events" />
                      <Line type="monotone" dataKey="warning" stroke="#ffc658" name="Warnings" />
                      <Line type="monotone" dataKey="error" stroke="#ff8042" name="Errors" />
                      <Line type="monotone" dataKey="critical" stroke="#ff0000" name="Critical" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-[300px]">
                    <p>No event data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Event Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {remoteEvents.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prepareEventTypeData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-[300px]">
                    <p>No event data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Security Events Tab */}
        <TabsContent value="events" className="px-6 py-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Security Events</h3>
            <Button 
              variant="outline" 
              onClick={fetchRemoteEvents} 
              disabled={isLoading}
            >
              Refresh Events
            </Button>
          </div>
          
          <div className="space-y-3">
            {remoteEvents.length > 0 ? (
              remoteEvents.map((event, idx) => (
                <Card key={event.id || idx}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{event.event_type}</h4>
                      <Badge variant={
                        event.severity === 'critical' ? 'destructive' :
                        event.severity === 'error' ? 'destructive' :
                        event.severity === 'warning' ? 'default' : 'outline'
                      }>
                        {event.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>
                        {event.user_id ? `User: ${event.user_id.substring(0, 8)}...` : 'No user'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                    {event.details && (
                      <div className="mt-2 text-sm">
                        <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(event.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No security events found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Security Tests Tab */}
        <TabsContent value="tests" className="px-6 py-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Security Tests</h3>
            <Button 
              onClick={runSecurityTests} 
              disabled={isTestRunning}
            >
              Run Tests
            </Button>
          </div>
          
          {testResults.length > 0 ? (
            <div className="space-y-3">
              {testResults.map((result, idx) => (
                <Alert key={idx} variant={result.success ? "default" : "destructive"}>
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <div>
                      <AlertTitle>{result.success ? "Pass" : "Fail"}</AlertTitle>
                      <AlertDescription>
                        {result.message}
                        {result.details && (
                          <pre className="bg-muted p-2 mt-2 rounded text-xs overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Run tests to see results</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SecurityDashboard;
