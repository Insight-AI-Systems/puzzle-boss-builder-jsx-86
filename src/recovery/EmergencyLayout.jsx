
import React from 'react';
import EmergencyBanner from './EmergencyBanner';

/**
 * Main layout component for emergency mode
 * Provides consistent structure for all emergency views
 */
const EmergencyLayout = ({ children, appMode }) => {
  return (
    <div className="emergency-layout bg-puzzle-black min-h-screen text-puzzle-aqua">
      <EmergencyBanner appMode={appMode} />
      
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-puzzle-gold">
            The Puzzle Boss - Emergency Recovery
          </h1>
          <p className="text-lg opacity-80">
            System diagnostics and recovery tools
          </p>
        </header>
        
        <main>
          {children}
        </main>
        
        <footer className="mt-12 pt-6 border-t border-puzzle-aqua/20 text-center text-sm opacity-60">
          <p>The Puzzle Boss - Emergency Recovery System v1.2</p>
          <p className="mt-1">
            <button 
              onClick={() => {
                if (typeof window.tbRecovery === 'object' && window.tbRecovery.show) {
                  window.tbRecovery.show();
                } else {
                  alert('Recovery script not loaded. Try reloading the page with ?recovery=true');
                }
              }}
              className="text-puzzle-gold underline"
            >
              Advanced Recovery Options
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default EmergencyLayout;
