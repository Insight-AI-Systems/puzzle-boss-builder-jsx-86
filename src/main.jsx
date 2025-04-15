
// Minimal emergency application loader
import React from 'react';
import { createRoot } from 'react-dom/client';
import EmergencyApp from './EmergencyApp.jsx';
import StandaloneModeHandler from './components/StandaloneModeHandler.jsx';
import './index.css';

console.log('[EMERGENCY] Starting emergency application initialization', new Date().toISOString());

// Function to log errors to DOM for visibility
const logErrorToDOM = (error, source = 'Unknown') => {
  console.error(`[EMERGENCY:${source}] Error:`, error);
  
  try {
    const errorDisplay = document.createElement('div');
    errorDisplay.style.backgroundColor = '#800020';
    errorDisplay.style.color = 'white';
    errorDisplay.style.padding = '10px';
    errorDisplay.style.margin = '10px 0';
    errorDisplay.style.borderRadius = '4px';
    errorDisplay.innerHTML = `
      <h3>Error in ${source}</h3>
      <p>${error.message || String(error)}</p>
      ${error.stack ? `<pre style="white-space:pre-wrap;max-height:200px;overflow:auto;background:#111;padding:8px;font-size:12px">${error.stack}</pre>` : ''}
    `;
    
    // Try to add to diagnostics container first, fallback to body
    const diagnosticsEl = document.getElementById('emergency-diagnostics');
    if (diagnosticsEl) {
      diagnosticsEl.appendChild(errorDisplay);
    } else {
      document.body.appendChild(errorDisplay);
    }
  } catch (displayError) {
    console.error('[EMERGENCY] Failed to display error:', displayError);
  }
};

// Global error handlers - set up before anything else
window.onerror = function(message, source, lineno, colno, error) {
  logErrorToDOM(error || new Error(message), `Global (${source}:${lineno})`);
  return false; // Let other handlers run
};

window.addEventListener('unhandledrejection', function(event) {
  logErrorToDOM(event.reason || new Error('Unhandled Promise rejection'), 'Promise');
});

// Create a diagnostic container as fallback
try {
  if (!document.getElementById('emergency-diagnostics')) {
    const diagnosticsContainer = document.createElement('div');
    diagnosticsContainer.id = 'emergency-diagnostics';
    diagnosticsContainer.style.margin = '20px';
    diagnosticsContainer.style.padding = '10px';
    diagnosticsContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    diagnosticsContainer.style.color = '#00FFFF';
    diagnosticsContainer.style.fontFamily = 'monospace';
    document.body.appendChild(diagnosticsContainer);
  }
} catch (e) {
  console.error('[EMERGENCY] Failed to create diagnostics container:', e);
}

// Simple recovery utility
window.emergencyRecovery = {
  clearStorage: function() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      return 'Storage cleared';
    } catch (e) {
      return 'Error clearing storage: ' + e.message;
    }
  },
  reloadPage: function() {
    window.location.reload();
  }
};

// Handle different application modes
const determineAppMode = () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  const isMinimal = urlParams.get('minimal') === 'true';
  const isRecovery = urlParams.get('recovery') === 'true' || urlParams.get('debug') === 'true';
  
  console.log('[EMERGENCY] App mode detection:', { isStandalone, isMinimal, isRecovery });
  
  // Force emergency mode if there are specific error parameters
  const forceEmergency = urlParams.get('emergency') === 'true' || urlParams.get('force-emergency') === 'true';
  
  return {
    isStandalone,
    isMinimal,
    isRecovery,
    forceEmergency
  };
};

// Main app execution in try/catch
try {
  console.log('[EMERGENCY] Looking for root element...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found in DOM');
  }
  
  // Determine which mode to run in
  const { isStandalone, isMinimal, isRecovery, forceEmergency } = determineAppMode();
  
  console.log('[EMERGENCY] Creating root and rendering application...');
  try {
    const root = createRoot(rootElement);
    
    // Decide what to render based on mode
    if (forceEmergency) {
      console.log('[EMERGENCY] Forcing emergency mode due to URL parameter');
      root.render(<EmergencyApp />);
    } else if (isStandalone) {
      console.log('[EMERGENCY] Rendering in standalone mode');
      root.render(<StandaloneModeHandler />);
    } else {
      console.log('[EMERGENCY] Rendering emergency app as default recovery path');
      root.render(<EmergencyApp />);
    }
    
    console.log('[EMERGENCY] Application rendered successfully');
  } catch (renderError) {
    console.error('[EMERGENCY] Failed to render with createRoot:', renderError);
    
    // Legacy fallback if createRoot fails
    try {
      console.log('[EMERGENCY] Attempting legacy render fallback...');
      const ReactDOM = require('react-dom');
      if (ReactDOM.render) {
        ReactDOM.render(<EmergencyApp />, rootElement);
        console.log('[EMERGENCY] Legacy render successful');
      } else {
        throw new Error('Neither createRoot nor legacy render available');
      }
    } catch (legacyError) {
      console.error('[EMERGENCY] All React rendering methods failed:', legacyError);
      
      // Pure JS fallback if all React methods fail
      try {
        rootElement.innerHTML = `
          <div style="color: #FFD700; font-family: sans-serif; text-align: center; padding: 20px;">
            <h1>The Puzzle Boss - Critical Recovery</h1>
            <p style="color: #00FFFF;">React rendering failed completely. Using HTML fallback.</p>
            <div style="margin: 20px; padding: 15px; background: #111; text-align: left;">
              <h2 style="color: white;">Recovery Options:</h2>
              <button onclick="window.emergencyRecovery.clearStorage()" style="margin: 5px; padding: 8px; background: #800020; color: white; border: none; cursor: pointer;">
                Clear Storage
              </button>
              <button onclick="window.emergencyRecovery.reloadPage()" style="margin: 5px; padding: 8px; background: #00FFFF; color: black; border: none; cursor: pointer;">
                Reload Page
              </button>
              <button onclick="window.location.href='/?standalone=true'" style="margin: 5px; padding: 8px; background: #FFD700; color: black; border: none; cursor: pointer;">
                Standalone Mode
              </button>
            </div>
          </div>
        `;
      } catch (htmlError) {
        console.error('[EMERGENCY] Even HTML fallback failed:', htmlError);
      }
    }
  }
} catch (criticalError) {
  console.error('[EMERGENCY] Critical error during initialization:', criticalError);
  logErrorToDOM(criticalError, 'Initialization');
}
