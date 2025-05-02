
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthView } from '@/types/auth';

export function useAuthView(initialView?: AuthView) {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<AuthView>(initialView || 'signin');
  const [lastEnteredEmail, setLastEnteredEmail] = useState<string>('');

  // Check for verification success
  useEffect(() => {
    if (searchParams.get('verificationSuccess') === 'true') {
      setCurrentView('verification-success');
      return;
    }
    
    // Check for verification pending
    if (searchParams.get('view') === 'verification-pending') {
      setCurrentView('verification-pending');
      return;
    }
    
    // Check for password reset
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setCurrentView('reset-confirm');
      return;
    }
    
    // Check for signup parameter
    if (initialView) {
      setCurrentView(initialView);
    } else if (searchParams.get('signup') === 'true') {
      setCurrentView('signup');
    }
  }, [searchParams, initialView]);

  return {
    currentView,
    setCurrentView,
    lastEnteredEmail,
    setLastEnteredEmail
  };
}
