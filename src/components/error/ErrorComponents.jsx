
import React from 'react';
import { X } from 'lucide-react';
import Loading from '../ui/loading';

// General purpose error message component
export const ErrorMessage = ({ 
  title = "Error", 
  message, 
  className = "" 
}) => (
  <div className={`p-4 bg-puzzle-burgundy/20 border border-puzzle-burgundy rounded text-white ${className}`}>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-300">{message}</p>
  </div>
);

// Component for displaying bootstrap/initialization errors
export const BootstrapError = ({ 
  error, 
  onReload, 
  onSwitchToMinimal 
}) => (
  <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center p-4">
    <div className="max-w-md p-6 bg-black/30 rounded-lg border border-red-500 text-center">
      <h2 className="text-xl text-puzzle-gold mb-4">Bootstrap Error</h2>
      <p className="text-white mb-4">There was a problem loading the application:</p>
      <div className="bg-red-900/20 p-3 rounded mb-4">
        <p className="text-red-400">{error.message}</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <button
          className="w-full bg-puzzle-aqua text-black px-4 py-2 rounded"
          onClick={onReload}
        >
          Reload Application
        </button>
        <button
          className="w-full bg-puzzle-gold text-black px-4 py-2 rounded"
          onClick={onSwitchToMinimal}
        >
          Try Minimal Mode
        </button>
      </div>
    </div>
  </div>
);

// Component for timeout warnings
export const TimeoutWarning = ({
  message,
  elapsedTime,
  onContinue,
  onSwitchToMinimal,
  onDismiss
}) => (
  <div className="fixed bottom-4 right-4 bg-puzzle-gold text-black p-4 rounded-lg shadow-lg z-50 max-w-xs">
    <h4 className="font-bold mb-1">Loading Timeout Warning</h4>
    <p className="text-sm mb-2">{message}</p>
    <p className="text-xs mb-2">Elapsed time: {Math.round(elapsedTime / 100) / 10}s</p>
    <div className="flex justify-end gap-2">
      <button 
        onClick={onDismiss}
        className="px-3 py-1 bg-black text-white text-sm rounded"
      >
        Dismiss
      </button>
      <button 
        onClick={onContinue}
        className="px-3 py-1 bg-puzzle-aqua text-black text-sm rounded"
      >
        Continue
      </button>
      <button 
        onClick={onSwitchToMinimal}
        className="px-3 py-1 bg-puzzle-burgundy text-white text-sm rounded"
      >
        Minimal Mode
      </button>
    </div>
  </div>
);

// Component for loading errors with diagnostic info
export const LoadingError = ({
  error,
  diagnosticInfo,
  onRetry,
  onSwitchMode
}) => (
  <div className="p-6 bg-black/30 rounded-lg border border-puzzle-burgundy">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl text-puzzle-burgundy font-bold">Loading Error</h3>
      <button
        onClick={onRetry}
        className="px-3 py-1 bg-puzzle-aqua text-black rounded text-sm"
      >
        Retry
      </button>
    </div>
    
    <div className="bg-black/40 p-3 rounded mb-4">
      <p className="text-red-400">{error.message}</p>
      {error.stack && (
        <pre className="mt-2 text-xs text-gray-400 overflow-x-auto">
          {error.stack}
        </pre>
      )}
    </div>
    
    {diagnosticInfo && (
      <div className="mb-4 text-sm">
        <h4 className="text-puzzle-aqua font-bold mb-2">Diagnostic Information:</h4>
        <pre className="bg-black/40 p-2 rounded text-xs text-gray-400">
          {JSON.stringify(diagnosticInfo, null, 2)}
        </pre>
      </div>
    )}
    
    <button
      onClick={onSwitchMode}
      className="w-full bg-puzzle-gold text-black px-4 py-2 rounded"
    >
      Switch to Minimal Mode
    </button>
  </div>
);

// Component for failed component rendering
export const ComponentError = ({
  componentName,
  error,
  onReset
}) => (
  <div className="p-4 bg-puzzle-burgundy/20 border border-puzzle-burgundy rounded">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-white">
        Error in {componentName}
      </h3>
      {onReset && (
        <button
          onClick={onReset}
          className="p-1 hover:bg-black/20 rounded"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
    <p className="text-red-400 text-sm mb-2">{error.message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-3 py-1 bg-puzzle-aqua text-black rounded text-sm"
    >
      Reload Page
    </button>
  </div>
);

// Component for initialization errors
export const InitializationError = ({
  error,
  context,
  onRetry,
  loadingSteps = []
}) => (
  <div className="p-6 bg-black/30 rounded-lg border border-red-500">
    <h3 className="text-xl text-red-500 font-bold mb-4">
      Initialization Error: {context}
    </h3>
    
    <div className="bg-black/40 p-3 rounded mb-4">
      <p className="text-red-400">{error.message}</p>
    </div>
    
    {loadingSteps.length > 0 && (
      <div className="mb-4">
        <h4 className="text-sm font-bold text-puzzle-aqua mb-2">Loading Progress:</h4>
        <div className="space-y-1">
          {loadingSteps.map((step, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                step.status === 'completed' ? 'bg-green-500' :
                step.status === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
              }`} />
              <span className="text-gray-400">{step.stage}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    
    <div className="flex gap-2">
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-1 px-4 py-2 bg-puzzle-aqua text-black rounded"
        >
          Retry
        </button>
      )}
      <button
        onClick={() => window.location.reload()}
        className="flex-1 px-4 py-2 bg-puzzle-burgundy text-white rounded"
      >
        Reload Application
      </button>
    </div>
  </div>
);

