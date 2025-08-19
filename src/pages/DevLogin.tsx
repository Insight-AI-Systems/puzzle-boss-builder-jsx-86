import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function DevLogin() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('dev@test.com');
  const [password, setPassword] = useState('devtest123');

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      // Check if Supabase is connected
      const { data: { session } } = await supabase.auth.getSession();
      
      setDebugInfo(`Supabase URL: ${supabase.supabaseUrl}\nConnection: Active\nSession: ${session ? 'Yes - ' + session.user.email : 'None'}`);
      
      if (session) {
        setMessage(`Already logged in as: ${session.user.email}`);
      }
    } catch (error) {
      setDebugInfo(`Supabase connection error: ${error}`);
    }
  };

  const attemptSignUp = async () => {
    setIsLoading(true);
    setMessage('Attempting to create account...');
    
    try {
      // Generate a unique email to avoid conflicts
      const uniqueEmail = `test_${Date.now()}@puzzleboss.local`;
      const testPassword = 'TestPassword123!';
      
      const { data, error } = await supabase.auth.signUp({
        email: uniqueEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User',
            email_verified: true
          }
        }
      });

      if (error) {
        setMessage(`Sign up error: ${error.message}\n\nDebug: ${JSON.stringify(error, null, 2)}`);
        
        // If sign up fails, try different approach
        if (error.message.includes('not authorized') || error.message.includes('disabled')) {
          setMessage('Sign ups might be disabled. Trying alternative method...');
          attemptAlternativeAuth();
        }
      } else if (data?.user) {
        setMessage(`✅ Account created!\n\nEmail: ${uniqueEmail}\nPassword: ${testPassword}\nUser ID: ${data.user.id}\n\nNow signing in...`);
        
        // Auto sign in
        setTimeout(() => {
          signInWithCredentials(uniqueEmail, testPassword);
        }, 1000);
      }
    } catch (error: any) {
      setMessage(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithCredentials = async (emailToUse?: string, passwordToUse?: string) => {
    setIsLoading(true);
    const loginEmail = emailToUse || email;
    const loginPassword = passwordToUse || password;
    
    setMessage(`Attempting sign in with:\nEmail: ${loginEmail}\nPassword: ${loginPassword}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });

      if (error) {
        setMessage(`Sign in failed: ${error.message}\n\nThis might mean:\n1. Account doesn't exist\n2. Wrong password\n3. Email not verified\n\nDebug info: ${JSON.stringify(error, null, 2)}`);
      } else if (data?.user) {
        setMessage(`✅ SUCCESS! Logged in as: ${data.user.email}\n\nUser ID: ${data.user.id}\nVerified: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`);
        
        // Redirect after successful login
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error: any) {
      setMessage(`Unexpected sign in error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const attemptAlternativeAuth = async () => {
    setMessage('Trying magic link authentication...');
    
    try {
      const testEmail = `dev_${Date.now()}@test.local`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email: testEmail,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: 'Dev User'
          }
        }
      });

      if (error) {
        setMessage(`Magic link error: ${error.message}`);
      } else {
        setMessage(`Check email ${testEmail} for magic link (Note: This won't work with .local domain)`);
      }
    } catch (error: any) {
      setMessage(`Alternative auth error: ${error.message}`);
    }
  };

  const attemptAnonSignIn = async () => {
    setIsLoading(true);
    setMessage('Attempting anonymous sign in...');
    
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        setMessage(`Anonymous sign in error: ${error.message}\n\nThis feature might not be enabled in your Supabase project.`);
      } else if (data?.user) {
        setMessage(`✅ Signed in anonymously!\nUser ID: ${data.user.id}\n\nNote: Anonymous users have limited access.`);
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error: any) {
      setMessage(`Anonymous auth error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(`Sign out error: ${error.message}`);
    } else {
      setMessage('Signed out successfully');
      checkSupabaseConnection();
    }
  };

  const testDatabaseAccess = async () => {
    setMessage('Testing database access...');
    
    try {
      // Try to read from a public table
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .limit(1);

      if (error) {
        setMessage(`Database access error: ${error.message}\n\nThis might mean:\n1. Table doesn't exist\n2. No read permissions\n3. RLS policies blocking access`);
      } else {
        setMessage(`Database accessible! Found ${data?.length || 0} records in user_roles table.`);
      }
    } catch (error: any) {
      setMessage(`Database test error: ${error.message}`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      padding: '2rem',
      fontSize: '14px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: '#0f0', marginBottom: '1rem' }}>
          🔧 Developer Login Debug Panel
        </h1>
        
        <div style={{
          background: '#111',
          border: '1px solid #0f0',
          padding: '1rem',
          marginBottom: '1rem',
          whiteSpace: 'pre-wrap'
        }}>
          <strong>Connection Status:</strong><br />
          {debugInfo || 'Checking...'}
        </div>

        <div style={{
          background: '#111',
          border: '1px solid #0f0',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h3>Manual Login:</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#000',
              color: '#0f0',
              border: '1px solid #0f0',
              marginBottom: '0.5rem'
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#000',
              color: '#0f0',
              border: '1px solid #0f0',
              marginBottom: '0.5rem'
            }}
          />
          <button
            onClick={() => signInWithCredentials()}
            disabled={isLoading}
            style={{
              padding: '0.5rem 1rem',
              background: '#000',
              color: '#0f0',
              border: '1px solid #0f0',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginRight: '0.5rem'
            }}
          >
            Sign In
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={attemptSignUp}
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              background: '#000',
              color: '#0f0',
              border: '1px solid #0f0',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Create Test Account
          </button>
          
          <button
            onClick={attemptAnonSignIn}
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              background: '#000',
              color: '#0f0',
              border: '1px solid #0f0',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Anonymous Sign In
          </button>
          
          <button
            onClick={testDatabaseAccess}
            style={{
              padding: '0.75rem',
              background: '#000',
              color: '#0f0',
              border: '1px solid #0f0',
              cursor: 'pointer'
            }}
          >
            Test Database
          </button>
          
          <button
            onClick={signOut}
            style={{
              padding: '0.75rem',
              background: '#000',
              color: '#0f0',
              border: '1px solid #0f0',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>

        {message && (
          <div style={{
            background: '#111',
            border: `1px solid ${message.includes('✅') ? '#0f0' : message.includes('error') ? '#f00' : '#ff0'}`,
            color: message.includes('error') ? '#f00' : '#0f0',
            padding: '1rem',
            marginBottom: '1rem',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace'
          }}>
            {message}
          </div>
        )}

        <div style={{
          background: '#111',
          border: '1px solid #0f0',
          padding: '1rem',
          marginTop: '2rem'
        }}>
          <h3>Common Issues & Solutions:</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>Invalid credentials → Create new test account</li>
            <li>Sign ups disabled → Contact Supabase project owner</li>
            <li>Email verification required → Use test account button</li>
            <li>Database access denied → Check RLS policies</li>
          </ol>
        </div>

        <div style={{
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <a href="/" style={{ color: '#0f0', marginRight: '1rem' }}>Home</a>
          <a href="/admin" style={{ color: '#0f0', marginRight: '1rem' }}>Admin</a>
          <a href="/games/jigsaw" style={{ color: '#0f0' }}>Puzzle</a>
        </div>
      </div>
    </div>
  );
}