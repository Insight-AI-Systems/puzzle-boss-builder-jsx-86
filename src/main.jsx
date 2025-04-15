
// Simplify imports to only what's needed for minimal rendering
import React from 'react';
import { createRoot } from 'react-dom/client';
import MinimalApp from './MinimalApp.jsx';
import { AppModeProvider, getAppMode } from './contexts/app-mode';
import './index.css';

// Add detailed console logs to track initialization
console.log('[MINIMAL APP] Starting application initialization', new Date().toISOString());
console.log('[MINIMAL APP] React version:', React?.version || 'unknown');

// Track performance
const startTime = performance.now();

// Try to get diagnostic settings from local storage
let diagnosticSettings = {
  enabled: true,
  timeout: 10000, // Increased timeout to 10 seconds
  showWarnings: true
};

try {
  const storedSettings = localStorage.getItem('diagnostic-settings');
  if (storedSettings) {
    diagnosticSettings = JSON.parse(storedSettings);
  }
} catch (error) {
  console.error('[MINIMAL APP] Error loading diagnostic settings:', error);
}

// Enhanced global error handler for uncaught exceptions with line numbers
window.onerror = function(message, source, lineno, colno, error) {
  console.error('[MINIMAL APP] Global error:', {message, source, lineno, colno, errorObject: error});
  
  // Extract filename from source URL for cleaner display
  const filename = source ? source.split('/').pop() : 'unknown';
  
  // Try to display error on screen with improved information
  try {
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.innerHTML = `
        <div style="padding: 20px; background: #800020; color: white; font-family: sans-serif; border-radius: 5px; margin: 20px;">
          <h2>JavaScript Error Detected</h2>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>File:</strong> ${filename}</p>
          <p><strong>Location:</strong> Line ${lineno}, Column ${colno}</p>
          <pre style="background: rgba(0,0,0,0.3); padding: 10px; overflow: auto; max-height: 200px; margin-top: 10px; white-space: pre-wrap;">${error?.stack || 'No stack trace available'}</pre>
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button onclick="location.reload()" style="background: #00FFFF; color: black; border: none; padding: 10px 15px; cursor: pointer; border-radius: 5px;">
              Reload Page
            </button>
            <button onclick="location.href='?standalone=true'" style="background: #FFD700; color: black; border: none; padding: 10px 15px; cursor: pointer; border-radius: 5px;">
              Try Standalone Mode
            </button>
          </div>
        </div>
      `;
    }
  } catch (displayError) {
    console.error('[MINIMAL APP] Failed to display error:', displayError);
  }
  
  return false;
};

// Enhanced unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('[MINIMAL APP] Unhandled promise rejection:', event.reason);
  // Try to log it to the diagnostic log if available
  if (window.__addDiagnosticLog) {
    window.__addDiagnosticLog(`Unhandled promise rejection: ${event.reason?.message || 'Unknown promise error'}`);
  }
});

// Function to check for dismissed warnings
const isWarningDismissed = (warningId) => {
  try {
    const dismissedWarnings = localStorage.getItem('dismissed-warnings');
    if (dismissedWarnings) {
      return JSON.parse(dismissedWarnings).includes(warningId);
    }
  } catch (e) {
    console.error('[MINIMAL APP] Error checking dismissed warnings:', e);
  }
  return false;
};

