
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';
import AppWrapper from './AppWrapper.jsx';
import './index.css';

// More detailed initialization logging with timing
console.log('%c[PUZZLE BOSS] Initializing application', 'color: #00FFFF; font-weight: bold;', new Date().toISOString());

// Environment information for debugging
const envInfo = {
  NODE_ENV: process.env.NODE_ENV,
  userAgent: navigator.userAgent,
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  timestamp: new Date().toISOString()
};

console.log('[PUZZLE BOSS] Environment:', envInfo);

// Define a timeout to detect stalled loading
let loadingTimeout = setTimeout(() => {
  console.error('[PUZZLE BOSS] Loading timeout reached - Application may be stalled');
  // Try to identify why we might be stalled
  console.log('[PUZZLE BOSS] Current DOM state:', {
    rootElement: document.getElementById('root'),
    bodyChildren: document.body.children.length,
    documentReady: document.readyState
  });
}, 10000);

// Try/catch block to catch initialization errors
try {
  console.log('[PUZZLE BOSS] Searching for root element...', new Date().toISOString());
  const rootElement = document.getElementById('root');

  if (rootElement) {
    console.log('[PUZZLE BOSS] Root element found, checking current state');
    console.log('[PUZZLE BOSS] Root content before render:', rootElement.innerHTML);
    
    // Create and render the app with explicit error handling
    console.log('[PUZZLE BOSS] Creating root and rendering app...', new Date().toISOString());
    
    const root = createRoot(rootElement);
    
    // Wrap rendering in another try/catch for more specific error logging
    try {
      root.render(
        <StrictMode>
          <AppWrapper>
            <App />
          </AppWrapper>
        </StrictMode>
      );
      console.log('%c[PUZZLE BOSS] Initial render complete', 'color: #00FFFF; font-weight: bold;', new Date().toISOString());
      clearTimeout(loadingTimeout); // Clear the timeout as render was successful
      loadingTimeout = null;
    } catch (renderError) {
      console.error('[PUZZLE BOSS] Error during render:', renderError);
      clearTimeout(loadingTimeout); // Clear the timeout as we already have an error
      loadingTimeout = null;
      
      // Show a more visible error message
      rootElement.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #000000; color: #FF0000; font-family: sans-serif; padding: 20px; text-align: center;">
          <div>
            <h1 style="color: #FF0000; margin-bottom: 20px;">The Puzzle Boss - Render Error</h1>
            <p style="margin-bottom: 15px;">Error during rendering: ${renderError.message || 'Unknown render error'}</p>
            <code style="display: block; background: #222; padding: 15px; border-radius: 5px; margin: 15px 0; white-space: pre-wrap; text-align: left; max-height: 200px; overflow: auto;">${renderError.stack || 'No stack trace available'}</code>
            <button onclick="window.location.reload()" style="background: #00FFFF; color: #000000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Reload Page</button>
          </div>
        </div>
      `;
    }
  } else {
    console.error('[PUZZLE BOSS] Critical: Root element not found in DOM');
    clearTimeout(loadingTimeout); // Clear the timeout as we already have an error
    loadingTimeout = null;
    
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #000000; color: #FF0000; font-family: sans-serif; padding: 20px; text-align: center;">
        <div>
          <h1 style="color: #FF0000; margin-bottom: 20px;">The Puzzle Boss - Critical Error</h1>
          <p style="margin-bottom: 15px;">Could not find the root element for mounting the application.</p>
          <p style="margin-bottom: 15px;">This could be due to a configuration issue or a problem with the HTML structure.</p>
          <button onclick="window.location.reload()" style="background: #00FFFF; color: #000000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Reload Page</button>
        </div>
      </div>
    `;
  }
} catch (error) {
  console.error('[PUZZLE BOSS] Fatal initialization error:', error);
  clearTimeout(loadingTimeout); // Clear the timeout as we already have an error
  loadingTimeout = null;
  
  // Try to display an error message on the page
  try {
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #000000; color: #FF0000; font-family: sans-serif; padding: 20px; text-align: center;">
        <div>
          <h1 style="color: #FF0000; margin-bottom: 20px;">The Puzzle Boss - Fatal Error</h1>
          <p style="margin-bottom: 15px;">${error.message || 'Unknown error'}</p>
          <code style="display: block; background: #222; padding: 15px; border-radius: 5px; margin: 15px 0; white-space: pre-wrap; text-align: left; max-height: 200px; overflow: auto;">${error.stack || 'No stack trace available'}</code>
          <button onclick="window.location.reload()" style="background: #00FFFF; color: #000000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Reload Page</button>
        </div>
      </div>
    `;
  } catch (displayError) {
    console.error('[PUZZLE BOSS] Failed to display error message:', displayError);
  }
}

// Expose a global variable to help with debugging from the console
window.__puzzleBossDebug = {
  timestamp: new Date().toISOString(),
  environment: envInfo,
  checkState: () => {
    console.log('Current app state:', {
      rootExists: Boolean(document.getElementById('root')),
      appWrapperRendered: Boolean(document.querySelector('.app-wrapper')),
      appState: document.querySelector('.app-wrapper')?.dataset?.state || 'unknown',
      routerInitialized: Boolean(window.location && window.location.pathname),
      documentReady: document.readyState
    });
  }
};

console.log('[PUZZLE BOSS] Debug helper available at window.__puzzleBossDebug');
