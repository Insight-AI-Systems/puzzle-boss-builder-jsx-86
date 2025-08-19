import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function DirectAccess() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionInfo(session);
        setMessage(`✅ Active session: ${session.user.email}`);
        
        // Check role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (roleData) {
          setMessage(prev => `${prev}\nRole: ${roleData.role || 'user'}`);
        }
      } else {
        setMessage('No active session');
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const createAndAutoLogin = async (email: string, isAdmin: boolean = false) => {
    setIsLoading(true);
    setMessage('Processing...');
    
    const password = isAdmin ? 'Admin123!@#' : 'User123!@#';
    const displayName = isAdmin ? 'Admin User' : email.split('@')[0];
    
    try {
      // First, try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: displayName,
            email_verified: true, // Mark as verified
            role: isAdmin ? 'admin' : 'user'
          }
        }
      });

      if (signUpError) {
        // If user exists, just sign in
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('already exists')) {
          
          setMessage('User exists, signing in...');
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });

          if (signInError) {
            // Try with default Supabase test password
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: email,
              password: 'password123' // Common test password
            });
            
            if (retryError) {
              throw new Error(`Cannot sign in. You may need to reset password for ${email}`);
            }
            
            if (retryData?.session) {
              setSessionInfo(retryData.session);
              setMessage(`✅ Signed in successfully as: ${email}`);
              
              if (isAdmin) {
                setTimeout(() => navigate('/admin'), 1500);
              }
              return;
            }
          }

          if (signInData?.session) {
            setSessionInfo(signInData.session);
            setMessage(`✅ Signed in successfully as: ${email}`);
            
            if (isAdmin) {
              setTimeout(() => navigate('/admin'), 1500);
            }
            return;
          }
        } else {
          throw signUpError;
        }
      }

      // If sign up succeeded, auto sign in
      if (signUpData?.user) {
        setMessage('Account created! Auto-signing in...');
        
        // Auto sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (signInError) throw signInError;

        if (signInData?.session) {
          setSessionInfo(signInData.session);
          setMessage(`✅ Success! Logged in as: ${email}`);
          
          // Set admin role if needed
          if (isAdmin && signInData.user) {
            try {
              await supabase.from('user_roles').upsert({
                user_id: signInData.user.id,
                role: 'admin'
              });
            } catch (e) {
              console.log('Role setting skipped:', e);
            }
          }
          
          if (isAdmin) {
            setTimeout(() => navigate('/admin'), 1500);
          }
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSessionInfo(null);
    setMessage('Signed out successfully');
    checkSession();
  };

  // Quick access for your email
  const quickAccessAlan = () => {
    createAndAutoLogin('alan@insight-ai-systems.com', true);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '1rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1.5rem', 
          textAlign: 'center',
          color: '#fff'
        }}>
          🚀 Direct Access Portal
        </h1>

        {sessionInfo ? (
          <div style={{
            padding: '1rem',
            background: '#065f46',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #10b981'
          }}>
            <strong>✅ Logged In</strong><br />
            Email: {sessionInfo.user.email}<br />
            ID: {sessionInfo.user.id}
          </div>
        ) : (
          <div style={{
            padding: '1rem',
            background: '#1f2937',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Not logged in - Click a button below to access
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#9ca3af' }}>Quick Access Options:</h3>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {/* Direct access for Alan */}
            <button
              onClick={quickAccessAlan}
              disabled={isLoading}
              style={{
                padding: '1rem',
                background: 'linear-gradient(90deg, #dc2626, #991b1b)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              👑 Access as Alan (Admin)
            </button>

            {/* Test accounts */}
            <button
              onClick={() => createAndAutoLogin('test.admin@puzzleboss.com', true)}
              disabled={isLoading}
              style={{
                padding: '1rem',
                background: 'linear-gradient(90deg, #7c3aed, #5b21b6)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              🔧 Access as Test Admin
            </button>

            <button
              onClick={() => createAndAutoLogin('test.user@puzzleboss.com', false)}
              disabled={isLoading}
              style={{
                padding: '1rem',
                background: 'linear-gradient(90deg, #059669, #047857)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              👤 Access as Test User
            </button>

            {sessionInfo && (
              <button
                onClick={signOut}
                style={{
                  padding: '1rem',
                  background: '#374151',
                  color: '#fff',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🚪 Sign Out
              </button>
            )}
          </div>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            background: message.includes('✅') ? '#065f46' : message.includes('❌') ? '#7f1d1d' : '#1f2937',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            whiteSpace: 'pre-line',
            border: `1px solid ${message.includes('✅') ? '#10b981' : message.includes('❌') ? '#ef4444' : '#374151'}`
          }}>
            {message}
          </div>
        )}

        <div style={{
          padding: '1rem',
          background: '#111827',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <strong>📝 Account Passwords:</strong><br />
          alan@insight-ai-systems.com: Admin123!@#<br />
          test.admin@puzzleboss.com: Admin123!@#<br />
          test.user@puzzleboss.com: User123!@#
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #374151'
        }}>
          <a 
            href="/" 
            style={{ 
              padding: '0.75rem',
              background: '#1f2937',
              color: '#9ca3af',
              textAlign: 'center',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: '1px solid #374151'
            }}
          >
            🏠 Home
          </a>
          <a 
            href="/admin" 
            style={{ 
              padding: '0.75rem',
              background: '#1f2937',
              color: '#9ca3af',
              textAlign: 'center',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: '1px solid #374151'
            }}
          >
            ⚙️ Admin
          </a>
          <a 
            href="/games/jigsaw" 
            style={{ 
              padding: '0.75rem',
              background: '#1f2937',
              color: '#9ca3af',
              textAlign: 'center',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: '1px solid #374151'
            }}
          >
            🧩 Puzzle
          </a>
        </div>
      </div>
    </div>
  );
}