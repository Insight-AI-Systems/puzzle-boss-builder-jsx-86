
import React, { useState, useEffect } from 'react';
import EmergencyLayout from './recovery/EmergencyLayout';
import EmergencyRouter from './recovery/EmergencyRouter';
import TabNav from './emergency/components/TabNav';
import SystemInfoTab from './emergency/tabs/SystemInfoTab';
import ComponentTestTab from './emergency/tabs/ComponentTestTab';
import FeatureToggleTab from './emergency/tabs/FeatureToggleTab';
import RecoveryTab from './emergency/tabs/RecoveryTab';
import ErrorLogTab from './emergency/tabs/ErrorLogTab';

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
  const [testResults, setTestResults] = useState({});
  const [featureToggles, setFeatureToggles] = useState({
    reactRouter: false,
    authContext: false,
    dataFetching: false,
    ui: false
  });

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
        throw new Error('Test error boundary');
        return null;
      }
    }
  };

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

  useEffect(() => {
    console.log('[EMERGENCY] Running diagnostics...');
    runDiagnostics();
    
    const originalError = console.error;
    console.error = (...args) => {
      setDiagnosticData(prev => ({
        ...prev,
        errors: [...prev.errors, {
          message: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '),
          timestamp: new Date().toISOString()
        }].slice(-10)
      }));
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  const runDiagnostics = () => {
    try {
      const canUseLocalStorage = checkStorage('localStorage');
      const canUseSessionStorage = checkStorage('sessionStorage');
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

  const clearAllStorage = () => {
    try {
      if (window.localStorage) window.localStorage.clear();
      if (window.sessionStorage) window.sessionStorage.clear();
      
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

  const runComponentTest = (testId) => {
    try {
      console.log(`[EMERGENCY] Running component test: ${testId}`);
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          startTime: new Date().toISOString(),
          status: 'running'
        }
      }));
      
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

  const toggleFeature = (feature) => {
    setFeatureToggles(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    console.log(`[EMERGENCY] Feature ${feature} toggled to: ${!featureToggles[feature]}`);
  };

  // Function to switch app modes
  const switchAppMode = (mode) => {
    if (window.appRecovery && window.appRecovery.switchMode) {
      window.appRecovery.switchMode(mode);
    } else {
      // Fallback if appRecovery is not available
      try {
        const url = new URL(window.location);
        url.searchParams.set('mode', mode);
        window.location = url.toString();
      } catch (e) {
        console.error('[EMERGENCY] Error switching mode:', e);
        alert(`Error switching to ${mode} mode: ${e.message}`);
      }
    }
  };

  const tabs = [
    { id: 'info', label: 'System Info' },
    { id: 'navigation', label: 'Route Testing' },
    { id: 'components', label: 'Component Tests' },
    { id: 'features', label: 'Feature Toggles' },
    { id: 'recovery', label: 'Recovery Tools' },
    { id: 'errors', label: `Error Log (${diagnosticData.errors.length})` }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <SystemInfoTab diagnosticData={diagnosticData} runDiagnostics={runDiagnostics} />;
      case 'navigation':
        return <EmergencyRouter routes={routeTests} />;
      case 'components':
        return <ComponentTestTab 
          componentTests={componentTests} 
          testResults={testResults} 
          runComponentTest={runComponentTest} 
        />;
      case 'features':
        return <FeatureToggleTab featureToggles={featureToggles} toggleFeature={toggleFeature} />;
      case 'recovery':
        return <RecoveryTab clearAllStorage={clearAllStorage} diagnosticData={diagnosticData} />;
      case 'errors':
        return <ErrorLogTab 
          diagnosticData={diagnosticData} 
          clearErrors={() => setDiagnosticData(prev => ({...prev, errors: []}))} 
        />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <EmergencyLayout appMode={window.location.search.includes('standalone=true') ? 'Standalone' : 'Emergency'}>
      {/* Mode switching buttons */}
      <div className="mb-4 p-3 bg-black/30 border border-puzzle-aqua rounded">
        <h3 className="text-lg text-puzzle-gold mb-2">Application Mode</h3>
        <p className="text-sm text-white mb-3">
          You are currently in <span className="text-puzzle-burgundy font-bold">Emergency Mode</span>. 
          Try transitioning to another mode:
        </p>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => switchAppMode('minimal')}
            className="px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80"
          >
            Try Minimal Mode
          </button>
          <button 
            onClick={() => switchAppMode('normal')}
            className="px-4 py-2 bg-puzzle-gold text-black rounded hover:bg-puzzle-gold/80"
          >
            Try Normal Mode
          </button>
          <button 
            onClick={() => switchAppMode('standalone')}
            className="px-4 py-2 bg-white/80 text-black rounded hover:bg-white"
          >
            Standalone Mode
          </button>
        </div>
      </div>
      
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </EmergencyLayout>
  );
};

export default EmergencyApp;
