
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface PageDebuggerProps {
  componentName: string;
}

export const PageDebugger: React.FC<PageDebuggerProps> = ({ componentName }) => {
  const { isAuthenticated, isLoading, userRole, rolesLoaded } = useAuth();
  const location = useLocation();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 right-0 p-2 bg-black/80 text-white text-xs z-50 max-w-xs overflow-auto">
      <h4 className="font-bold">Debug: {componentName}</h4>
      <div>Route: {location.pathname}</div>
      <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Auth Loading: {isLoading ? '⏳' : '✅'}</div>
      <div>Roles Loaded: {rolesLoaded ? '✅' : '⏳'}</div>
      <div>Role: {userRole || 'none'}</div>
    </div>
  );
};

export default PageDebugger;
