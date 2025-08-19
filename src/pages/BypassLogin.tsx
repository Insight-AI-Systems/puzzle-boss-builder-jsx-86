import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BypassLogin() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  // Set a bypass flag in localStorage to skip authentication
  const enableBypassMode = () => {
    // Store bypass credentials in localStorage
    const bypassUser = {
      id: 'bypass-user-001',
      email: 'alan@insight-ai-systems.com',
      role: 'admin',
      full_name: 'Alan (Bypass Mode)',
      created_at: new Date().toISOString(),
      bypass_mode: true
    };

    localStorage.setItem('bypass_auth', 'true');
    localStorage.setItem('bypass_user', JSON.stringify(bypassUser));
    
    setMessage('✅ Bypass mode enabled! You can now access all pages.');
    
    // Redirect to admin after 1 second
    setTimeout(() => {
      navigate('/admin');
    }, 1000);
  };

  const disableBypassMode = () => {
    localStorage.removeItem('bypass_auth');
    localStorage.removeItem('bypass_user');
    setMessage('Bypass mode disabled. Normal authentication required.');
  };

  const checkBypassStatus = () => {
    const bypassEnabled = localStorage.getItem('bypass_auth') === 'true';
    const bypassUser = localStorage.getItem('bypass_user');
    
    if (bypassEnabled && bypassUser) {
      const user = JSON.parse(bypassUser);
      setMessage(`Bypass Mode: ACTIVE\nUser: ${user.email}\nRole: ${user.role}`);
    } else {
      setMessage('Bypass Mode: INACTIVE');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          textAlign: 'center',
          color: '#1e293b'
        }}>
          🔓 Bypass Authentication
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          marginBottom: '2rem'
        }}>
          Skip Supabase authentication for development
        </p>

        <div style={{
          background: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <strong>⚠️ Development Mode Only</strong><br />
          This bypasses all authentication. Only use for testing!
        </div>

        <div style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={enableBypassMode}
            style={{
              padding: '1rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ✅ Enable Bypass Mode (Access as Admin)
          </button>

          <button
            onClick={checkBypassStatus}
            style={{
              padding: '1rem',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔍 Check Status
          </button>

          <button
            onClick={disableBypassMode}
            style={{
              padding: '1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ❌ Disable Bypass Mode
          </button>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            background: message.includes('✅') ? '#dcfce7' : '#f3f4f6',
            border: `2px solid ${message.includes('✅') ? '#10b981' : '#d1d5db'}`,
            borderRadius: '8px',
            marginBottom: '1.5rem',
            whiteSpace: 'pre-line'
          }}>
            {message}
          </div>
        )}

        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <a href="/" style={{ color: '#6366f1', marginRight: '1rem', textDecoration: 'none', fontWeight: '600' }}>
            🏠 Home
          </a>
          <a href="/admin" style={{ color: '#6366f1', marginRight: '1rem', textDecoration: 'none', fontWeight: '600' }}>
            ⚙️ Admin
          </a>
          <a href="/games/jigsaw" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>
            🧩 Puzzle
          </a>
        </div>
      </div>
    </div>
  );
}