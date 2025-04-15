
import React from 'react';

const BootstrapError = ({ error, onReload, onSwitchToMinimal }) => (
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

export default BootstrapError;
