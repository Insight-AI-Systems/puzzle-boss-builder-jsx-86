
import { createContext, useContext, ReactNode } from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';

interface SecurityContextType {
  isSecure: boolean;
  permissions: string[];
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const { hasRole, isAdmin } = useClerkAuth();
  
  const permissions = [];
  if (isAdmin) permissions.push('admin');
  if (hasRole('category_manager')) permissions.push('manage_categories');
  
  return (
    <SecurityContext.Provider value={{ isSecure: true, permissions }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurityContext() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}
