
// Minimal emergency application loader
import React from 'react';
import { createRoot } from 'react-dom/client';
import EmergencyApp from './EmergencyApp.jsx';
import MinimalApp from './MinimalApp.jsx';
import App from './App.jsx';
import StandaloneModeHandler from './components/StandaloneModeHandler.jsx';
import './index.css';

console.log('[STARTUP] Starting application initialization', new Date().toISOString());

// Function to log errors to DOM for visibility
const logErrorToDOM = (error, source = 'Unknown') => {
  console.error(`[STARTUP:${source}] Error:`, error);
  
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
    const diagnosticsEl = document.getElementById('startup-diagnostics');
    if (diagnosticsEl) {
      diagnosticsEl.appendChild(errorDisplay);
    } else {
      document.body.appendChild(errorDisplay);
    }
  } catch (displayError) {
    console.error('[STARTUP] Failed to display error:', displayError);
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
  if (!document.getElementById('startup-diagnostics')) {
    const diagnosticsContainer = document.createElement('div');
    diagnosticsContainer.id = 'startup-diagnostics';
    diagnosticsContainer.style.margin = '20px';
    diagnosticsContainer.style.padding = '10px';
    diagnosticsContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    diagnosticsContainer.style.color = '#00FFFF';
    diagnosticsContainer.style.fontFamily = 'monospace';
    document.body.appendChild(diagnosticsContainer);
  }
} catch (e) {
  console.error('[STARTUP] Failed to create diagnostics container:', e);
}

// Enhanced recovery utilities
window.appRecovery = {
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
  },
  switchMode: function(mode) {
    try {
      // Save the last mode attempt to localStorage
      localStorage.setItem('app-last-mode', mode);
      
      // Set URL parameter and reload
      const url = new URL(window.location);
      url.searchParams.set('mode', mode);
      window.location = url.toString();
    } catch (e) {
      console.error('[STARTUP] Error switching mode:', e);
      return 'Error switching mode: ' + e.message;
    }
  }
};

// Determine which app mode to use
const determineAppMode = () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check URL parameters first
  const modeParam = urlParams.get('mode');
  if (modeParam) {
    if (['emergency', 'minimal', 'normal', 'standalone'].includes(modeParam)) {
      console.log(`[STARTUP] Using mode from URL parameter: ${modeParam}`);
      return modeParam;
    }
  }
  
  // Check specific flags
  if (urlParams.get('emergency') === 'true') return 'emergency';
  if (urlParams.get('minimal') === 'true') return 'minimal';
  if (urlParams.get('standalone') === 'true') return 'standalone';
  
  // Check localStorage for last successful mode
  try {
    const lastMode = localStorage.getItem('app-last-successful-mode');
    if (lastMode && lastMode !== 'emergency') {
      console.log(`[STARTUP] Using last successful mode from localStorage: ${lastMode}`);
      return lastMode;
    }
  } catch (e) {
    console.error('[STARTUP] Error reading from localStorage:', e);
  }
  
  // Default to emergency mode during development for safety
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    console.log('[STARTUP] Development environment detected, defaulting to emergency mode for safety');
    return 'emergency';
  }
  
  // Default to normal mode for production
  return 'normal';
};

// Track render timing for diagnostics
let renderStartTime = Date.now();
let hasLogged = false;

