
import React, { useState, useEffect } from 'react';

/**
 * Emergency Recovery Application
 * This is a minimal standalone component that operates with minimal dependencies
 * to provide diagnostic information and recovery options when the main app fails.
 */
const EmergencyApp = () => {
  const [diagnosticData, setDiagnosticData] = useState({
    browser: navigator.userAgent,
    timestamp: new Date().toISOString(),
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    reactVersion: React.version || 'unknown',
    localStorage: false,
    sessionStorage: false,
    storageItems: 0,
    errors: []
  });
  
  const [activeTab, setActiveTab] = useState('info');
  
  // Run diagnostics on mount
  useEffect(() => {
    console.log('[EMERGENCY] Running diagnostics...');
    runDiagnostics();
    
    // Register global error handler
    const originalError = console.error;
    console.error = (...args) => {
      setDiagnosticData(prev => ({
        ...prev,
        errors: [...prev.errors, {
          message: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '),
          timestamp: new Date().toISOString()
        }].slice(-10) // Keep last 10 errors only
      }));
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);
  
  // Basic diagnostic function
  const runDiagnostics = () => {
    try {
      // Check localStorage
      const canUseLocalStorage = checkStorage('localStorage');
      
      // Check sessionStorage
      const canUseSessionStorage = checkStorage('sessionStorage');
      
      // Count storage items
      let storageCount = 0;
      if (canUseLocalStorage) {
        storageCount = Object.keys(localStorage).length;
      }
      
      setDiagnosticData(prev => ({
        ...prev,
        localStorage: canUseLocalStorage,
        sessionStorage: canUseSessionStorage,
        storageItems: storageCount,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error('[EMERGENCY] Diagnostic error:', e);
    }
  };
  
  // Helper to check storage availability
  const checkStorage = (type) => {
    try {
      const storage = window[type];
      const testKey = '__test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Clear all browser storage
  const clearAllStorage = () => {
    try {
      if (window.localStorage) {
        window.localStorage.clear();
      }
      if (window.sessionStorage) {
        window.sessionStorage.clear();
      }
      
      // Clear cookies
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      
      runDiagnostics();
      setDiagnosticData(prev => ({
        ...prev, 
        message: 'All storage cleared successfully'
      }));
    } catch (e) {
      console.error('[EMERGENCY] Clear storage error:', e);
      setDiagnosticData(prev => ({
        ...prev, 
        message: `Error clearing storage: ${e.message}`
      }));
    }
  };
  
  // Simple navigation handler
  const navigateTo = (url) => {
    window.location.href = url;
  };
  
  // Render simple emergency UI
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#000',
      color: '#00FFFF',
      minHeight: '100vh'
    }}>
      <header style={{
        borderBottom: '2px solid #FFD700',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#FFD700' }}>The Puzzle Boss - Emergency Recovery</h1>
        <p>This is an emergency mode for diagnostic and recovery operations.</p>
      </header>
      
      {/* Tab navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #333',
        marginBottom: '20px'
      }}>
        <button 
          onClick={() => setActiveTab('info')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'info' ? '#333' : 'transparent',
            border: 'none',
            color: activeTab === 'info' ? '#00FFFF' : '#888',
            cursor: 'pointer'
          }}
        >
          System Info
        </button>
        <button 
          onClick={() => setActiveTab('recovery')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'recovery' ? '#333' : 'transparent',
            border: 'none',
            color: activeTab === 'recovery' ? '#00FFFF' : '#888',
            cursor: 'pointer'
          }}
        >
          Recovery Tools
        </button>
        <button 
          onClick={() => setActiveTab('errors')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'errors' ? '#333' : 'transparent',
            border: 'none',
            color: activeTab === 'errors' ? '#00FFFF' : '#888',
            cursor: 'pointer'
          }}
        >
          Error Log ({diagnosticData.errors.length})
        </button>
      </div>
      
      {/* Tab content */}
      <div style={{ padding: '10px' }}>
        {/* System Info Tab */}
        {activeTab === 'info' && (
          <div>
            <h2>System Diagnostics</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '8px', color: '#FFD700' }}>React Version:</td>
                  <td style={{ padding: '8px' }}>{diagnosticData.reactVersion}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '8px', color: '#FFD700' }}>Browser:</td>
                  <td style={{ padding: '8px' }}>{diagnosticData.browser}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '8px', color: '#FFD700' }}>Screen Size:</td>
                  <td style={{ padding: '8px' }}>{diagnosticData.screenSize}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '8px', color: '#FFD700' }}>Local Storage:</td>
                  <td style={{ padding: '8px' }}>
                    {diagnosticData.localStorage ? 'Available' : 'Not Available'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '8px', color: '#FFD700' }}>Session Storage:</td>
                  <td style={{ padding: '8px' }}>
                    {diagnosticData.sessionStorage ? 'Available' : 'Not Available'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '8px', color: '#FFD700' }}>Storage Items:</td>
                  <td style={{ padding: '8px' }}>{diagnosticData.storageItems}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '8px', color: '#FFD700' }}>Last Updated:</td>
                  <td style={{ padding: '8px' }}>{diagnosticData.timestamp}</td>
                </tr>
              </tbody>
            </table>
            <button 
              onClick={runDiagnostics}
              style={{
                marginTop: '20px',
                padding: '8px 16px',
                backgroundColor: '#800020',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh Diagnostics
            </button>
          </div>
        )}
        
        {/* Recovery Tools Tab */}
        {activeTab === 'recovery' && (
          <div>
            <h2>Recovery Tools</h2>
            <div style={{ 
              display: 'grid', 
              gap: '20px',
              marginTop: '20px'
            }}>
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#1a1a1a', 
                borderRadius: '4px',
                borderLeft: '4px solid #FFD700'
              }}>
                <h3 style={{ color: '#FFD700', marginTop: 0 }}>Clear Browser Storage</h3>
                <p>This will clear all localStorage, sessionStorage, and cookies for this site.</p>
                <button 
                  onClick={clearAllStorage}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#800020',
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Clear All Storage
                </button>
                {diagnosticData.message && (
                  <p style={{ marginTop: '10px', color: '#00FFFF' }}>
                    {diagnosticData.message}
                  </p>
                )}
              </div>
              
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#1a1a1a', 
                borderRadius: '4px',
                borderLeft: '4px solid #00FFFF'
              }}>
                <h3 style={{ color: '#00FFFF', marginTop: 0 }}>Navigation Options</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => navigateTo('/')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#333',
                      border: 'none',
                      color: '#00FFFF',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => navigateTo('/?standalone=true')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#333',
                      border: 'none',
                      color: '#FFD700',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Standalone Mode
                  </button>
                  <button 
                    onClick={() => navigateTo('/?minimal=true')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#333',
                      border: 'none',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Minimal Mode
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#333',
                      border: 'none',
                      color: '#00FFFF',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Log Tab */}
        {activeTab === 'errors' && (
          <div>
            <h2>Error Log</h2>
            {diagnosticData.errors.length === 0 ? (
              <p style={{ color: '#888' }}>No errors recorded yet.</p>
            ) : (
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                backgroundColor: '#1a1a1a',
                borderRadius: '4px',
                padding: '10px'
              }}>
                {diagnosticData.errors.map((error, index) => (
                  <div key={index} style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid #333',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    <div style={{ color: '#888', fontSize: '0.8em', marginBottom: '5px' }}>
                      {error.timestamp}
                    </div>
                    <div style={{ color: '#FF6B6B' }}>
                      {error.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => setDiagnosticData(prev => ({...prev, errors: []}))}
              style={{
                marginTop: '20px',
                padding: '8px 16px',
                backgroundColor: '#800020',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Error Log
            </button>
          </div>
        )}
      </div>
      
      <footer style={{ 
        marginTop: '40px', 
        borderTop: '1px solid #333',
        paddingTop: '20px',
        fontSize: '0.8rem',
        color: '#888',
        textAlign: 'center'
      }}>
        The Puzzle Boss - Emergency Recovery System v1.0
      </footer>
    </div>
  );
};

export default EmergencyApp;
