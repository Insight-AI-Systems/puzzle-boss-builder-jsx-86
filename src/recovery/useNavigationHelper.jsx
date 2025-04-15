
import { useState, useEffect } from 'react';

/**
 * Hook to handle navigation without React Router in emergency mode
 */
export const useNavigationHelper = () => {
  // Get initial path from URL or default to /
  const getInitialPath = () => {
    // Don't use query params or hash for simplicity
    return window.location.pathname || '/';
  };
  
  const [currentPath, setCurrentPath] = useState(getInitialPath);
  
  // Listen for popstate events for back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Function to navigate to a new path
  const navigate = (path) => {
    try {
      // Update browser history
      window.history.pushState(null, '', path);
      
      // Update current path state
      setCurrentPath(path);
      
      // Log navigation for debugging
      console.log(`[EmergencyNavigation] Navigated to: ${path}`);
      
      // Add to diagnostic log if available
      if (window.__addDiagnosticLog) {
        window.__addDiagnosticLog(`Navigated to: ${path}`);
      }
      
      return true;
    } catch (error) {
      console.error(`[EmergencyNavigation] Navigation error:`, error);
      return false;
    }
  };
  
  return {
    currentPath,
    navigate
  };
};
