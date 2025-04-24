
import React from 'react';
import { AuthContent } from './AuthContent';
import { useAuthView } from '@/hooks/auth/useAuthView';
import { AuthView } from '@/types/auth';

interface AuthFormProps {
  initialView?: AuthView;
}

export const AuthForm: React.FC<AuthFormProps> = ({ initialView }) => {
  const { currentView, setCurrentView, lastEnteredEmail, setLastEnteredEmail } = useAuthView(initialView);
  
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
