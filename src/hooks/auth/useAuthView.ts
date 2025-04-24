
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useAuthView(initialView?: string) {
  const [searchParams] = useSearchParams();
  
  // Determine initial view based on parameters or passed prop
  const getInitialView = () => {
    if (initialView) return initialView;
    
    if (searchParams.get('view') === 'verification-pending') return 'verification-pending';
    if (searchParams.get('type') === 'recovery') return 'reset-password-confirm';
    return searchParams.get('signup') === 'true' ? 'signup' : 'signin';
  };
  
  const [currentView, setCurrentView] = useState(getInitialView());
  const [lastEnteredEmail, setLastEnteredEmail] = useState<string>('');

  return {
    currentView,
    setCurrentView,
    lastEnteredEmail,
    setLastEnteredEmail
  };
}
