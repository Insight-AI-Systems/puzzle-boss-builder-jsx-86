
// Add missing React import
import React from 'react';

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
    // Safely check for React version
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
  },
  
  checkReactRouterAvailability() {
    try {
      // Check if React Router is available by detecting its key components
      const hasReactRouter = typeof window !== 'undefined' && 
        window.ReactRouter !== undefined;
      
      return {
        available: hasReactRouter,
        version: hasReactRouter && window.ReactRouter.version || 'unknown'
      };
    } catch (e) {
      console.error('Error checking React Router:', e);
      return { available: false, error: e.message };
    }
  },
  
  getPerformanceMetrics() {
    try {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = window.performance.getEntriesByType('navigation')[0];
        const resources = window.performance.getEntriesByType('resource');
        
        return {
          pageLoad: navigation ? navigation.duration : null,
          domComplete: navigation ? navigation.domComplete : null,
          resourceCount: resources.length,
          largestResource: resources.length > 0 ? 
            resources.reduce((largest, current) => 
              current.transferSize > largest.transferSize ? current : largest
            ) : null,
          timestamp: new Date().toISOString()
        };
      }
      return { error: 'Performance API not available' };
    } catch (e) {
      console.error('Error getting performance metrics:', e);
      return { error: e.message };
    }
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.__diagnostics = diagnostics;
}

export default diagnostics;
