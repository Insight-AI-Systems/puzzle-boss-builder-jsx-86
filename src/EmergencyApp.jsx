
import React, { useState, useEffect, Suspense } from 'react';

/**
 * Emergency Recovery Application
 * This is a minimal standalone component that operates with minimal dependencies
 * to provide diagnostic information, recovery options, and component testing.
 */
const EmergencyApp = () => {
  // State for diagnostics and testing
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
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [featureToggles, setFeatureToggles] = useState({
    reactRouter: false,
    authContext: false,
    dataFetching: false,
    ui: false
  });
  
  // Component test definitions
  const componentTests = {
    basicReact: {
      name: 'Basic React',
      description: 'Tests basic React rendering',
      component: () => <div className="p-4 bg-black/20 rounded">Hello from React</div>
    },
    errorTest: {
      name: 'Error Boundary Test',
      description: 'Tests error boundaries',
      component: () => {
        // Intentional error component for testing
        const ErrorComponent = () => {
          throw new Error('Test error boundary');
          return null;
        };
        
        return (
          <div className="p-4 bg-black/20 rounded">
            <p>This should be caught by error boundary:</p>
            <Suspense fallback={<div>Loading...</div>}>
              <ErrorCatcher>
                <ErrorComponent />
              </ErrorCatcher>
            </Suspense>
          </div>
        );
      }
    }
  };
  
  // Route test definitions
  const routeTests = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/auth', name: 'Authentication' },
    { path: '/profile', name: 'User Profile' },
    { path: '/admin', name: 'Admin Dashboard' }
  ];
  
  // Simple error boundary component
  const ErrorCatcher = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const handleError = (event) => {
        console.error('Error caught by ErrorCatcher:', event);
        setHasError(true);
        setError(event.error || new Error('Unknown error'));
        event.preventDefault();
      };
      
      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);
    
    if (hasError) {
      return (
        <div style={{ padding: '10px', background: '#800020', color: 'white', borderRadius: '4px' }}>
          <h4>Error Caught:</h4>
          <p>{error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => setHasError(false)}
            style={{ background: '#333', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '2px', marginTop: '8px' }}
          >
            Reset
          </button>
        </div>
      );
    }
    
    return children;
  };
  
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
    try {
      console.log(`[EMERGENCY] Navigating to: ${url}`);
      setTestResults(prev => ({
        ...prev,
        navigation: {
          lastAttempt: url,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }
      }));
      
      window.location.href = url;
    } catch (e) {
      console.error(`[EMERGENCY] Navigation error to ${url}:`, e);
      setTestResults(prev => ({
        ...prev,
        navigation: {
          lastAttempt: url,
          timestamp: new Date().toISOString(),
          status: 'failed',
          error: e.message
        }
      }));
    }
  };
  
  // Run a component test
  const runComponentTest = (testId) => {
    try {
      console.log(`[EMERGENCY] Running component test: ${testId}`);
      setSelectedTest(testId);
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          startTime: new Date().toISOString(),
          status: 'running'
        }
      }));
      
      // Simulate test completion after 500ms
      setTimeout(() => {
        setTestResults(prev => ({
          ...prev,
          [testId]: {
            ...prev[testId],
            endTime: new Date().toISOString(),
            status: 'completed',
            success: true
          }
        }));
      }, 500);
    } catch (e) {
      console.error(`[EMERGENCY] Test error for ${testId}:`, e);
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          ...prev[testId],
          endTime: new Date().toISOString(),
          status: 'failed',
          error: e.message,
          success: false
        }
      }));
    }
  };
  
  // Toggle feature flags
  const toggleFeature = (feature) => {
    setFeatureToggles(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    
    console.log(`[EMERGENCY] Feature ${feature} toggled to: ${!featureToggles[feature]}`);
  };
  
  // Format time
  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString();
    } catch (e) {
      return isoString;
    }
  };
  
  // Render simple emergency UI
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#000',
      color: '#00FFFF',
      minHeight: '100vh'
    }}>
      <header style={{
        borderBottom: '2px solid #FFD700',
        paddingBottom: '10px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: '#FFD700' }}>The Puzzle Boss - Emergency Recovery</h1>
          <p>Diagnostic and recovery console for testing application components.</p>
        </div>
        <div style={{ 
          backgroundColor: '#800020', 
          padding: '8px 16px', 
          borderRadius: '4px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          EMERGENCY MODE
        </div>
      </header>
      
      {/* Tab navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #333',
        marginBottom: '20px',
        overflowX: 'auto'
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
          onClick={() => setActiveTab('navigation')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'navigation' ? '#333' : 'transparent',
            border: 'none',
            color: activeTab === 'navigation' ? '#00FFFF' : '#888',
            cursor: 'pointer'
          }}
        >
          Route Testing
        </button>
        <button 
          onClick={() => setActiveTab('components')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'components' ? '#333' : 'transparent',
            border: 'none',
            color: activeTab === 'components' ? '#00FFFF' : '#888',
            cursor: 'pointer'
          }}
        >
          Component Tests
        </button>
        <button 
          onClick={() => setActiveTab('features')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'features' ? '#333' : 'transparent',
            border: 'none',
            color: activeTab === 'features' ? '#00FFFF' : '#888',
            cursor: 'pointer'
          }}
        >
          Feature Toggles
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
                  <td style={{ padding: '8px', color: '#FFD700' }}>URL:</td>
                  <td style={{ padding: '8px' }}>{window.location.href}</td>
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
        
        {/* Navigation Testing Tab */}
        {activeTab === 'navigation' && (
          <div>
            <h2>Route Testing</h2>
            <p style={{ marginBottom: '20px' }}>
              Test navigation to different routes. Each click logs the attempt and redirects.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: '10px',
              marginBottom: '20px'
            }}>
              {routeTests.map((route) => (
                <button
                  key={route.path}
                  onClick={() => navigateTo(route.path)}
                  style={{
                    padding: '10px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    color: '#00FFFF',
                    cursor: 'pointer'
                  }}
                >
                  {route.name}
                  <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                    {route.path}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Navigation results */}
            {testResults.navigation && (
              <div style={{ 
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#1a1a1a',
                borderRadius: '4px'
              }}>
                <h3 style={{ color: '#FFD700', marginTop: 0 }}>Last Navigation Attempt</h3>
                <div style={{ color: 'white' }}>
                  <div>Path: <span style={{ color: '#00FFFF' }}>{testResults.navigation.lastAttempt}</span></div>
                  <div>Time: {formatTime(testResults.navigation.timestamp)}</div>
                  <div>Status: {testResults.navigation.status}</div>
                  {testResults.navigation.error && (
                    <div style={{ color: '#FF6B6B' }}>Error: {testResults.navigation.error}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Component Tests Tab */}
        {activeTab === 'components' && (
          <div>
            <h2>Component Tests</h2>
            <p style={{ marginBottom: '20px' }}>
              Test individual components in isolation to identify issues.
            </p>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Test selector */}
              <div style={{ width: '30%' }}>
                <h3 style={{ color: '#FFD700' }}>Available Tests</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(componentTests).map(([id, test]) => (
                    <button
                      key={id}
                      onClick={() => runComponentTest(id)}
                      style={{
                        padding: '10px',
                        background: selectedTest === id ? '#333' : '#1a1a1a',
                        border: `1px solid ${selectedTest === id ? '#00FFFF' : '#333'}`,
                        borderRadius: '4px',
                        color: selectedTest === id ? '#00FFFF' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{test.name}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        {test.description}
                      </div>
                      {testResults[id] && (
                        <div style={{ 
                          fontSize: '10px', 
                          marginTop: '6px',
                          color: testResults[id].success ? '#4CAF50' : '#FF6B6B'
                        }}>
                          {testResults[id].status} {testResults[id].success ? '✓' : '✗'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Test result area */}
              <div style={{
                width: '70%',
                backgroundColor: '#0a0a0a',
                borderRadius: '4px',
                padding: '15px',
                minHeight: '300px'
              }}>
                {selectedTest ? (
                  <div>
                    <h3 style={{ color: '#FFD700', marginTop: 0 }}>
                      {componentTests[selectedTest]?.name || 'Test'} Results
                    </h3>
                    
                    {/* Test component rendering area */}
                    <div style={{ 
                      marginBottom: '20px',
                      padding: '15px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '4px',
                      minHeight: '100px'
                    }}>
                      <ErrorCatcher>
                        {componentTests[selectedTest]?.component()}
                      </ErrorCatcher>
                    </div>
                    
                    {/* Test details */}
                    {testResults[selectedTest] && (
                      <div style={{ fontSize: '14px' }}>
                        <div>Started: {formatTime(testResults[selectedTest].startTime)}</div>
                        {testResults[selectedTest].endTime && (
                          <div>Completed: {formatTime(testResults[selectedTest].endTime)}</div>
                        )}
                        <div style={{ 
                          marginTop: '10px',
                          color: testResults[selectedTest].success ? '#4CAF50' : '#FF6B6B'
                        }}>
                          Status: {testResults[selectedTest].status}
                        </div>
                        {testResults[selectedTest].error && (
                          <div style={{ color: '#FF6B6B', marginTop: '10px' }}>
                            Error: {testResults[selectedTest].error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ color: '#888', textAlign: 'center', marginTop: '50px' }}>
                    Select a test to run
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Feature Toggles Tab */}
        {activeTab === 'features' && (
          <div>
            <h2>Feature Toggles</h2>
            <p style={{ marginBottom: '20px' }}>
              Enable or disable specific features to isolate problems.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gap: '15px',
              marginTop: '20px'
            }}>
              {Object.entries(featureToggles).map(([feature, enabled]) => (
                <div key={feature} style={{ 
                  padding: '15px', 
                  backgroundColor: '#1a1a1a', 
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#FFD700' }}>
                      {feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                      {enabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleFeature(feature)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: enabled ? '#00FFFF' : '#333',
                      color: enabled ? 'black' : '#888',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
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
                <h3 style={{ color: '#00FFFF', marginTop: 0 }}>Application Modes</h3>
                <p>Launch application in different modes:</p>
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
                    Normal Mode
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
                    onClick={() => navigateTo('/?recovery=true')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#333',
                      border: 'none',
                      color: '#FFA500',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Recovery Mode
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
              
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#1a1a1a', 
                borderRadius: '4px',
                borderLeft: '4px solid #FFA500'
              }}>
                <h3 style={{ color: '#FFA500', marginTop: 0 }}>Performance Tests</h3>
                <p>Test application performance and loading times:</p>
                <button 
                  onClick={() => {
                    console.log('[EMERGENCY] Starting performance test...');
                    const startTime = performance.now();
                    
                    // Simulate a performance test
                    setTimeout(() => {
                      const endTime = performance.now();
                      console.log(`[EMERGENCY] Performance test completed in ${endTime - startTime}ms`);
                      
                      setTestResults(prev => ({
                        ...prev,
                        performance: {
                          startTime: new Date(Date.now() - (endTime - startTime)).toISOString(),
                          endTime: new Date().toISOString(),
                          duration: `${(endTime - startTime).toFixed(2)}ms`,
                          status: 'completed'
                        }
                      }));
                    }, 1000);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#FFA500',
                    border: 'none',
                    color: 'black',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Run Performance Test
                </button>
                
                {testResults.performance && (
                  <div style={{ 
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    borderRadius: '4px'
                  }}>
                    <div>Start: {formatTime(testResults.performance.startTime)}</div>
                    <div>End: {formatTime(testResults.performance.endTime)}</div>
                    <div>Duration: {testResults.performance.duration}</div>
                  </div>
                )}
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
        The Puzzle Boss - Emergency Recovery System v1.1
      </footer>
    </div>
  );
};

export default EmergencyApp;
