
// Simplify imports to only what's needed for minimal rendering
import { createRoot } from 'react-dom/client';
import MinimalApp from './MinimalApp.jsx';
import './index.css';

// Add detailed console logs to track initialization
console.log('[MINIMAL APP] Starting application initialization', new Date().toISOString());

// Global error handler for uncaught exceptions
window.onerror = function(message, source, lineno, colno, error) {
  console.error('[MINIMAL APP] Global error:', {message, source, lineno, colno, errorObject: error});
  
  // Try to display error on screen
  try {
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.innerHTML = `
        <div style="padding: 20px; background: #800020; color: white; font-family: sans-serif; border-radius: 5px; margin: 20px;">
          <h2>JavaScript Error Detected</h2>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Source:</strong> ${source}</p>
          <p><strong>Line/Column:</strong> ${lineno}:${colno}</p>
          <button onclick="location.reload()" style="background: #00FFFF; color: black; border: none; padding: 10px 15px; margin-top: 10px; cursor: pointer; border-radius: 5px;">
            Reload Page
          </button>
        </div>
      `;
    }
  } catch (displayError) {
    console.error('[MINIMAL APP] Failed to display error:', displayError);
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
  
  // Simplest possible render without any wrappers
  const root = createRoot(rootElement);
  root.render(<MinimalApp />);
  
  console.log('[MINIMAL APP] Render call completed');
} catch (error) {
  console.error('[MINIMAL APP] Critical error during initialization:', error);
  
  // Try to show error on screen
  try {
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #000000; color: #FF0000; font-family: sans-serif; padding: 20px; text-align: center;">
        <div>
          <h1 style="color: #FF0000; margin-bottom: 20px;">The Puzzle Boss - Critical Error</h1>
          <p style="margin-bottom: 15px;">${error.message || 'Unknown initialization error'}</p>
          <code style="display: block; background: #222; padding: 15px; border-radius: 5px; margin: 15px 0; white-space: pre-wrap; text-align: left; max-height: 200px; overflow: auto;">${error.stack || 'No stack trace available'}</code>
          <button onclick="window.location.reload()" style="background: #00FFFF; color: #000000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  } catch (displayError) {
    console.error('[MINIMAL APP] Failed to display error:', displayError);
  }
}

// Create a timeout to detect if rendering hangs
const renderTimeout = setTimeout(() => {
  console.warn('[MINIMAL APP] Render timeout reached - application may be stalled');
  
  // Check what's in the DOM
  const rootContent = document.getElementById('root')?.innerHTML || 'Empty';
  console.log('[MINIMAL APP] Current root content:', rootContent);
  
  // Try to display a message
  try {
    const rootEl = document.getElementById('root');
    if (rootEl && !rootEl.querySelector('.minimal-app-timeout-message')) {
      rootEl.innerHTML += `
        <div class="minimal-app-timeout-message" style="position: fixed; bottom: 10px; right: 10px; background: #FFD700; color: black; padding: 10px; border-radius: 5px; max-width: 300px; z-index: 9999;">
          <p><strong>Warning:</strong> Rendering timeout reached.</p>
          <p>Check console for details</p>
          <button onclick="location.reload()" style="background: #00FFFF; color: black; border: none; padding: 5px 10px; margin-top: 10px; cursor: pointer;">
            Reload
          </button>
        </div>
      `;
    }
  } catch (e) {
    console.error('[MINIMAL APP] Failed to add timeout message:', e);
  }
}, 5000);

// Expose a cleanup function to be called when rendering is complete
window.__clearMinimalAppTimeout = () => {
  console.log('[MINIMAL APP] Clearing render timeout - rendering completed successfully');
  clearTimeout(renderTimeout);
};
