
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [resetData, setResetData] = useState({
    email: ''
  });
  
  // Form errors
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [resetErrors, setResetErrors] = useState({});

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleLoginChange = (e) => {
    const { name, value, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: name === 'rememberMe' ? checked : value
    });
    
    // Clear error when user starts typing
    if (loginErrors[name]) {
      setLoginErrors({
        ...loginErrors,
        [name]: ''
      });
    }
  };
  
  const handleRegisterChange = (e) => {
    const { name, value, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: name === 'agreeTerms' ? checked : value
    });
    
    // Clear error when user starts typing
    if (registerErrors[name]) {
      setRegisterErrors({
        ...registerErrors,
        [name]: ''
      });
    }
  };
  
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData({
      ...resetData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (resetErrors[name]) {
      setResetErrors({
        ...resetErrors,
        [name]: ''
      });
    }
  };
  
  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!loginData.password) {
      errors.password = 'Password is required';
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateRegisterForm = () => {
    const errors = {};
    
    if (!registerData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!registerData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registerData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateResetForm = () => {
    const errors = {};
    
    if (!resetData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(resetData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setResetErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (!error) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signUp(
        registerData.email, 
        registerData.password,
        registerData.username
      );
      
      if (!error) {
        setActiveTab('login');
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateResetForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await resetPassword(resetData.email);
      
      if (!error) {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for further instructions."
        });
        setActiveTab('login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className={loginErrors.email ? 'border-red-500' : ''}
                />
                {loginErrors.email && (
                  <p className="text-red-500 text-xs">{loginErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-sm text-puzzle-aqua hover:underline"
                    onClick={() => setActiveTab('reset')}
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className={loginErrors.password ? 'border-red-500' : ''}
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-xs">{loginErrors.password}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={loginData.rememberMe}
                  onCheckedChange={(checked) => 
                    handleLoginChange({
                      target: { name: 'rememberMe', checked, value: checked }
                    })
                  }
                />
                <Label htmlFor="rememberMe">Remember me</Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  className={registerErrors.username ? 'border-red-500' : ''}
                />
                {registerErrors.username && (
                  <p className="text-red-500 text-xs">{registerErrors.username}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email address</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className={registerErrors.email ? 'border-red-500' : ''}
                />
                {registerErrors.email && (
                  <p className="text-red-500 text-xs">{registerErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className={registerErrors.password ? 'border-red-500' : ''}
                />
                {registerErrors.password && (
                  <p className="text-red-500 text-xs">{registerErrors.password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className={registerErrors.confirmPassword ? 'border-red-500' : ''}
                />
                {registerErrors.confirmPassword && (
                  <p className="text-red-500 text-xs">{registerErrors.confirmPassword}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={registerData.agreeTerms}
                  onCheckedChange={(checked) => 
                    handleRegisterChange({
                      target: { name: 'agreeTerms', checked, value: checked }
                    })
                  }
                />
                <Label htmlFor="agreeTerms" className="text-sm">
                  I agree to the{' '}
                  <a href="/terms" className="text-puzzle-aqua hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-puzzle-aqua hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {registerErrors.agreeTerms && (
                <p className="text-red-500 text-xs">{registerErrors.agreeTerms}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="reset" className="space-y-4">
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email address</Label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={resetData.email}
                  onChange={handleResetChange}
                  className={resetErrors.email ? 'border-red-500' : ''}
                />
                {resetErrors.email && (
                  <p className="text-red-500 text-xs">{resetErrors.email}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-puzzle-aqua hover:underline"
                  onClick={() => setActiveTab('login')}
                >
                  Back to login
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
