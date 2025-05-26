
import React, { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get('signup') === 'true';
  const { signIn, signUp, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-puzzle-white">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h1>
          <p className="mt-2 text-puzzle-white/70">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-puzzle-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 bg-puzzle-black/50 border-puzzle-aqua/20 text-puzzle-white"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-puzzle-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 bg-puzzle-black/50 border-puzzle-aqua/20 text-puzzle-white"
            />
          </div>

          {isSignUp && (
            <div>
              <Label htmlFor="confirmPassword" className="text-puzzle-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 bg-puzzle-black/50 border-puzzle-aqua/20 text-puzzle-white"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-puzzle-white/70">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <Button
            variant="link"
            onClick={() => {
              const newUrl = isSignUp ? '/auth' : '/auth?signup=true';
              window.history.pushState({}, '', newUrl);
              window.location.reload();
            }}
            className="text-puzzle-aqua hover:text-puzzle-aqua/80"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
