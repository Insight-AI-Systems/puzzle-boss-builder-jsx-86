
import React, { useState } from 'react';

/**
 * Emergency banner component that displays at the top of the application
 * in emergency mode with critical controls
 */
const EmergencyBanner = ({ appMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className={`emergency-banner ${collapsed ? 'collapsed' : ''}`}
      style={{
        backgroundColor: '#800020',
        color: 'white',
        borderBottom: '2px solid #FFD700',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold">⚠️ EMERGENCY MODE</span>
            <span className="text-sm">
              {appMode ? `Mode: ${appMode}` : 'Application in recovery mode'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-3 py-1 bg-black/30 text-white text-sm rounded hover:bg-black/50"
            >
              Home
            </button>
            <button 
              onClick={() => window.location.href = '/?standalone=true'}
              className="px-3 py-1 bg-black/30 text-white text-sm rounded hover:bg-black/50"
            >
              Standalone
            </button>
            <button 
              onClick={() => {
                if (window.localStorage) localStorage.clear();
                if (window.sessionStorage) sessionStorage.clear();
                alert('Storage cleared successfully!');
              }}
              className="px-3 py-1 bg-black/40 text-white text-sm rounded hover:bg-black/60"
            >
              Clear Storage
            </button>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="px-2 py-1 bg-black/20 text-white text-sm rounded"
            >
              {collapsed ? 'Expand' : 'Collapse'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
