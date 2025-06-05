
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PageDebuggerProps {
  componentName: string;
}

export const PageDebugger: React.FC<PageDebuggerProps> = ({ componentName }) => {
  const { user, userRole: authUserRole, isAuthenticated, isLoading } = useAuth();
  
  const userRole = authUserRole || 'player';

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded max-w-xs">
      <div className="font-bold">{componentName} Debug</div>
      <div>User: {user?.email || 'Not logged in'}</div>
      <div>Role: {userRole}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
    </div>
  );
};
