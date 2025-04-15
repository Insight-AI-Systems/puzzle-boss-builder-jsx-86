
import React, { useState, useEffect } from 'react';
import { diagnostics } from './utils/diagnostics';

const StandaloneApp = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [envInfo, setEnvInfo] = useState(diagnostics.checkEnvironment());
  
  useEffect(() => {
    // Refresh environment info periodically
    const interval = setInterval(() => {
      setEnvInfo(diagnostics.checkEnvironment());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const clearAllStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setErrorMessage('Storage cleared successfully');
    } catch (e) {
      setErrorMessage('Error clearing storage: ' + e.message);
    }
  };

  const reloadApp = () => {
    window.location.reload();
  };

  const switchMode = (mode) => {
    const url = new URL(window.location.href);
    if (mode === 'standalone') {
      url.searchParams.set('standalone', 'true');
      url.searchParams.delete('minimal');
    } else if (mode === 'minimal') {
      url.searchParams.set('minimal', 'true');
      url.searchParams.delete('standalone');
    } else {
      url.searchParams.delete('standalone');
      url.searchParams.delete('minimal');
    }
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <header className="text-center mb-8 p-4 border-b border-puzzle-aqua">
        <h1 className="text-3xl font-bold text-puzzle-aqua mb-2">The Puzzle Boss</h1>
        <p className="text-gray-400">Standalone Mode</p>
        <div className="mt-2 flex justify-center gap-2">
          <button 
            onClick={reloadApp}
            className="px-3 py-1 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
          >
            Reload App
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-6">
        {/* Mode Switcher */}
        <div className="bg-gray-900/50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-puzzle-gold mb-4">Application Modes</h2>
          <div className="flex gap-4">
            <button onClick={() => switchMode('normal')} className="bg-puzzle-aqua text-black px-4 py-2 rounded hover:bg-puzzle-aqua/80">
              Normal Mode
            </button>
            <button onClick={() => switchMode('minimal')} className="bg-puzzle-gold text-black px-4 py-2 rounded hover:bg-puzzle-gold/80">
              Minimal Mode
            </button>
            <button onClick={() => switchMode('standalone')} className="bg-white text-black px-4 py-2 rounded hover:bg-white/80">
              Refresh Standalone
            </button>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-gray-900/50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-puzzle-gold mb-4">Environment Status</h2>
          <div className="grid gap-4">
            <div className="p-3 bg-black/30 rounded">
              <strong className="block text-puzzle-aqua">React Version</strong>
              <span>{envInfo.reactVersion}</span>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <strong className="block text-puzzle-aqua">Mode</strong>
              <span>{process.env.NODE_ENV}</span>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <strong className="block text-puzzle-aqua">Browser Storage</strong>
              <span>LocalStorage: {envInfo.hasLocalStorage ? 'Available' : 'Unavailable'}</span>
              <br />
              <span>SessionStorage: {envInfo.hasSessionStorage ? 'Available' : 'Unavailable'}</span>
            </div>
          </div>
        </div>

        {/* Storage Controls */}
        <div className="bg-gray-900/50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-puzzle-gold mb-4">Storage Controls</h2>
          <div>
            <button
              onClick={clearAllStorage}
              className="bg-puzzle-burgundy text-white px-4 py-2 rounded hover:bg-puzzle-burgundy/80"
            >
              Clear All Storage
            </button>
            {errorMessage && (
              <p className="mt-2 text-sm text-gray-400">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-center text-sm text-gray-500">
          Last Updated: {envInfo.timestamp}
        </div>
      </main>
    </div>
  );
};

export default StandaloneApp;
