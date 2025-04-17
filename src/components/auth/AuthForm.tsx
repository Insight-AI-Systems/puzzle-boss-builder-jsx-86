
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignInForm } from './forms/SignInForm';
import { SignUpForm } from './forms/SignUpForm';
import { GoogleAuthButton } from './buttons/GoogleAuthButton';
import { DemoAccountInfo } from './demo/DemoAccountInfo';

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  return (
    <div className="card-highlight p-6 bg-puzzle-black/50 border border-puzzle-aqua/20 rounded-lg shadow-lg">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="signin">
          <SignInForm 
            email={email}
            password={password}
            errorMessage={errorMessage}
            isLoading={isLoading}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSubmit={() => handleEmailAuth(false)}
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
    </div>
  );
};
