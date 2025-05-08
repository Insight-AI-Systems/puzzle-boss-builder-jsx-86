
import React, { useState, useEffect } from 'react';
import { monitoringService } from '@/utils/monitoring/monitoringService';
import { performanceMonitor } from '@/utils/performance/PerformanceMonitor';
import { errorTracker } from '@/utils/monitoring/errorTracker';
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
  
  // Use monitoring service with default values
  const isDebugMode = monitoringService.isEnabled;
  const toggleDebugMode = () => {
    monitoringService.isEnabled = !monitoringService.isEnabled;
  };
  const createSnapshot = () => {
    return {
      performance: performanceMonitor.getMetrics(),
      errors: errorData,
      activity: activityData
    };
  };
  
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    const updateData = () => {
      setPerformanceData(performanceMonitor.getSummary ? performanceMonitor.getSummary() : {});
      setErrorData(errorTracker && typeof errorTracker.getStats === 'function' 
        ? errorTracker.getStats() 
        : { count: 0, byType: {} });
      setActivityData(userActivityMonitor 
        ? { sessionTime: 0, pageViews: 0, lastActive: new Date() }
        : { sessionTime: 0, pageViews: 0, lastActive: new Date() });
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
                    <div className="flex justify-between">
                      <span className="text-xs font-medium truncate">{name}</span>
                      <span className="text-xs text-muted-foreground">{data.count} calls</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      <div className="text-xs text-muted-foreground">Avg: <span className="font-mono">{data.avg.toFixed(2)}ms</span></div>
                      <div className="text-xs text-muted-foreground">Min: <span className="font-mono">{data.min.toFixed(2)}ms</span></div>
                      <div className="text-xs text-muted-foreground">Max: <span className="font-mono">{data.max.toFixed(2)}ms</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="errors" className="m-0">
            <div className="bg-muted rounded p-2 mb-2">
              <div className="text-xs font-medium mb-1">Error Summary</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background rounded p-2">
                  <div className="text-xs text-muted-foreground">Total Errors</div>
                  <div className="text-sm font-mono">{errorData?.count || 0}</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xs text-muted-foreground">Error Types</div>
                  <div className="text-sm font-mono">{Object.keys(errorData?.byType || {}).length}</div>
                </div>
              </div>
            </div>
            
            <div className="text-xs font-medium">Recent Errors</div>
            <div className="space-y-1 max-h-60 overflow-auto">
              {errorData && Object.entries(errorData?.byType || {}).map(([type, count]: [string, any]) => (
                <div key={type} className="bg-muted rounded p-2">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-medium">{type}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{count} occurrences</span>
                  </div>
                </div>
              ))}
              
              {(!errorData || Object.keys(errorData?.byType || {}).length === 0) && (
                <div className="bg-muted/50 rounded p-2 text-center">
                  <div className="text-xs text-muted-foreground">No errors recorded</div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="m-0">
            <div className="bg-muted rounded p-2 mb-2">
              <div className="text-xs font-medium mb-1">Session Info</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background rounded p-2">
                  <div className="text-xs text-muted-foreground">Session Duration</div>
                  <div className="text-sm font-mono">
                    {Math.floor((activityData?.sessionTime || 0) / 60)}m {(activityData?.sessionTime || 0) % 60}s
                  </div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xs text-muted-foreground">Page Views</div>
                  <div className="text-sm font-mono">{activityData?.pageViews || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="text-xs font-medium">User Activity</div>
            <div className="space-y-1 max-h-60 overflow-auto">
              <div className="bg-muted rounded p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Last Active</span>
                  <span className="text-xs font-mono">
                    {activityData?.lastActive ? new Date(activityData.lastActive).toLocaleTimeString() : '-'}
                  </span>
                </div>
              </div>
              
              <div className="bg-muted rounded p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Browser</span>
                  <span className="text-xs font-mono truncate max-w-[200px]">
                    {window.navigator.userAgent.split(' ').slice(-3).join(' ')}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DeveloperTools;
