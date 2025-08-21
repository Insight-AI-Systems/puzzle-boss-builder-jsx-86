import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button"; // ✅ Import Button
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
    console.log('Forgot password clicked');
  };

  const handleAdminPanelRedirect = () => {
    window.open("https://admin.thepuzzleboss.com/", "_blank", "noopener,noreferrer");
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

        {/* ✅ Admin Panel Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            onClick={handleAdminPanelRedirect}
          >
            {/* You can add an icon like Google button if needed */}
            Admin Panel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