// Execute render in a try/catch block
try {
  console.log('[MINIMAL APP] Looking for root element...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found in DOM');
  }
  
  console.log('[MINIMAL APP] Creating root and rendering minimal app...');
  
  // Wrap the app with AppModeProvider to ensure context is available
  const root = createRoot(rootElement);
  
  console.log('[MINIMAL APP] Root created, about to render with AppModeProvider...');
  
  // Determine if we should use the AppModeProvider or render in standalone mode
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  
  if (isStandalone) {
    root.render(<MinimalApp isStandalone={true} />);
  } else {
    root.render(
      <AppModeProvider>
        <MinimalApp />
      </AppModeProvider>
    );
  }
  
  console.log('[MINIMAL APP] Render call completed');
  
  // Log performance metrics
  const renderTime = performance.now() - startTime;
  console.log(`[MINIMAL APP] Initial render took ${renderTime.toFixed(2)}ms`);
  
  // Clear the initialization timeout
  if (window.__clearMinimalAppTimeout) {
    window.__clearMinimalAppTimeout();
  }
  
} catch (error) {
  console.error('[MINIMAL APP] Critical error during initialization:', error);
  
  // Try to show error on screen with improved error details
  try {
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #000000; color: #FF0000; font-family: sans-serif; padding: 20px; text-align: center;">
        <div>
          <h1 style="color: #FF0000; margin-bottom: 20px;">The Puzzle Boss - Critical Error</h1>
          <p style="margin-bottom: 15px;">${error.message || 'Unknown initialization error'}</p>
          <div style="background: #222; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: left; max-height: 200px; overflow: auto;">
            <p><strong>Error Type:</strong> ${error.name || 'Unknown'}</p>
            <p><strong>Stack Trace:</strong></p>
            <code style="display: block; white-space: pre-wrap;">${error.stack || 'No stack trace available'}</code>
          </div>
          <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
            <button onclick="window.location.reload()" style="background: #00FFFF; color: #000000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
              Reload Page
            </button>
            <button onclick="window.location.href='?standalone=true'" style="background: #FFD700; color: #000000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
              Try Standalone Mode
            </button>
          </div>
        </div>
      </div>
    `;
  } catch (displayError) {
    console.error('[MINIMAL APP] Failed to display error:', displayError);
  }
}

// Create a timeout to detect if rendering hangs, using the configurable timeout
const renderTimeout = setTimeout(() => {
  // Skip if warnings are disabled or this specific warning is dismissed
  if (!diagnosticSettings.showWarnings || isWarningDismissed('render-timeout')) {
    console.log('[MINIMAL APP] Render timeout reached but warnings are disabled');
    return;
  }
  
  console.warn('[MINIMAL APP] Render timeout reached - application may be stalled');
  
  // Check what's in the DOM
  const rootContent = document.getElementById('root')?.innerHTML || 'Empty';
  console.log('[MINIMAL APP] Current root content:', rootContent);
  
  // Try to display a message with dismiss option
  try {
    const rootEl = document.getElementById('root');
    if (rootEl && !rootEl.querySelector('.minimal-app-timeout-message')) {
      rootEl.innerHTML += `
        <div class="minimal-app-timeout-message" style="position: fixed; bottom: 10px; right: 10px; background: #FFD700; color: black; padding: 10px; border-radius: 5px; max-width: 300px; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          <p style="margin: 0 0 8px 0;"><strong>Warning:</strong> Rendering timeout reached.</p>
          <p style="margin: 0 0 8px 0; font-size: 0.9em;">Check console for details</p>
          <div style="display: flex; justify-content: space-between; gap: 8px;">
            <button 
              onclick="this.parentNode.parentNode.remove(); localStorage.setItem('dismissed-warnings', JSON.stringify([...JSON.parse(localStorage.getItem('dismissed-warnings') || '[]'), 'render-timeout']))" 
              style="background: #800020; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size: 0.9em;">
              Don't Show Again
            </button>
            <button onclick="location.reload()" style="background: #00FFFF; color: black; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-size: 0.9em;">
              Reload
            </button>
          </div>
        </div>
      `;
    }
  } catch (e) {
    console.error('[MINIMAL APP] Failed to add timeout message:', e);
  }
}, diagnosticSettings.timeout || 10000); // Use configured timeout or default to 10 seconds

// Expose a cleanup function to be called when rendering is complete
window.__clearMinimalAppTimeout = () => {
  console.log('[MINIMAL APP] Clearing render timeout - rendering completed successfully');
  clearTimeout(renderTimeout);
};
