import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function QuickSetup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
        setMessage(`Currently logged in as: ${session.user.email}`);
      } else {
        setMessage('No active session. Ready to create account.');
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const createTestAccount = async () => {
    setIsLoading(true);
    setMessage('Creating test account...');
    
    try {
      // Step 1: Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'test@puzzleboss.com',
        password: 'Test123456!',
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: 'Test User',
            username: 'testuser'
          }
        }
      });

      if (signUpError) {
        // If user already exists, try to sign in
        if (signUpError.message.includes('already registered')) {
          setMessage('User already exists. Trying to sign in...');
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'test@puzzleboss.com',
            password: 'Test123456!'
          });

          if (signInError) {
            throw signInError;
          }

          if (signInData?.user) {
            setCurrentUser(signInData.user);
            setMessage(`Successfully signed in as: ${signInData.user.email}`);
            return;
          }
        } else {
          throw signUpError;
        }
      }

      if (signUpData?.user) {
        setCurrentUser(signUpData.user);
        setMessage(`Account created successfully! User ID: ${signUpData.user.id}\nEmail: ${signUpData.user.email}`);
      }
    } catch (error: any) {
      console.error('Account creation error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createAdminAccount = async () => {
    setIsLoading(true);
    setMessage('Creating admin account...');
    
    try {
      // Step 1: Sign up the admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@puzzleboss.com',
        password: 'Admin123!@#',
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: 'Admin User',
            username: 'admin',
            role: 'admin'
          }
        }
      });

      if (signUpError) {
        // If user already exists, try to sign in
        if (signUpError.message.includes('already registered')) {
          setMessage('Admin user already exists. Trying to sign in...');
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'admin@puzzleboss.com',
            password: 'Admin123!@#'
          });

          if (signInError) {
            throw signInError;
          }

          if (signInData?.user) {
            setCurrentUser(signInData.user);
            setMessage(`Successfully signed in as admin: ${signInData.user.email}`);
            
            // Try to ensure admin role
            try {
              await supabase.from('user_roles').upsert({
                user_id: signInData.user.id,
                role: 'admin'
              });
            } catch (e) {
              console.log('Role already set or table not accessible');
            }
            return;
          }
        } else {
          throw signUpError;
        }
      }

      if (signUpData?.user) {
        setCurrentUser(signUpData.user);
        setMessage(`Admin account created successfully! User ID: ${signUpData.user.id}\nEmail: ${signUpData.user.email}`);
        
        // Try to set admin role
        try {
          await supabase.from('user_roles').upsert({
            user_id: signUpData.user.id,
            role: 'admin'
          });
          setMessage(prev => prev + '\nAdmin role assigned successfully!');
        } catch (e) {
          console.log('Could not set admin role:', e);
          setMessage(prev => prev + '\nNote: Admin role may need to be set manually in Supabase dashboard.');
        }
      }
    } catch (error: any) {
      console.error('Admin account creation error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setMessage('Signed out successfully!');
  };

  const testSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        setCurrentUser(data.user);
        setMessage(`Successfully signed in as: ${data.user.email}`);
      }
    } catch (error: any) {
      setMessage(`Sign in error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '2.5rem'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🚀 Quick Account Setup
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Create test accounts for Puzzle Boss
        </p>

        {currentUser && (
          <div style={{
            padding: '1rem',
            background: '#e6fffa',
            border: '2px solid #10b981',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <strong>Current User:</strong><br />
            Email: {currentUser.email}<br />
            ID: {currentUser.id}
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={createTestAccount}
            disabled={isLoading}
            style={{
              padding: '1rem',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'transform 0.2s',
              fontWeight: '600'
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLoading ? '⏳ Processing...' : '👤 Create Test Account'}
          </button>

          <button
            onClick={createAdminAccount}
            disabled={isLoading}
            style={{
              padding: '1rem',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'transform 0.2s',
              fontWeight: '600'
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLoading ? '⏳ Processing...' : '👑 Create Admin Account'}
          </button>

          {currentUser && (
            <button
              onClick={signOut}
              style={{
                padding: '1rem',
                fontSize: '1rem',
                background: '#f3f4f6',
                color: '#374151',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🚪 Sign Out
            </button>
          )}
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            background: message.includes('Error') || message.includes('error') ? '#fee2e2' : '#dcfce7',
            border: `2px solid ${message.includes('Error') || message.includes('error') ? '#f87171' : '#4ade80'}`,
            borderRadius: '8px',
            marginBottom: '1.5rem',
            whiteSpace: 'pre-line'
          }}>
            {message}
          </div>
        )}

        <div style={{
          background: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>📋 Test Accounts:</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>Regular User:</strong><br />
            Email: test@puzzleboss.com<br />
            Password: Test123456!
          </div>
          
          <div>
            <strong>Admin User:</strong><br />
            Email: admin@puzzleboss.com<br />
            Password: Admin123!@#
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => testSignIn('test@puzzleboss.com', 'Test123456!')}
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Sign in as Test User
          </button>
          <button
            onClick={() => testSignIn('admin@puzzleboss.com', 'Admin123!@#')}
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Sign in as Admin
          </button>
        </div>

        <div style={{ 
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <a href="/" style={{ color: '#667eea', marginRight: '1rem', textDecoration: 'none', fontWeight: '600' }}>🏠 Home</a>
          <a href="/admin" style={{ color: '#667eea', marginRight: '1rem', textDecoration: 'none', fontWeight: '600' }}>⚙️ Admin</a>
          <a href="/games/jigsaw" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>🧩 Puzzle</a>
        </div>
      </div>
    </div>
  );
}