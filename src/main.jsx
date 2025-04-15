
import React from 'react';
import { createRoot } from 'react-dom/client';
import EmergencyApp from './EmergencyApp';
import MinimalApp from './MinimalApp';
import App from './App';
import StandaloneModeHandler from './components/StandaloneModeHandler';
import FallbackHTML from './components/FallbackHTML';
import { initializeRecoveryUtils } from './utils/recoveryUtils';
import { determineAppMode } from './utils/modeUtils';
import { logErrorToDOM, createDiagnosticsContainer } from './utils/errorUtils';
import './index.css';

console.log('[STARTUP] Starting application initialization', new Date().toISOString());

// Set up global error handlers
window.onerror = function(message, source, lineno, colno, error) {
  logErrorToDOM(error || new Error(message), `Global (${source}:${lineno})`);
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  logErrorToDOM(event.reason || new Error('Unhandled Promise rejection'), 'Promise');
});

// Initialize recovery utilities and diagnostics
initializeRecoveryUtils();
createDiagnosticsContainer();

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
        root.render(<App />);
        break;
    }
    
    console.log('[STARTUP] Application render started');
  } catch (renderError) {
    console.error('[STARTUP] Failed to render with createRoot:', renderError);
    
    // Pure JS fallback if all React methods fail
    try {
      rootElement.innerHTML = ReactDOMServer.renderToString(<FallbackHTML />);
    } catch (htmlError) {
      console.error('[STARTUP] Even HTML fallback failed:', htmlError);
    }
  }
} catch (criticalError) {
  console.error('[STARTUP] Critical error during initialization:', criticalError);
  logErrorToDOM(criticalError, 'Initialization');
}
