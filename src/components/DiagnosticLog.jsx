
import React, { useState, useEffect } from 'react';

/**
 * A component that displays diagnostic information and logs
 * to help debug React rendering and lifecycle issues
 */
const DiagnosticLog = ({ maxEntries = 10 }) => {
  const [logs, setLogs] = useState([]);

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
    
    return () => {
      delete window.__addDiagnosticLog;
    };
  }, []);

  return (
    <div className="diagnostic-log bg-black/30 p-4 rounded border border-puzzle-gold/50 mt-4 max-h-[200px] overflow-y-auto">
      <h3 className="text-puzzle-gold text-sm font-bold mb-2">React Diagnostic Log</h3>
      <div className="text-xs">
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
