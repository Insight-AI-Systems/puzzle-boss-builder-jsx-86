
import React, { useState } from 'react';

const StandaloneApp = () => {
  const [errorMessage, setErrorMessage] = useState('');
  
  const clearAllStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setErrorMessage('Storage cleared successfully');
    } catch (e) {
      setErrorMessage('Error clearing storage: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <header className="text-center mb-8 p-4 border-b border-puzzle-aqua">
        <h1 className="text-3xl font-bold text-puzzle-aqua mb-2">The Puzzle Boss</h1>
        <p className="text-gray-400">Standalone Mode</p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-puzzle-gold mb-4">Application Status</h2>
          <div className="grid gap-4">
            <div className="p-3 bg-black/30 rounded">
              <strong className="block text-puzzle-aqua">Environment</strong>
              <span>{process.env.NODE_ENV || 'development'}</span>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <strong className="block text-puzzle-aqua">React Version</strong>
              <span>{React.version}</span>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <strong className="block text-puzzle-aqua">Browser</strong>
              <span>{navigator.userAgent}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-puzzle-gold mb-4">Application Controls</h2>
          <div className="space-y-4">
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
            <div className="flex gap-4">
              <a
                href="/"
                className="bg-puzzle-aqua text-black px-4 py-2 rounded hover:bg-puzzle-aqua/80"
              >
                Normal Mode
              </a>
              <a
                href="/?minimal=true"
                className="bg-puzzle-gold text-black px-4 py-2 rounded hover:bg-puzzle-gold/80"
              >
                Minimal Mode
              </a>
            </div>
          </div>
        </div>

        {/* Console Logs */}
        <div className="bg-gray-900/50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-puzzle-gold mb-4">Console Output</h2>
          <pre className="bg-black/30 p-4 rounded overflow-auto max-h-[200px] text-sm">
            {console.log("StandaloneApp rendered") || "Console logs will appear here"}
          </pre>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center mt-8 p-4 text-gray-400">
        <p>Running in standalone mode. This is a simplified version of the application.</p>
      </footer>
    </div>
  );
};

export default StandaloneApp;
