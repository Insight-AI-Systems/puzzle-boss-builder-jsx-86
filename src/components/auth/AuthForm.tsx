
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInView } from './views/SignInView';
import { useAuth as useAuthForm } from '@/hooks/auth/useAuth.tsx';

export const AuthForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState('signin');
  
  const authForm = useAuthForm();

  // Sync tab with URL params
  useEffect(() => {
    if (searchParams.get('signup') === 'true') {
      setCurrentView('signup');
    } else {
      setCurrentView('signin');
    }
  }, [searchParams]);

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    console.log('Forgot password clicked');
  };

  return (
    <Card className="bg-puzzle-gray border-puzzle-border">
      <CardHeader>
        <CardTitle className="text-center text-puzzle-white">
          {currentView === 'signup' ? 'Create Account' : 'Welcome Back'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignInView
          email={authForm.email}
          password={authForm.password}
          confirmPassword={authForm.confirmPassword}
          username={authForm.username}
          rememberMe={authForm.rememberMe}
          acceptTerms={authForm.acceptTerms}
          errorMessage={authForm.errorMessage}
          isLoading={authForm.isLoading}
          setEmail={authForm.setEmail}
          setPassword={authForm.setPassword}
          setConfirmPassword={authForm.setConfirmPassword}
          setUsername={authForm.setUsername}
          setRememberMe={authForm.setRememberMe}
          setAcceptTerms={authForm.setAcceptTerms}
          handleEmailAuth={authForm.handleEmailAuth}
          handleGoogleAuth={authForm.handleGoogleAuth}
          onForgotPassword={handleForgotPassword}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </CardContent>
    </Card>
  );
};