// Main app execution in try/catch
try {
  console.log('[STARTUP] Looking for root element...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found in DOM');
  }
  
  // Determine which mode to run in
  const appMode = determineAppMode();
  console.log(`[STARTUP] Starting in ${appMode} mode`);
  
  console.log('[STARTUP] Creating root and rendering application...');
  try {
    const root = createRoot(rootElement);
    
    // Render the appropriate component based on mode
    switch (appMode) {
      case 'emergency':
        console.log('[STARTUP] Rendering in emergency mode');
        root.render(<EmergencyApp />);
        break;
        
      case 'minimal':
        console.log('[STARTUP] Rendering in minimal mode');
        root.render(<MinimalApp />);
        break;
        
      case 'standalone':
        console.log('[STARTUP] Rendering in standalone mode');
        root.render(<StandaloneModeHandler />);
        break;
        
      case 'normal':
      default:
        console.log('[STARTUP] Rendering in normal mode');
        
        // Set up a safety timeout for normal mode
        const timeoutId = setTimeout(() => {
          if (!hasLogged) {
            hasLogged = true;
            const renderTime = Date.now() - renderStartTime;
            console.error(`[STARTUP] Normal mode render timeout after ${renderTime}ms`);
            
            // Create a UI widget to allow switching to emergency mode
            try {
              const timeoutMsg = document.createElement('div');
              timeoutMsg.style.position = 'fixed';
              timeoutMsg.style.bottom = '20px';
              timeoutMsg.style.right = '20px';
              timeoutMsg.style.backgroundColor = '#800020';
              timeoutMsg.style.color = 'white';
              timeoutMsg.style.padding = '15px';
              timeoutMsg.style.borderRadius = '5px';
              timeoutMsg.style.zIndex = '9999';
              timeoutMsg.className = 'minimal-app-timeout-message';
              
              timeoutMsg.innerHTML = `
                <h3 style="margin-top:0">Rendering Timeout</h3>
                <p>The application is taking longer than expected to load.</p>
                <div>
                  <button onclick="window.appRecovery.switchMode('emergency')" 
                    style="background:#FFD700;color:black;border:none;padding:5px 10px;margin-right:5px;cursor:pointer;border-radius:3px">
                    Switch to Emergency Mode
                  </button>
                  <button onclick="window.appRecovery.switchMode('minimal')" 
                    style="background:#00FFFF;color:black;border:none;padding:5px 10px;margin-right:5px;cursor:pointer;border-radius:3px">
                    Try Minimal Mode
                  </button>
                  <button onclick="this.parentNode.parentNode.remove()" 
                    style="background:transparent;color:white;border:1px solid white;padding:5px 10px;cursor:pointer;border-radius:3px">
                    Dismiss
                  </button>
                </div>
              `;
              
              document.body.appendChild(timeoutMsg);
            } catch (e) {
              console.error('[STARTUP] Failed to create timeout message:', e);
            }
          }
        }, 7000); // 7 second timeout
        
        // Render the normal app
        root.render(<App />);
        
        // Set up success callback
        setTimeout(() => {
          clearTimeout(timeoutId);
          if (!hasLogged) {
            hasLogged = true;
            const renderTime = Date.now() - renderStartTime;
            console.log(`[STARTUP] Normal mode rendered successfully in ${renderTime}ms`);
            
            // Mark this mode as successful
            try {
              localStorage.setItem('app-last-successful-mode', 'normal');
            } catch (e) {
              console.error('[STARTUP] Failed to save successful mode:', e);
            }
          }
        }, 1000);
        break;
    }
    
    console.log('[STARTUP] Application render started');
  } catch (renderError) {
    console.error('[STARTUP] Failed to render with createRoot:', renderError);
    
    // Legacy fallback if createRoot fails
    try {
      console.log('[STARTUP] Attempting legacy render fallback...');
      const ReactDOM = require('react-dom');
      if (ReactDOM.render) {
        ReactDOM.render(<EmergencyApp />, rootElement);
        console.log('[STARTUP] Legacy render successful');
      } else {
        throw new Error('Neither createRoot nor legacy render available');
      }
    } catch (legacyError) {
      console.error('[STARTUP] All React rendering methods failed:', legacyError);
      
      // Pure JS fallback if all React methods fail
      try {
        rootElement.innerHTML = `
          <div style="color: #FFD700; font-family: sans-serif; text-align: center; padding: 20px;">
            <h1>The Puzzle Boss - Critical Recovery</h1>
            <p style="color: #00FFFF;">React rendering failed completely. Using HTML fallback.</p>
            <div style="margin: 20px; padding: 15px; background: #111; text-align: left;">
              <h2 style="color: white;">Recovery Options:</h2>
              <button onclick="window.appRecovery.clearStorage()" style="margin: 5px; padding: 8px; background: #800020; color: white; border: none; cursor: pointer;">
                Clear Storage
              </button>
              <button onclick="window.appRecovery.reloadPage()" style="margin: 5px; padding: 8px; background: #00FFFF; color: black; border: none; cursor: pointer;">
                Reload Page
              </button>
              <button onclick="window.appRecovery.switchMode('emergency')" style="margin: 5px; padding: 8px; background: #FFD700; color: black; border: none; cursor: pointer;">
                Emergency Mode
              </button>
            </div>
          </div>
        `;
      } catch (htmlError) {
        console.error('[STARTUP] Even HTML fallback failed:', htmlError);
      }
    }
  }
} catch (criticalError) {
  console.error('[STARTUP] Critical error during initialization:', criticalError);
  logErrorToDOM(criticalError, 'Initialization');
}
