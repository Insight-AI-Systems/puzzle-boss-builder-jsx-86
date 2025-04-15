
import React, { useState, useEffect } from 'react';

/**
 * A component that displays diagnostic information and logs
 * to help debug React rendering and lifecycle issues
 */
const DiagnosticLog = ({ maxEntries = 10 }) => {
  const [logs, setLogs] = useState([]);
  const [expanded, setExpanded] = useState(false);

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

  // Expose the addLog method globally for debugging from anywhere
  useEffect(() => {
    window.__addDiagnosticLog = addLog;
    
    // Add diagnostic logs on mount
    addLog('DiagnosticLog component mounted');
    
    // Log important environment information
    addLog(`React version: ${React.version}`);
    addLog(`URL: ${window.location.href}`);
    addLog(`Screen: ${window.innerWidth}x${window.innerHeight}`);
    
    return () => {
      addLog('DiagnosticLog component unmounting');
      delete window.__addDiagnosticLog;
    };
  }, []);

  return (
    <div className="diagnostic-log bg-black/30 p-4 rounded border border-puzzle-gold/50 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-puzzle-gold text-sm font-bold">React Diagnostic Log</h3>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-xs bg-puzzle-black/50 px-2 py-1 rounded text-puzzle-aqua"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className={`text-xs ${expanded ? 'max-h-[400px]' : 'max-h-[100px]'} overflow-y-auto transition-all duration-300`}>
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
    </div>
  );
};

// Export both as default and named export for compatibility
export { DiagnosticLog };
export default DiagnosticLog;
