
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignInForm } from './forms/SignInForm';
import { SignUpForm } from './forms/SignUpForm';
import { ResetPasswordRequestForm } from './forms/ResetPasswordRequestForm';
import { ResetPasswordConfirmForm } from './forms/ResetPasswordConfirmForm';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';
import { GoogleAuthButton } from './buttons/GoogleAuthButton';
import { DemoAccountInfo } from './demo/DemoAccountInfo';

type AuthView = 'signin' | 'signup' | 'reset-request' | 'reset-confirm' | 'reset-success';

export const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentView, setCurrentView] = useState<AuthView>('signin');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check for password reset token in URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setCurrentView('reset-confirm');
    }
  }, [searchParams]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };
  
  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${email}`);
      
      const { data, error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      console.log('Auth response:', data, error);
      
      if (error) {
        console.error('Auth error:', error);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // Show success toast
      toast({
        title: isSignUp ? 'Account created!' : 'Welcome back!',
        description: isSignUp 
          ? 'Please check your email to verify your account.'
          : 'Successfully signed in.',
      });

      // Redirect to home page on successful sign-in
      if (!isSignUp && data.session) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      toast({
        title: 'Authentication error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      // Always ensure loading state is reset
      setIsLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!email) {
      setErrorMessage('Email is required');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        console.error('Password reset request error:', error);
        setErrorMessage(error.message);
        return;
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for password reset instructions.',
      });
      
      resetForm();
      setCurrentView('signin');
    } catch (error) {
      console.error('Password reset request error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async () => {
    if (!password) {
      setErrorMessage('Password is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        console.error('Password reset error:', error);
        setErrorMessage(error.message);
        return;
      }
      
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated. You can now sign in with your new password.',
      });
      
      resetForm();
      setCurrentView('reset-success');
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log('Attempting Google sign in');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        console.error('Google auth error:', error);
        setErrorMessage(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Google auth error:', error);
      
      toast({
        title: 'Authentication error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const renderAuthForm = () => {
    switch (currentView) {
      case 'signin':
        return (
          <>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" onClick={() => setCurrentView('signin')}>Sign In</TabsTrigger>
                <TabsTrigger value="signup" onClick={() => setCurrentView('signup')}>Sign Up</TabsTrigger>
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
                  onForgotPassword={() => setCurrentView('reset-request')}
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
          </>
        );
        
      case 'signup':
        return (
          <>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" onClick={() => setCurrentView('signin')}>Sign In</TabsTrigger>
                <TabsTrigger value="signup" onClick={() => setCurrentView('signup')}>Sign Up</TabsTrigger>
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
                  onForgotPassword={() => setCurrentView('reset-request')}
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
          </>
        );
        
      case 'reset-request':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Reset Password</h2>
              <p className="text-muted-foreground mt-1">
                Enter your email and we'll send you instructions to reset your password
              </p>
            </div>
            
            <ResetPasswordRequestForm 
              email={email}
              errorMessage={errorMessage}
              isLoading={isLoading}
              setEmail={setEmail}
              handleSubmit={handlePasswordResetRequest}
              goBack={() => setCurrentView('signin')}
            />
          </div>
        );
        
      case 'reset-confirm':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Create New Password</h2>
              <p className="text-muted-foreground mt-1">
                Enter your new password below
              </p>
            </div>
            
            <ResetPasswordConfirmForm 
              password={password}
              confirmPassword={confirmPassword}
              errorMessage={errorMessage}
              isLoading={isLoading}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              handleSubmit={handlePasswordReset}
            />
          </div>
        );
        
      case 'reset-success':
        return (
          <ResetPasswordSuccess 
            goToSignIn={() => setCurrentView('signin')} 
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="card-highlight p-6 bg-puzzle-black/50 border border-puzzle-aqua/20 rounded-lg shadow-lg">
      {renderAuthForm()}
    </div>
  );
};
