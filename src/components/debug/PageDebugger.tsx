
import React from 'react';
import { debugLog, DebugLevel } from '@/utils/debug';

interface PageDebuggerProps {
  componentName: string;
}

export const PageDebugger: React.FC<PageDebuggerProps> = ({ componentName }) => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Basic debug info without auth dependency
  React.useEffect(() => {
    debugLog('PageDebugger', `${componentName} rendered`, DebugLevel.DEBUG, {
      component: componentName,
      timestamp: new Date().toISOString()
    });
  }, [componentName]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded max-w-xs">
      <div className="font-bold">{componentName} Debug</div>
      <div>Status: Rendered</div>
      <div>Auth: Not configured</div>
      <div>Time: {new Date().toLocaleTimeString()}</div>
    </div>
  );
};
