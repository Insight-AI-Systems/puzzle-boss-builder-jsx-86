
import React from 'react';
import Debug from '../Debug';
import { useAppMode } from '@/contexts/app-mode';
import Loading from '../ui/loading';

const AppErrorBoundary = ({ error, appMessage, appState, loadingStages, initLogs }) => {
  const { switchToMode } = useAppMode();
  
  const handleDismissWarning = () => {
    window.location.reload();
  };

  const handleSwitchToMinimal = () => {
    if (window.appRecovery && window.appRecovery.switchMode) {
      window.appRecovery.switchMode('minimal');
    } else {
      try {
        const url = new URL(window.location);
        url.searchParams.set('mode', 'minimal');
        window.location = url.toString();
      } catch (e) {
        console.error('Error switching to minimal mode:', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-puzzle-black text-white" data-state={appState}>
      <Debug message={`Error: ${appMessage}`} error={error} />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md p-6 border border-red-500 bg-black/80 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Application Error</h1>
          <p className="mb-4 text-gray-300">Sorry, something went wrong while loading the application.</p>
          <div className="p-3 bg-red-900/20 rounded mb-4">
            <p className="text-red-400">{error.message || String(error)}</p>
          </div>
          
          <div className="mb-4 flex gap-2">
            <button
              onClick={handleDismissWarning}
              className="flex-1 px-4 py-2 bg-puzzle-gold text-black rounded hover:bg-puzzle-gold/80 font-medium"
            >
              Continue Anyway
            </button>
            <button
              onClick={handleSwitchToMinimal}
              className="flex-1 px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80 font-medium"
            >
              Try Minimal Mode
            </button>
          </div>
          
          <LoadingStages stages={loadingStages} />
          <InitializationLog logs={initLogs} />
          
          <button
            onClick={() => {
              try {
                localStorage.removeItem('supabase.auth.token');
                sessionStorage.clear();
              } catch (e) {
                console.error('Error clearing storage:', e);
              }
              window.location.reload();
            }}
            className="w-full px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80 font-medium"
          >
            Reload Application
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingStages = ({ stages }) => (
  <div className="mb-4 p-2 bg-black/50 rounded text-left">
    <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Loading Stage Status</h3>
    <div className="max-h-[100px] overflow-y-auto text-xs">
      {stages.map((stage, i) => (
        <div key={i} className="mb-1 flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${
            stage.status === 'complete' ? 'bg-green-500' : 
            stage.status === 'error' ? 'bg-red-500' : 
            stage.status === 'loading' ? 'bg-yellow-500' : 'bg-gray-500'
          }`}></span>
          <span className="text-gray-300 flex-1">{stage.name}</span>
          <span className={`text-xs ${
            stage.status === 'complete' ? 'text-green-400' : 
            stage.status === 'error' ? 'text-red-400' : 
            stage.status === 'loading' ? 'text-yellow-400' : 'text-gray-400'
          }`}>
            {stage.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const InitializationLog = ({ logs }) => (
  <div className="mb-4 p-2 bg-black/50 rounded text-left">
    <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Initialization Log</h3>
    <div className="max-h-[100px] overflow-y-auto text-xs text-gray-400">
      {logs.map((log, i) => (
        <div key={i} className={`mb-1 ${log.isError ? 'text-red-400' : ''}`}>
          <span className="opacity-70">[{log.timestamp.split('T')[1].split('.')[0]}]</span> {log.message}
        </div>
      ))}
    </div>
  </div>
);

export default AppErrorBoundary;
