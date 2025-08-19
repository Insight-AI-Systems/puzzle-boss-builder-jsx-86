import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function SimpleLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@puzzleboss.com');
  const [password, setPassword] = useState('Admin123!@#');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
            full_name: 'Test Admin'
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        setMessage('Account created successfully! You can now sign in.');
        
        // Try to set admin role
        try {
          await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'admin'
            });
        } catch (e) {
          console.error('Role setup error:', e);
        }
      }
    } catch (error: any) {
      setMessage(`Sign up error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        setMessage(`Signed in successfully as ${data.user.email}!`);
        
        // Check for admin role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        setTimeout(() => {
          if (roleData?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1000);
      }
    } catch (error: any) {
      setMessage(`Sign in error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setMessage(`Active session: ${session.user.email}`);
    } else {
      setMessage('No active session. Please sign in.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMessage('Signed out successfully!');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '2rem',
        background: '#1a1a1a',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          🔐 Quick Login
        </h1>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              background: '#2a2a2a',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              color: '#ffffff'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              background: '#2a2a2a',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              color: '#ffffff'
            }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={handleSignUp}
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              background: '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            Sign Up
          </button>
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            Sign In
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={checkSession}
            style={{
              padding: '0.75rem',
              fontSize: '0.9rem',
              background: '#3a3a3a',
              color: '#ffffff',
              border: '1px solid #4a4a4a',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Check Session
          </button>
          <button
            onClick={handleSignOut}
            style={{
              padding: '0.75rem',
              fontSize: '0.9rem',
              background: '#3a3a3a',
              color: '#ffffff',
              border: '1px solid #4a4a4a',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
        
        {message && (
          <div style={{
            padding: '1rem',
            background: message.includes('error') ? '#991b1b' : '#166534',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}
        
        <div style={{
          padding: '1rem',
          background: '#2a2a2a',
          borderRadius: '6px',
          fontSize: '0.9rem'
        }}>
          <strong>Test Credentials:</strong><br />
          Email: admin@puzzleboss.com<br />
          Password: Admin123!@#
        </div>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="/" style={{ color: '#8b5cf6', marginRight: '1rem' }}>Home</a>
          <a href="/admin" style={{ color: '#8b5cf6', marginRight: '1rem' }}>Admin</a>
          <a href="/games/jigsaw" style={{ color: '#8b5cf6' }}>New Puzzle</a>
        </div>
      </div>
    </div>
  );
}