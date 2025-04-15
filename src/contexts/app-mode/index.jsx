
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiagnosticLog } from '@/components/DiagnosticLog';

const AppModeContext = createContext(null);

export function AppModeProvider({ children }) {
  const [isMinimal, setIsMinimal] = useState(() => {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('minimal')) {
      return urlParams.get('minimal') === 'true';
    }
    // Then check localStorage
    const stored = localStorage.getItem('app-mode');
    return stored ? stored === 'minimal' : false;
  });

  // Persist mode changes
  useEffect(() => {
    localStorage.setItem('app-mode', isMinimal ? 'minimal' : 'full');
    console.log(`[APP_MODE] Switched to ${isMinimal ? 'minimal' : 'full'} mode`);
  }, [isMinimal]);

  const toggleMode = () => {
    setIsMinimal(prev => !prev);
  };

  return (
    <AppModeContext.Provider value={{ isMinimal, toggleMode }}>
      {children}
      {/* Always show DiagnosticLog, but make it collapsible in full mode */}
      <DiagnosticLog maxEntries={isMinimal ? 20 : 5} />
    </AppModeContext.Provider>
  );
}

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within AppModeProvider');
  }
  return context;
};
