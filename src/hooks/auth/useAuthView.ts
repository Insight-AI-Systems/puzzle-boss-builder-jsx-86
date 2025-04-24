
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthView } from '@/types/auth';

export function useAuthView(initialView?: AuthView) {
  const [searchParams] = useSearchParams();
  
  // Determine initial view based on parameters or passed prop
  const getInitialView = () => {
    if (initialView) return initialView;
    
    if (searchParams.get('view') === 'verification-pending') return 'verification-pending' as AuthView;
    if (searchParams.get('type') === 'recovery') return 'reset-password-confirm' as AuthView;
    return searchParams.get('signup') === 'true' ? 'signup' as AuthView : 'signin' as AuthView;
  };
  
  const [currentView, setCurrentView] = useState<AuthView>(getInitialView());
  const [lastEnteredEmail, setLastEnteredEmail] = useState<string>('');

  return {
    currentView,
    setCurrentView,
    lastEnteredEmail,
    setLastEnteredEmail
  };
}
