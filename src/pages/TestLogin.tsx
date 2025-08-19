import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/layouts/PageLayout';

export default function TestLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Sign up form state
  const [signupEmail, setSignupEmail] = useState('admin@puzzleboss.com');
  const [signupPassword, setSignupPassword] = useState('Admin123!@#');
  
  // Sign in form state
  const [signinEmail, setSigninEmail] = useState('admin@puzzleboss.com');
  const [signinPassword, setSigninPassword] = useState('Admin123!@#');

  // Handle Sign Up
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            role: 'admin',
            full_name: 'Test Admin'
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        // Try to set admin role
        try {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'admin'
            });
          
          if (roleError) {
            console.error('Role assignment error:', roleError);
          }
        } catch (e) {
          console.error('Role setup error:', e);
        }

        toast({
          title: 'Account created successfully!',
          description: 'Please check your email for verification or sign in directly.',
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Sign up failed',
        description: error.message || 'An error occurred during sign up',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign In
  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signinEmail,
        password: signinPassword,
      });

      if (error) throw error;

      if (data?.user) {
        toast({
          title: 'Signed in successfully!',
          description: `Welcome back, ${data.user.email}`,
        });
        
        // Check if user has admin role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        if (roleData?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check current session
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      toast({
        title: 'Active Session',
        description: `Logged in as: ${session.user.email}`,
      });
      console.log('Current session:', session);
    } else {
      toast({
        title: 'No Active Session',
        description: 'Please sign in to continue',
        variant: 'destructive',
      });
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully',
    });
  };

  return (
    <PageLayout 
      title="Test Login Page" 
      subtitle="Quick access for testing authentication and admin access"
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  placeholder="admin@puzzleboss.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              
              <Button 
                onClick={handleSignIn} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="admin@puzzleboss.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Choose a strong password"
                />
              </div>
              
              <Button 
                onClick={handleSignUp} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t space-y-3">
            <Button 
              onClick={checkSession} 
              variant="outline" 
              className="w-full"
            >
              Check Current Session
            </Button>
            
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full"
            >
              Sign Out
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => navigate('/admin')} 
                variant="secondary"
                className="w-full"
              >
                Go to Admin
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                variant="secondary"
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Test Credentials:</h3>
            <p className="text-sm text-muted-foreground">
              Email: admin@puzzleboss.com<br />
              Password: Admin123!@#
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Note: These are test credentials for local development only.
            </p>
          </div>
        </Card>
        
        <Card className="mt-6 p-6">
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => navigate('/auth')} variant="outline">
              Official Auth Page
            </Button>
            <Button onClick={() => navigate('/games/jigsaw')} variant="outline">
              New Puzzle Game
            </Button>
            <Button onClick={() => navigate('/account')} variant="outline">
              Account Page
            </Button>
            <Button onClick={() => navigate('/settings')} variant="outline">
              Settings
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}