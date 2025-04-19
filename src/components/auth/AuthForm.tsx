
import React from 'react';
import { AuthContent } from './AuthContent';
import { useAuthView } from '@/hooks/auth/useAuthView';

export const AuthForm = () => {
  const { currentView, setCurrentView, lastEnteredEmail, setLastEnteredEmail } = useAuthView();
  
  // Update lastEnteredEmail when email changes
  React.useEffect(() => {
    const email = document.querySelector<HTMLInputElement>('input[type="email"]')?.value;
    if (email) {
      setLastEnteredEmail(email);
    }
  }, [setLastEnteredEmail]);

  return (
    <AuthContent
      currentView={currentView}
      setCurrentView={setCurrentView}
      lastEnteredEmail={lastEnteredEmail}
    />
  );
};
