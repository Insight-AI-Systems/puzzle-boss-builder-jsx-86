
export const determineAppMode = () => {
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
