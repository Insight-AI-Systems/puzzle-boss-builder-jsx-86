
import React, { useEffect, useState } from 'react';
import { AuthContent } from './AuthContent';
import { useSearchParams } from 'react-router-dom';
import { AuthView } from '@/types/auth';

interface AuthFormProps {
  initialView?: AuthView;
}

export const AuthForm: React.FC<AuthFormProps> = ({ initialView }) => {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<AuthView>(initialView || 'signin');
  const [lastEnteredEmail, setLastEnteredEmail] = useState('');
  
  // Update view based on URL parameters
  useEffect(() => {
    // Check for verification success
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
  
  // Update lastEnteredEmail when email changes
  useEffect(() => {
    const email = document.querySelector<HTMLInputElement>('input[type="email"]')?.value;
    if (email) {
      setLastEnteredEmail(email);
    }
  }, [currentView]);

  return (
    <AuthContent
      currentView={currentView}
      setCurrentView={setCurrentView}
      lastEnteredEmail={lastEnteredEmail}
    />
  );
};
