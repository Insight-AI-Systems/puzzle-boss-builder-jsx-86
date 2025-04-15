
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import Loading from '@/components/ui/loading';

/**
 * Authentication page component that handles login, registration, and password reset
 * @returns {JSX.Element} Authentication page
 */
const Auth = () => {
  console.log('[Auth] Rendering Auth page');
  
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [pageReady, setPageReady] = useState(false);
  const [pageError, setPageError] = useState(null);

  // Mark page as ready after a short delay to ensure smooth transition
  useEffect(() => {
    console.log('[Auth] Auth page mounted');
    const timer = setTimeout(() => {
      setPageReady(true);
      console.log('[Auth] Auth page ready');
    }, 100);
    
    return () => {
      clearTimeout(timer);
      console.log('[Auth] Auth page unmounted');
    };
  }, []);

  // Redirect if user is already logged in - with safety timeout
  useEffect(() => {
    console.log('[Auth] Auth state check:', { loading, user: user ? 'Present' : 'Not present' });
    
    // Clear any previous errors when auth state changes
    setPageError(null);
    
    if (user) {
      console.log('[Auth] User already logged in, redirecting to home');
      navigate('/');
    }
    
    // Safety timeout to prevent getting stuck on this page
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('[Auth] Authentication state check taking too long');
        setPageError('Authentication check timeout. Please refresh the page.');
      }
    }, 5000);
    
    return () => clearTimeout(safetyTimeout);
  }, [user, navigate, loading]);

  const handleForgotPassword = () => {
    setActiveTab('reset');
  };

  const handleBackToLogin = () => {
    setActiveTab('login');
  };

  // Show error state if there's a problem
  if (pageError) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4 card-highlight p-8 text-center">
          <h2 className="text-xl text-puzzle-gold">Authentication Error</h2>
          <p className="text-white">{pageError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <Loading color="aqua" message="Checking authentication status..." />
      </div>
    );
  }

  // Simple loading indicator before the page is fully ready
  if (!pageReady) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <Loading color="aqua" message="Preparing authentication forms..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 card-highlight p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-puzzle-white">
            Welcome to <span className="text-puzzle-gold">The Puzzle Boss</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeTab === 'login' 
              ? 'Sign in to your account to continue' 
              : activeTab === 'register' 
                ? 'Create a new account to get started'
                : 'Enter your email to reset your password'}
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <LoginForm onForgotPassword={handleForgotPassword} />
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <RegisterForm />
          </TabsContent>
          
          <TabsContent value="reset" className="space-y-4">
            <PasswordResetForm onBackToLogin={handleBackToLogin} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
