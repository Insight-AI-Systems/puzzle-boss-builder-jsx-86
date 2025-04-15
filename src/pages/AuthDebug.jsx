
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';

const AuthDebug = () => {
  const { user, session, profile, loading } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState('Checking...');
  const [lastApiRequest, setLastApiRequest] = useState(null);
  const [lastApiResponse, setLastApiResponse] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check if user should have access to this page
  useEffect(() => {
    const checkAccess = async () => {
      // Only allow access with debug cookie or if profile role is admin
      const debugMode = document.cookie.includes('puzzle_debug=true');
      if (profile?.role === 'admin') {
        setIsAdmin(true);
      } else if (!debugMode) {
        navigate('/');
      }
    };
    
    if (!loading) {
      checkAccess();
    }
  }, [loading, profile, navigate]);

  // Check Supabase connection
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        setSupabaseStatus('Testing connection...');
        // Basic query just to test connection
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setSupabaseStatus(`Error: ${error.message}`);
          return;
        }
        
        setSupabaseStatus('Connected successfully');
      } catch (err) {
        console.error('Exception testing Supabase connection:', err);
        setSupabaseStatus(`Connection failed: ${err.message}`);
      }
    };
    
    checkSupabaseConnection();
  }, []);

  const runTestLogin = async () => {
    try {
      console.log('Running test login with:', { email: testEmail });
      
      setLastApiRequest({
        method: 'signInWithPassword',
        params: { email: testEmail, password: '******' }
      });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      setLastApiResponse({ data, error });
      
      console.log('Test login result:', { data, error });
    } catch (err) {
      console.error('Test login exception:', err);
      setLastApiResponse({ error: err.message });
    }
  };

  const checkEmailExists = async () => {
    try {
      setLastApiRequest({
        method: 'checkUserExists',
        params: { email: testEmail }
      });
      
      // This is an admin function and might be limited by RLS
      const { data, error } = await supabase.rpc('check_user_exists', {
        email_to_check: testEmail
      });
      
      if (error) {
        console.error('Check email error:', error);
        setLastApiResponse({ error });
      } else {
        setLastApiResponse({ data });
      }
    } catch (err) {
      console.error('Check email exception:', err);
      setLastApiResponse({ error: err.message });
    }
  };

  const clearSession = () => {
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
    window.location.reload();
  };
  
  const enableDebugMode = () => {
    document.cookie = 'puzzle_debug=true; path=/; max-age=3600';
    alert('Debug mode enabled for 1 hour');
  };

  // Format JSON for display
  const formatJson = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-puzzle-aqua"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <Card className="border-puzzle-aqua">
          <CardHeader className="bg-puzzle-black/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-puzzle-gold text-2xl">Authentication Debugging Tool</CardTitle>
                <CardDescription className="text-puzzle-aqua">
                  Troubleshoot login issues and test authentication flows
                </CardDescription>
              </div>
              <Badge variant={isAdmin ? "default" : "outline"} className="bg-puzzle-burgundy text-white">
                {isAdmin ? "Admin Access" : "Debug Mode"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Alert className="bg-yellow-900/20 border-yellow-500 mb-6">
              <AlertTitle className="text-yellow-500">Development Tool Only</AlertTitle>
              <AlertDescription>
                This debugging interface is for development purposes only and should be disabled before production deployment.
              </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="state">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="state">Auth State</TabsTrigger>
                <TabsTrigger value="connection">Connection</TabsTrigger>
                <TabsTrigger value="testing">Test Tools</TabsTrigger>
                <TabsTrigger value="recovery">Recovery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="state" className="py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-puzzle-gold mb-2">Current Authentication State</h3>
                    <div className="bg-card p-4 rounded-md overflow-auto max-h-48">
                      <pre className="text-xs text-card-foreground">
                        {formatJson({
                          authenticated: !!user,
                          userId: user?.id || 'none',
                          email: user?.email || 'none',
                          userMetadata: user?.user_metadata || {},
                          lastSignIn: user?.last_sign_in_at || 'never'
                        })}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-puzzle-gold mb-2">Session Information</h3>
                    <div className="bg-card p-4 rounded-md overflow-auto max-h-48">
                      <pre className="text-xs text-card-foreground">
                        {formatJson({
                          hasSession: !!session,
                          expiresAt: session?.expires_at || 'none',
                          tokenType: session?.token_type || 'none',
                          hasRefreshToken: !!session?.refresh_token,
                          provider: session?.provider || 'none'
                        })}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-puzzle-gold mb-2">User Profile</h3>
                    <div className="bg-card p-4 rounded-md overflow-auto max-h-48">
                      <pre className="text-xs text-card-foreground">
                        {formatJson(profile || { profile: 'none' })}
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="connection" className="py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-puzzle-gold mb-2">Supabase Connection Status</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full ${
                        supabaseStatus.includes('Error') ? 'bg-red-500' : 
                        supabaseStatus.includes('Connected') ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-card-foreground">{supabaseStatus}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium text-puzzle-gold mb-2">Environment Configuration</h3>
                    <div className="bg-card p-4 rounded-md">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Supabase URL</Label>
                          <div className="mt-1 font-mono text-sm">
                            {import.meta.env.VITE_SUPABASE_URL || window.supabaseUrl || 'Not detected'}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">API Key Status</Label>
                          <div className="mt-1 font-mono text-sm">
                            {import.meta.env.VITE_SUPABASE_ANON_KEY || window.supabaseKey ? 'Present' : 'Not detected'}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Current URL</Label>
                          <div className="mt-1 font-mono text-sm break-all">
                            {window.location.href}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="testing" className="py-4">
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testEmail">Test Email</Label>
                      <Input 
                        id="testEmail" 
                        value={testEmail} 
                        onChange={(e) => setTestEmail(e.target.value)} 
                        placeholder="Email to test"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testPassword">Test Password</Label>
                      <Input 
                        id="testPassword" 
                        type="password" 
                        value={testPassword} 
                        onChange={(e) => setTestPassword(e.target.value)} 
                        placeholder="Password to test"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={runTestLogin} 
                        className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black"
                      >
                        Test Login
                      </Button>
                      <Button 
                        onClick={checkEmailExists} 
                        variant="outline" 
                        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
                      >
                        Check Email Exists
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium text-puzzle-gold mb-2">Last API Request</h3>
                    <div className="bg-card p-4 rounded-md overflow-auto max-h-48">
                      <pre className="text-xs text-card-foreground">
                        {lastApiRequest ? formatJson(lastApiRequest) : 'No request made yet'}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-puzzle-gold mb-2">API Response</h3>
                    <div className="bg-card p-4 rounded-md overflow-auto max-h-48">
                      <pre className="text-xs text-card-foreground">
                        {lastApiResponse ? formatJson(lastApiResponse) : 'No response received yet'}
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recovery" className="py-4">
                <div className="space-y-6">
                  <Alert className="bg-muted">
                    <AlertTitle>Recovery Options</AlertTitle>
                    <AlertDescription>
                      These actions will help reset your authentication state or troubleshoot access issues.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4">
                    <Button 
                      onClick={clearSession} 
                      variant="destructive"
                    >
                      Clear All Auth Sessions
                    </Button>
                    
                    <Button 
                      onClick={enableDebugMode} 
                      className="bg-puzzle-aqua hover:bg-puzzle-aqua/90 text-puzzle-black"
                    >
                      Enable Debug Mode (1 hour)
                    </Button>
                    
                    <Button 
                      onClick={() => navigate('/auth')} 
                      variant="outline"
                    >
                      Go To Login Page
                    </Button>
                    
                    <Button 
                      onClick={() => console.log('Auth state:', { user, session, profile })} 
                      variant="ghost"
                    >
                      Log Auth State to Console
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t border-puzzle-aqua/20 pt-4 flex justify-between">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
            >
              Back to Homepage
            </Button>
            <div className="text-xs text-muted-foreground">
              Console logs contain detailed authentication information
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthDebug;
