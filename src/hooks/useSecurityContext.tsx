
/**
 * Security Context Hook
 * Provides security utilities and state throughout the application
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initCsrfProtection, refreshCsrfToken, getCsrfToken } from '@/utils/security/csrf';
import { logSecurityEvent, SecurityEventType } from '@/utils/security/logging';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityContextType {
  // CSRF Protection
  csrfToken: string;
  refreshCsrf: () => string;
  
  // Security Logging
  logSecurityEvent: typeof logSecurityEvent;
  
  // Security States
  securityLevel: 'normal' | 'elevated' | 'lockdown';
  setSecurityLevel: (level: 'normal' | 'elevated' | 'lockdown') => void;
  
  // Session Security
  invalidateAllOtherSessions: () => Promise<void>;
  
  // Status
  isInitialized: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isAuthenticated } = useAuth();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [securityLevel, setSecurityLevel] = useState<'normal' | 'elevated' | 'lockdown'>('normal');
  
  // Initialize security features
  useEffect(() => {
    try {
      console.log('Initializing security context');
      // Initialize CSRF protection
      initCsrfProtection();
      setCsrfToken(getCsrfToken());
      
      // Log security initialization
      logSecurityEvent({
        eventType: SecurityEventType.LOGIN_SUCCESS,
        userId: user?.id,
        severity: 'info',
        details: { action: 'security_context_initialized' }
      });
      
      setIsInitialized(true);
      console.log('Security context initialized successfully');
    } catch (error) {
      console.error('Error initializing security context:', error);
    }
  }, []);
  
  // Update CSRF token when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      const newToken = refreshCsrfToken();
      setCsrfToken(newToken);
      
      // Log user authentication for security monitoring
      logSecurityEvent({
        eventType: SecurityEventType.LOGIN_SUCCESS,
        userId: user?.id,
        severity: 'info',
        details: { authenticated: true }
      });
    }
  }, [isAuthenticated, user?.id]);
  
  // Refresh CSRF token
  const refreshCsrf = () => {
    const newToken = refreshCsrfToken();
    setCsrfToken(newToken);
    return newToken;
  };
  
  // Invalidate all other sessions for the current user
  const invalidateAllOtherSessions = async () => {
    if (!user || !session) return;
    
    try {
      // This is a placeholder - implement with Supabase edge function
      // In a real implementation, this would call an API endpoint
      const sessionId = session.access_token;
      
      // Log the security action
      logSecurityEvent({
        eventType: SecurityEventType.SESSION_EXPIRED,
        userId: user?.id,
        severity: 'warning',
        details: { action: 'invalidate_other_sessions', currentSession: sessionId }
      });
      
      // This is where you would call your API to invalidate other sessions
    } catch (error) {
      console.error('Failed to invalidate other sessions:', error);
    }
  };
  
  const value: SecurityContextType = {
    csrfToken,
    refreshCsrf,
    logSecurityEvent,
    securityLevel,
    setSecurityLevel,
    invalidateAllOtherSessions,
    isInitialized
  };
  
  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  
  return context;
};
