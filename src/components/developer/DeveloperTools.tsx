
import React, { useState, useEffect } from 'react';
import { monitoringService, useMonitoring } from '@/utils/monitoring/monitoringService';
import { performanceMonitor } from '@/utils/monitoring/performanceMonitor';
import { errorTracker } from '@/utils/monitoring/errorTracker'; // Path stays the same even though file extension changed
import { userActivityMonitor } from '@/utils/monitoring/userActivityMonitor';
import { 
  Bug, ChevronDown, ChevronUp, AlertTriangle, 
  Activity, Clock, Download, Maximize, Minimize, 
  UserCheck, X, RefreshCw, BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface DeveloperToolsProps {
  initiallyExpanded?: boolean;
}

const DeveloperTools: React.FC<DeveloperToolsProps> = ({ initiallyExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [activeTab, setActiveTab] = useState('performance');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [errorData, setErrorData] = useState<any>(null);
  const [activityData, setActivityData] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { isDebugMode, toggleDebugMode, createSnapshot } = useMonitoring();
  
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    const updateData = () => {
      setPerformanceData(performanceMonitor.getSummary());
      setErrorData(errorTracker.getStats());
      setActivityData(userActivityMonitor.getSessionInfo());
    };
    
    updateData();
    
    const interval = setInterval(updateData, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  const downloadSnapshot = () => {
    const snapshot = createSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-snapshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="shadow-lg bg-slate-800 hover:bg-slate-700 text-white rounded-full h-12 w-12"
          onClick={() => setIsExpanded(true)}
        >
          <Bug className="h-6 w-6" />
        </Button>
      </div>
    );
  }
  
  const containerClasses = isFullscreen
    ? "fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-col bg-background border shadow-lg p-4 overflow-hidden"
    : "fixed bottom-4 right-4 z-50 w-96 flex flex-col bg-background border rounded-lg shadow-lg p-4 overflow-hidden";
  
  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Bug className="h-4 w-4 mr-2" />
          <h2 className="text-sm font-semibold">Developer Tools</h2>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={toggleDebugMode}
            title={isDebugMode ? "Disable Debug Mode" : "Enable Debug Mode"}
          >
            <Activity className={`h-4 w-4 ${isDebugMode ? 'text-green-500' : 'text-muted-foreground'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={downloadSnapshot}
            title="Download Debug Snapshot"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsExpanded(false)}
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
        <TabsList className="flex justify-between">
          <TabsTrigger value="performance" className="flex-1 text-xs">
            Performance
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex-1 text-xs">
            Errors
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-1 text-xs">
            Activity
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-auto mt-2">
          <TabsContent value="performance" className="m-0">
            <div className="space-y-2">
              <div className="bg-muted rounded p-2">
                <div className="text-xs font-medium mb-1">Overall Performance</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background rounded p-2">
                    <div className="text-xs text-muted-foreground">Average Time</div>
                    <div className="text-sm font-mono">
                      {performanceData?.overallAverage?.toFixed(2)}ms
                    </div>
                  </div>
                  <div className="bg-background rounded p-2">
                    <div className="text-xs text-muted-foreground">Metrics Count</div>
                    <div className="text-sm font-mono">
                      {Object.keys(performanceData?.byName || {}).length}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs font-medium">Metrics by Name</div>
              <div className="space-y-1 max-h-60 overflow-auto">
                {performanceData && Object.entries(performanceData.byName || {}).map(([name, data]: [string, any]) => (
                  <div key={name} className="bg-muted rounded p-2">
                    <div className="text-xs font-medium truncate">{name}</div>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Avg:</span>{" "}
                        <span className="font-mono">{data.avg.toFixed(1)}ms</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Min:</span>{" "}
                        <span className="font-mono">{data.min.toFixed(1)}ms</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Max:</span>{" "}
                        <span className="font-mono">{data.max.toFixed(1)}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="errors" className="m-0">
            <div className="space-y-2">
              <div className="bg-muted rounded p-2">
                <div className="text-xs font-medium mb-1">Error Overview</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background rounded p-2">
                    <div className="text-xs text-muted-foreground">Total Errors</div>
                    <div className="text-sm font-mono">{errorData?.total || 0}</div>
                  </div>
                  <div className="bg-background rounded p-2">
                    <div className="text-xs text-muted-foreground">Fatal Errors</div>
                    <div className="text-sm font-mono">{errorData?.fatalCount || 0}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs font-medium">Errors by Severity</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted rounded p-2">
                  <div className="text-xs text-yellow-500 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Low/Medium
                  </div>
                  <div className="text-sm font-mono">
                    {(errorData?.bySeverity?.low || 0) + (errorData?.bySeverity?.medium || 0)}
                  </div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="text-xs text-red-500 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> High/Critical
                  </div>
                  <div className="text-sm font-mono">
                    {(errorData?.bySeverity?.high || 0) + (errorData?.bySeverity?.critical || 0)}
                  </div>
                </div>
              </div>
              
              <div className="text-xs font-medium">Recent Errors</div>
              <div className="space-y-1 max-h-60 overflow-auto">
                {errorTracker.getErrors().slice(0, 5).map((error, index) => (
                  <div key={index} className="bg-muted rounded p-2">
                    <div className="text-xs font-medium truncate">{error.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(error.timestamp).toLocaleTimeString()} • {error.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="m-0">
            <div className="space-y-2">
              <div className="bg-muted rounded p-2">
                <div className="text-xs font-medium mb-1">Session Overview</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background rounded p-2">
                    <div className="text-xs text-muted-foreground">Session Duration</div>
                    <div className="text-sm font-mono">
                      {Math.floor((activityData?.duration || 0) / 60000)}m {Math.floor(((activityData?.duration || 0) % 60000) / 1000)}s
                    </div>
                  </div>
                  <div className="bg-background rounded p-2">
                    <div className="text-xs text-muted-foreground">Activities Count</div>
                    <div className="text-sm font-mono">{activityData?.activityCount || 0}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs font-medium">Last Activity</div>
              <div className="bg-muted rounded p-2">
                <div className="text-xs text-muted-foreground">Time since last activity</div>
                <div className="text-sm font-mono">
                  {Math.floor((activityData?.lastActivity || 0) / 1000)}s ago
                </div>
              </div>
              
              <div className="text-xs font-medium">Recent Activities</div>
              <div className="space-y-1 max-h-60 overflow-auto">
                {userActivityMonitor.getActivities().slice(-5).reverse().map((activity, index) => (
                  <div key={index} className="bg-muted rounded p-2">
                    <div className="text-xs font-medium truncate">{activity.action}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>{activity.route}</span>
                      <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs text-muted-foreground">
        <div>Session ID: {monitoringService['sessionId'].substring(0, 8)}</div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={() => {
            setPerformanceData(performanceMonitor.getSummary());
            setErrorData(errorTracker.getStats());
            setActivityData(userActivityMonitor.getSessionInfo());
          }}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default DeveloperTools;
