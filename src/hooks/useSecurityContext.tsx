
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initCsrfProtection, refreshCsrfToken, getCsrfToken, rotateCsrfToken } from '@/utils/security/csrfCookies';
import { logSecurityEvent, SecurityEventType, initSecurityEventListeners, processQueuedSecurityEvents } from '@/utils/security/auditLogging';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SecurityContextType {
  // CSRF Protection
  csrfToken: string;
  refreshCsrf: () => Promise<string>;
  rotateCsrf: () => Promise<string>;
  
  // Security Logging
  logSecurityEvent: typeof logSecurityEvent;
  
  // Security States
  securityLevel: 'normal' | 'elevated' | 'lockdown';
  setSecurityLevel: (level: 'normal' | 'elevated' | 'lockdown') => void;
  
  // Session Security
  invalidateAllOtherSessions: () => Promise<void>;
  validateAdminAccess: () => Promise<boolean>;
  
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
    const initSecurity = async () => {
      try {
        console.log('Initializing security context');
        
        // Initialize CSRF protection
        await initCsrfProtection();
        setCsrfToken(getCsrfToken());
        
        // Initialize security event listeners
        initSecurityEventListeners();
        
        // Process any queued security events
        await processQueuedSecurityEvents();
        
        // Log security initialization
        await logSecurityEvent({
          eventType: SecurityEventType.CONFIG_CHANGE,
          userId: user?.id,
          severity: 'info',
          details: { action: 'security_context_initialized' }
        });
        
        setIsInitialized(true);
        console.log('Security context initialized successfully');
      } catch (error) {
        console.error('Error initializing security context:', error);
      }
    };
    
    initSecurity();
  }, []);
  
  // Update CSRF token when authentication state changes
  useEffect(() => {
    const updateCsrfOnAuth = async () => {
      if (isAuthenticated && user) {
        const newToken = await refreshCsrfToken();
        setCsrfToken(newToken);
        
        // Log user authentication for security monitoring
        await logSecurityEvent({
          eventType: SecurityEventType.LOGIN_SUCCESS,
          userId: user.id,
          severity: 'info',
          email: user.email,
          details: { authenticated: true }
        });
      }
    };
    
    if (isAuthenticated && user) {
      updateCsrfOnAuth();
    }
  }, [isAuthenticated, user]);
  
  // Refresh CSRF token
  const refreshCsrf = async () => {
    const newToken = await refreshCsrfToken();
    setCsrfToken(newToken);
    return newToken;
  };
  
  // Rotate CSRF token for security-sensitive actions
  const rotateCsrf = async () => {
    const newToken = await rotateCsrfToken();
    setCsrfToken(newToken);
    return newToken;
  };
  
  // Invalidate all other sessions for the current user
  const invalidateAllOtherSessions = async () => {
    if (!user || !session) return;
    
    try {
      // Call the edge function to terminate other sessions
      const sessionId = session.access_token;
      
      // Use the Supabase function to terminate other sessions
      const { error } = await supabase.rpc('terminate_other_sessions', {
        current_session_id: sessionId
      });
      
      if (error) {
        console.error('Failed to invalidate other sessions:', error);
        throw error;
      }
      
      // Log the security action
      await logSecurityEvent({
        eventType: SecurityEventType.SESSION_EXPIRED,
        userId: user?.id,
        severity: 'warning',
        email: user.email,
        details: { action: 'invalidate_other_sessions', currentSession: sessionId }
      });
      
      // Rotate CSRF token after security-sensitive action
      await rotateCsrf();
      
    } catch (error) {
      console.error('Failed to invalidate other sessions:', error);
    }
  };
  
  // Validate if the current user has admin access
  const validateAdminAccess = async (): Promise<boolean> => {
    if (!user || !session) return false;
    
    try {
      // Call the security config edge function to validate admin access
      const { data, error } = await supabase.functions.invoke('security-config', {
        body: { action: 'validateAdminAccess' }
      });
      
      if (error) {
        console.error('Error validating admin access:', error);
        return false;
      }
      
      return data.isAdmin;
    } catch (error) {
      console.error('Exception validating admin access:', error);
      return false;
    }
  };
  
  const value: SecurityContextType = {
    csrfToken,
    refreshCsrf,
    rotateCsrf,
    logSecurityEvent,
    securityLevel,
    setSecurityLevel,
    invalidateAllOtherSessions,
    validateAdminAccess,
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
