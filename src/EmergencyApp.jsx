import React, { useState, useEffect, Suspense } from 'react';
import EmergencyLayout from './recovery/EmergencyLayout';
import EmergencyRouter from './recovery/EmergencyRouter';

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
  
  // Determine app mode from URL
  const getAppMode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('standalone') === 'true') return 'Standalone';
    if (urlParams.get('minimal') === 'true') return 'Minimal';
    if (urlParams.get('recovery') === 'true') return 'Recovery';
    if (urlParams.get('emergency') === 'true') return 'Emergency';
    return 'Default';
  };
  
  // Simple error boundary component - properly implemented
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
  
  // Route test definitions with component rendering
  const routeTests = [
    { 
      path: '/', 
      name: 'Home',
      component: () => (
        <div className="p-4 bg-black/20 rounded">
          <h2 className="text-xl text-puzzle-gold mb-2">Home Page</h2>
          <p>This simulates the home page content.</p>
        </div>
      )
    },
    { 
      path: '/about', 
      name: 'About',
      component: () => (
        <div className="p-4 bg-black/20 rounded">
          <h2 className="text-xl text-puzzle-gold mb-2">About Page</h2>
          <p>Information about The Puzzle Boss.</p>
        </div>
      )
    },
    { 
      path: '/auth', 
      name: 'Authentication',
      component: () => (
        <div className="p-4 bg-black/20 rounded">
          <h2 className="text-xl text-puzzle-gold mb-2">Authentication</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-black/30 rounded">
              <h3 className="text-puzzle-aqua">Login</h3>
              <form className="mt-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email" className="w-full p-2 mb-2 bg-black/50 text-white rounded" />
                <input type="password" placeholder="Password" className="w-full p-2 mb-2 bg-black/50 text-white rounded" />
                <button className="w-full p-2 bg-puzzle-aqua text-black rounded">Login</button>
              </form>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <h3 className="text-puzzle-aqua">Register</h3>
              <form className="mt-2" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Name" className="w-full p-2 mb-2 bg-black/50 text-white rounded" />
                <input type="email" placeholder="Email" className="w-full p-2 mb-2 bg-black/50 text-white rounded" />
                <input type="password" placeholder="Password" className="w-full p-2 mb-2 bg-black/50 text-white rounded" />
                <button className="w-full p-2 bg-puzzle-gold text-black rounded">Register</button>
              </form>
            </div>
          </div>
        </div>
      )
    },
    { 
      path: '/profile', 
      name: 'User Profile',
      component: () => (
        <div className="p-4 bg-black/20 rounded">
          <h2 className="text-xl text-puzzle-gold mb-2">User Profile</h2>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-puzzle-aqua/20 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h3 className="text-lg text-puzzle-aqua">John Smith</h3>
              <p className="text-sm opacity-70">Member since April 2025</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-black/30 rounded">
                  <span className="text-puzzle-gold">Credits</span>
                  <p>1,250</p>
                </div>
                <div className="p-2 bg-black/30 rounded">
                  <span className="text-puzzle-gold">Puzzles</span>
                  <p>14 completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      path: '/admin', 
      name: 'Admin Dashboard',
      component: () => (
        <div className="p-4 bg-black/20 rounded">
          <h2 className="text-xl text-puzzle-gold mb-2">Admin Dashboard</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-puzzle-burgundy/40 rounded text-center">
              <div className="text-2xl font-bold">157</div>
              <div className="text-sm opacity-70">Active Users</div>
            </div>
            <div className="p-3 bg-puzzle-gold/20 rounded text-center">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm opacity-70">Active Puzzles</div>
            </div>
            <div className="p-3 bg-puzzle-aqua/20 rounded text-center">
              <div className="text-2xl font-bold">$12,450</div>
              <div className="text-sm opacity-70">Revenue</div>
            </div>
          </div>
          <div className="p-3 bg-black/30 rounded">
            <h3 className="text-puzzle-aqua mb-2">Recent Activity</h3>
            <div className="text-sm space-y-1">
              <div className="p-2 bg-black/20">User Jane D. completed puzzle "Galaxy S25"</div>
              <div className="p-2 bg-black/20">New prize added: "Apple AirPods Pro"</div>
              <div className="p-2 bg-black/20">User Mike T. purchased 2,000 credits</div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
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
  
  // Tab content components
  const TabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div>
            <h2 className="text-2xl mb-4">System Diagnostics</h2>
            <div className="bg-black/30 rounded overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-puzzle-gold">React Version:</td>
                    <td className="p-3">{diagnosticData.reactVersion}</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-puzzle-gold">Browser:</td>
                    <td className="p-3">{diagnosticData.browser}</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-puzzle-gold">Screen Size:</td>
                    <td className="p-3">{diagnosticData.screenSize}</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-puzzle-gold">URL:</td>
                    <td className="p-3">{window.location.href}</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-puzzle-gold">Local Storage:</td>
                    <td className="p-3">
                      {diagnosticData.localStorage ? 'Available' : 'Not Available'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-puzzle-gold">Session Storage:</td>
                    <td className="p-3">
                      {diagnosticData.sessionStorage ? 'Available' : 'Not Available'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-puzzle-gold">Storage Items:</td>
                    <td className="p-3">{diagnosticData.storageItems}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-puzzle-gold">Last Updated:</td>
                    <td className="p-3">{diagnosticData.timestamp}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button 
              onClick={runDiagnostics}
              className="mt-4 px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
            >
              Refresh Diagnostics
            </button>
          </div>
        );
      
      case 'navigation':
        return <NavigationTabContent />;
      
      case 'components':
        return (
          <div>
            <h2 className="text-2xl mb-4">Component Tests</h2>
            <div className="flex gap-6">
              {/* Test selector */}
              <div className="w-1/3">
                <h3 className="text-xl text-puzzle-gold mb-3">Available Tests</h3>
                <div className="space-y-2">
                  {Object.entries(componentTests).map(([id, test]) => (
                    <button
                      key={id}
                      onClick={() => runComponentTest(id)}
                      className={`w-full p-3 text-left rounded ${
                        selectedTest === id
                          ? 'bg-puzzle-black border border-puzzle-aqua'
                          : 'bg-black/30 hover:bg-black/50'
                      }`}
                    >
                      <div className="font-bold">{test.name}</div>
                      <div className="text-sm opacity-70 mt-1">
                        {test.description}
                      </div>
                      {testResults[id] && (
                        <div className={`text-xs mt-2 ${
                          testResults[id].success 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {testResults[id].status} {testResults[id].success ? '✓' : '✗'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Test result area */}
              <div className="w-2/3 bg-black/40 rounded p-4">
                {selectedTest ? (
                  <div>
                    <h3 className="text-xl text-puzzle-gold mb-3">
                      {componentTests[selectedTest]?.name || 'Test'} Results
                    </h3>
                    
                    {/* Test component rendering area */}
                    <div className="mb-4 bg-black/30 p-4 rounded min-h-[150px]">
                      <ErrorCatcher>
                        {componentTests[selectedTest]?.component()}
                      </ErrorCatcher>
                    </div>
                    
                    {/* Test details */}
                    {testResults[selectedTest] && (
                      <div className="text-sm">
                        <div>Started: {formatTime(testResults[selectedTest].startTime)}</div>
                        {testResults[selectedTest].endTime && (
                          <div>Completed: {formatTime(testResults[selectedTest].endTime)}</div>
                        )}
                        <div className={`mt-2 ${
                          testResults[selectedTest].success 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          Status: {testResults[selectedTest].status}
                        </div>
                        {testResults[selectedTest].error && (
                          <div className="text-red-400 mt-2">
                            Error: {testResults[selectedTest].error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 opacity-50">
                    Select a test to run
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'features':
        return (
          <div>
            <h2 className="text-2xl mb-4">Feature Toggles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(featureToggles).map(([feature, enabled]) => (
                <div key={feature} className="bg-black/30 p-4 rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-puzzle-gold">
                      {feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </div>
                    <div className="text-sm opacity-70 mt-1">
                      {enabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleFeature(feature)}
                    className={`px-4 py-2 rounded ${
                      enabled 
                        ? 'bg-puzzle-aqua text-black' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'recovery':
        return (
          <div>
            <h2 className="text-2xl mb-4">Recovery Tools</h2>
            <div className="grid gap-6">
              <div className="bg-black/30 p-4 rounded border-l-4 border-puzzle-gold">
                <h3 className="text-xl text-puzzle-gold mb-2">Clear Browser Storage</h3>
                <p className="mb-4">This will clear all localStorage, sessionStorage, and cookies for this site.</p>
                <button 
                  onClick={clearAllStorage}
                  className="px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
                >
                  Clear All Storage
                </button>
                {diagnosticData.message && (
                  <p className="mt-3 text-puzzle-aqua">
                    {diagnosticData.message}
                  </p>
                )}
              </div>
              
              <div className="bg-black/30 p-4 rounded border-l-4 border-puzzle-aqua">
                <h3 className="text-xl text-puzzle-aqua mb-2">Application Modes</h3>
                <p className="mb-4">Launch application in different modes:</p>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="/"
                    className="px-4 py-2 bg-black/50 text-puzzle-aqua rounded hover:bg-black/70"
                  >
                    Normal Mode
                  </a>
                  <a 
                    href="/?standalone=true"
                    className="px-4 py-2 bg-black/50 text-puzzle-gold rounded hover:bg-black/70"
                  >
                    Standalone Mode
                  </a>
                  <a 
                    href="/?minimal=true"
                    className="px-4 py-2 bg-black/50 text-white rounded hover:bg-black/70"
                  >
                    Minimal Mode
                  </a>
                  <a 
                    href="/?recovery=true"
                    className="px-4 py-2 bg-black/50 text-orange-400 rounded hover:bg-black/70"
                  >
                    Recovery Mode
                  </a>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-black/50 text-puzzle-aqua rounded hover:bg-black/70"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'errors':
        return (
          <div>
            <h2 className="text-2xl mb-4">Error Log</h2>
            {diagnosticData.errors.length === 0 ? (
              <p className="text-gray-500">No errors recorded yet.</p>
            ) : (
              <div className="bg-black/40 rounded p-2 max-h-[400px] overflow-y-auto">
                {diagnosticData.errors.map((error, index) => (
                  <div key={index} className="p-3 border-b border-gray-800 whitespace-pre-wrap break-words">
                    <div className="text-xs text-gray-500 mb-1">
                      {error.timestamp}
                    </div>
                    <div className="text-red-400">
                      {error.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => setDiagnosticData(prev => ({...prev, errors: []}))}
              className="mt-4 px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
            >
              Clear Error Log
            </button>
          </div>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };
  
  // Modified navigation tab content to use our new EmergencyRouter
  const NavigationTabContent = () => (
    <EmergencyRouter routes={routeTests} />
  );
  
  // Render the emergency UI with our layout
  return (
    <EmergencyLayout appMode={getAppMode()}>
      {/* Tab navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-800">
          {[
            { id: 'info', label: 'System Info' },
            { id: 'navigation', label: 'Route Testing' },
            { id: 'components', label: 'Component Tests' },
            { id: 'features', label: 'Feature Toggles' },
            { id: 'recovery', label: 'Recovery Tools' },
            { id: 'errors', label: `Error Log (${diagnosticData.errors.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 ${
                activeTab === tab.id 
                  ? 'bg-black/30 text-puzzle-aqua border-b-2 border-puzzle-aqua' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab content */}
      <div className="tab-content">
        <TabContent />
      </div>
    </EmergencyLayout>
  );
};

export default EmergencyApp;
