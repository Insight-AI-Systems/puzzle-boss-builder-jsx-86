
import React, { useState, useEffect } from 'react';
import { useAppMode } from '@/contexts/app-mode';
import diagnosticConfig from '@/config/diagnosticSettings';

/**
 * A component that displays diagnostic information and logs
 * to help debug React rendering and lifecycle issues
 */
const DiagnosticLog = ({ maxEntries = 10, expanded = false }) => {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const { diagnosticSettings, updateDiagnosticSettings, dismissWarning } = useAppMode();

  // Add a new log entry
  const addLog = (message) => {
    setLogs(prevLogs => {
      const newLogs = [
        {
          id: Date.now(),
          timestamp: new Date().toISOString().split('T')[1].split('.')[0],
          message
        },
        ...prevLogs
      ].slice(0, maxEntries);
      
      console.log(`[DiagnosticLog] ${message}`);
      return newLogs;
    });
  };

  // Toggle display settings
  const toggleDiagnostics = () => {
    updateDiagnosticSettings({
      display: {
        ...diagnosticSettings.display,
        showDiagnosticsInUI: !diagnosticSettings.display.showDiagnosticsInUI
      }
    });
  };

  // Toggle timeout warning display
  const toggleTimeoutWarning = () => {
    updateDiagnosticSettings({
      timeoutDetection: {
        ...diagnosticSettings.timeoutDetection,
        showWarning: !diagnosticSettings.timeoutDetection.showWarning
      }
    });
  };

  // Permanently dismiss rendering timeout warnings
  const dismissTimeoutWarnings = () => {
    dismissWarning('render-timeout');
    addLog('Timeout warnings permanently dismissed');
  };
  
  // Change timeout threshold
  const updateTimeoutThreshold = (newThreshold) => {
    updateDiagnosticSettings({
      timeoutDetection: {
        ...diagnosticSettings.timeoutDetection,
        threshold: newThreshold
      }
    });
    addLog(`Timeout threshold changed to ${newThreshold}ms`);
  };

  // Expose the addLog method globally for debugging from anywhere
  useEffect(() => {
    window.__addDiagnosticLog = addLog;
    
    // Add diagnostic logs on mount
    addLog('DiagnosticLog component mounted');
    
    // Log important environment information
    addLog(`React version: ${React.version}`);
    addLog(`URL: ${window.location.href}`);
    addLog(`Screen: ${window.innerWidth}x${window.innerHeight}`);
    addLog(`Timeout threshold: ${diagnosticSettings.timeoutDetection.threshold}ms`);
    
    return () => {
      addLog('DiagnosticLog component unmounting');
      delete window.__addDiagnosticLog;
    };
  }, []);

  return (
    <div className="diagnostic-log bg-black/30 p-4 rounded border border-puzzle-gold/50 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-puzzle-gold text-sm font-bold">React Diagnostic Log</h3>
        <div className="flex space-x-2">
          <button 
            onClick={toggleTimeoutWarning} 
            className="text-xs bg-puzzle-black/50 px-2 py-1 rounded text-puzzle-aqua"
            title={diagnosticSettings.timeoutDetection.showWarning ? "Disable timeout warnings" : "Enable timeout warnings"}
          >
            {diagnosticSettings.timeoutDetection.showWarning ? 'Hide Warnings' : 'Show Warnings'}
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-xs bg-puzzle-black/50 px-2 py-1 rounded text-puzzle-aqua"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button 
            onClick={toggleDiagnostics} 
            className="text-xs bg-puzzle-black/50 px-2 py-1 rounded text-puzzle-aqua"
          >
            Hide
          </button>
        </div>
      </div>
      
      <div className={`text-xs ${isExpanded ? 'max-h-[400px]' : 'max-h-[100px]'} overflow-y-auto transition-all duration-300`}>
        {logs.length === 0 ? (
          <p className="text-gray-400 italic">No logs yet</p>
        ) : (
          <ul className="space-y-1">
            {logs.map(log => (
              <li key={log.id} className="text-gray-300">
                <span className="text-puzzle-aqua/70">[{log.timestamp}]</span> {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-puzzle-gold/20">
          <h4 className="text-xs font-bold text-puzzle-aqua mb-2">Diagnostic Settings</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateTimeoutThreshold(5000)}
              className={`text-xs px-2 py-1 rounded ${diagnosticSettings.timeoutDetection.threshold === 5000 ? 'bg-puzzle-aqua text-black' : 'bg-black/50 text-puzzle-aqua'}`}
            >
              5s Timeout
            </button>
            <button
              onClick={() => updateTimeoutThreshold(8000)}
              className={`text-xs px-2 py-1 rounded ${diagnosticSettings.timeoutDetection.threshold === 8000 ? 'bg-puzzle-aqua text-black' : 'bg-black/50 text-puzzle-aqua'}`}
            >
              8s Timeout
            </button>
            <button
              onClick={() => updateTimeoutThreshold(15000)}
              className={`text-xs px-2 py-1 rounded ${diagnosticSettings.timeoutDetection.threshold === 15000 ? 'bg-puzzle-aqua text-black' : 'bg-black/50 text-puzzle-aqua'}`}
            >
              15s Timeout
            </button>
            <button
              onClick={dismissTimeoutWarnings}
              className="text-xs px-2 py-1 rounded bg-puzzle-burgundy/80 text-white"
              title="Permanently dismiss timeout warnings"
            >
              Dismiss Warnings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export both as default and named export for compatibility
export { DiagnosticLog };
export default DiagnosticLog;
