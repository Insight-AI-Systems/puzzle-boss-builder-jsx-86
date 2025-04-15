
import React from 'react';

const RecoveryTab = ({ clearAllStorage, diagnosticData }) => {
  return (
    <div>
      <h2 className="text-2xl mb-4">Recovery Tools</h2>
      <div className="grid gap-6">
        <div className="bg-black/30 p-4 rounded border-l-4 border-puzzle-gold">
          <h3 className="text-xl text-puzzle-gold mb-2">Clear Browser Storage</h3>
          <p className="mb-4">This will clear all localStorage, sessionStorage, and cookies for this site.</p>
          <button 
            onClick={clearAllStorage}
            className="px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
          >
            Clear All Storage
          </button>
          {diagnosticData.message && (
            <p className="mt-3 text-puzzle-aqua">{diagnosticData.message}</p>
          )}
        </div>
        
        <div className="bg-black/30 p-4 rounded border-l-4 border-puzzle-aqua">
          <h3 className="text-xl text-puzzle-aqua mb-2">Application Modes</h3>
          <p className="mb-4">Launch application in different modes:</p>
          <div className="flex flex-wrap gap-2">
            <a 
              href="/"
              className="px-4 py-2 bg-black/50 text-puzzle-aqua rounded hover:bg-black/70"
            >
              Normal Mode
            </a>
            <a 
              href="/?standalone=true"
              className="px-4 py-2 bg-black/50 text-puzzle-gold rounded hover:bg-black/70"
            >
              Standalone Mode
            </a>
            <a 
              href="/?minimal=true"
              className="px-4 py-2 bg-black/50 text-white rounded hover:bg-black/70"
            >
              Minimal Mode
            </a>
            <a 
              href="/?recovery=true"
              className="px-4 py-2 bg-black/50 text-orange-400 rounded hover:bg-black/70"
            >
              Recovery Mode
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-black/50 text-puzzle-aqua rounded hover:bg-black/70"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryTab;
