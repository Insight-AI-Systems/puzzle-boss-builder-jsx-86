
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from '../forms/SignInForm';
import { SignUpForm } from '../forms/SignUpForm';
import { GoogleAuthButton } from '../buttons/GoogleAuthButton';
import { DemoAccountInfo } from '../demo/DemoAccountInfo';
import { useSearchParams } from 'react-router-dom';

interface SignInViewProps {
  email: string;
  password: string;
  errorMessage: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleEmailAuth: (isSignUp: boolean) => void;
  handleGoogleAuth: () => void;
  onForgotPassword: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  email,
  password,
  errorMessage,
  isLoading,
  setEmail,
  setPassword,
  handleEmailAuth,
  handleGoogleAuth,
  onForgotPassword,
  currentView,
  setCurrentView,
}) => {
  const [searchParams] = useSearchParams();
  
  // Synchronize the tab with URL parameters
  useEffect(() => {
    const signupParam = searchParams.get('signup');
    if (signupParam === 'true' && currentView !== 'signup') {
      setCurrentView('signup');
    }
  }, [searchParams, currentView, setCurrentView]);

  return (
    <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <SignInForm 
          email={email}
          password={password}
          errorMessage={errorMessage}
          isLoading={isLoading}
          setEmail={setEmail}
          setPassword={setPassword}
          handleSubmit={() => handleEmailAuth(false)}
          onForgotPassword={onForgotPassword}
        />
      </TabsContent>

      <TabsContent value="signup">
        <SignUpForm 
          email={email}
          password={password}
          errorMessage={errorMessage}
          isLoading={isLoading}
          setEmail={setEmail}
          setPassword={setPassword}
          handleSubmit={() => handleEmailAuth(true)}
        />
      </TabsContent>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleAuthButton 
        isLoading={isLoading}
        onClick={handleGoogleAuth}
      />
      
      <DemoAccountInfo />
    </Tabs>
  );
};
