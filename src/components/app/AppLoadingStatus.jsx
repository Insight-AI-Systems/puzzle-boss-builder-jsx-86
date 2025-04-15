
import React from 'react';
import Debug from '../Debug';
import Loading from '../ui/loading';

const AppLoadingStatus = ({ appMessage, appState, loadingStages, initLogs }) => (
  <div className="min-h-screen bg-puzzle-black text-white" data-state={appState}>
    <Debug message={appMessage} />
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Loading size="large" color="aqua" message={appMessage} />
      
      <div className="mt-4 w-64 bg-gray-900 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-puzzle-aqua h-2.5 rounded-full" 
          style={{ width: `${(loadingStages.filter(s => s.status === 'complete').length / loadingStages.length) * 100}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        {loadingStages.filter(s => s.status === 'complete').length}/{loadingStages.length} stages complete
      </p>
      
      <LoadingStatus stages={loadingStages} logs={initLogs} />
    </div>
  </div>
);

const LoadingStatus = ({ stages, logs }) => (
  <div className="mt-4 p-2 bg-black/20 rounded max-w-md w-full">
    <h3 className="text-sm font-bold text-puzzle-aqua mb-1">Loading Stage Status</h3>
    <div className="grid grid-cols-2 gap-2 mb-2">
      {stages.map((stage, i) => (
        <div key={i} className="flex items-center text-xs">
          <span className={`w-2 h-2 rounded-full mr-2 ${
            stage.status === 'complete' ? 'bg-green-500' : 
            stage.status === 'error' ? 'bg-red-500' : 
            stage.status === 'loading' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
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
    <div className="max-h-[100px] overflow-y-auto text-xs text-gray-400">
      {logs.slice(-5).map((log, i) => (
        <div key={i} className={`mb-1 ${log.isError ? 'text-red-400' : ''}`}>
          <span className="opacity-70">[{log.timestamp.split('T')[1].split('.')[0]}]</span> {log.message}
        </div>
      ))}
    </div>
  </div>
);

export default AppLoadingStatus;
