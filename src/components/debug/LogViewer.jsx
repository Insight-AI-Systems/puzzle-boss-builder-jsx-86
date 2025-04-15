
import React from 'react';

const LogViewer = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <p className="text-gray-500 italic">No logs captured yet</p>
    );
  }

  return (
    <div className="text-xs max-h-[200px] overflow-y-auto">
      {logs.map((log, index) => (
        <div 
          key={index} 
          className={`p-1 border-l-2 mb-1 ${
            log.type === 'error' 
              ? 'border-red-500 text-red-300 bg-red-900/20' 
              : log.type === 'warn'
                ? 'border-yellow-500 text-yellow-300 bg-yellow-900/20'
                : 'border-gray-500 text-white'
          }`}
        >
          <span className="text-gray-400 mr-1">{log.timestamp.split('T')[1].split('.')[0]}</span>
          <span>{log.message}</span>
        </div>
      ))}
    </div>
  );
};

export default LogViewer;
