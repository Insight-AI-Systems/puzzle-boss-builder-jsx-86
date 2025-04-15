
// Basic diagnostic utilities
export const diagnostics = {
  checkStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return { available: true, error: null };
    } catch (e) {
      return { available: false, error: e.message };
    }
  },

  checkEnvironment() {
    let reactVersion = 'unknown';
    try {
      // Safe check for React
      if (typeof React !== 'undefined' && React && React.version) {
        reactVersion = React.version;
      }
    } catch (e) {
      console.error('Error checking React version:', e);
    }

    return {
      isDev: process.env.NODE_ENV === 'development',
      isBrowser: typeof window !== 'undefined',
      hasReact: typeof React !== 'undefined',
      reactVersion: reactVersion,
      hasLocalStorage: typeof localStorage !== 'undefined',
      hasSessionStorage: typeof sessionStorage !== 'undefined',
      timestamp: new Date().toISOString()
    };
  },

  getErrorInfo(error) {
    return {
      message: error?.message || String(error),
      stack: error?.stack,
      type: error?.name,
      timestamp: new Date().toISOString(),
    };
  },

  logError(error, context = 'General') {
    const errorInfo = this.getErrorInfo(error);
    console.error(`[${context}] Error:`, errorInfo);
    return errorInfo;
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.__diagnostics = diagnostics;
}

export default diagnostics;
