
import React, { useState, useEffect, useContext, createContext } from 'react';

// Create a simple context for testing context functionality
const TestContext = createContext({ value: 'default', setValue: () => {} });

/**
 * A component that tests various React features
 * and reports on their functionality
 */
const ReactTester = () => {
  const [stateTest, setStateTest] = useState('State working');
  const [effectTest, setEffectTest] = useState('Effect not run');
  const [contextTest, setContextTest] = useState('default');
  const [renderCount, setRenderCount] = useState(0);
  
  // Track render count
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    
    if (window.__addDiagnosticLog) {
      window.__addDiagnosticLog(`ReactTester rendered (count: ${renderCount + 1})`);
    }
  }, [stateTest, effectTest, contextTest]);
  
  // Test useEffect functionality
  useEffect(() => {
    if (window.__addDiagnosticLog) {
      window.__addDiagnosticLog('Effect hook executed successfully');
    }
    
    setEffectTest('Effect working');
    
    const timer = setTimeout(() => {
      if (window.__addDiagnosticLog) {
        window.__addDiagnosticLog('Effect timer fired successfully');
      }
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      if (window.__addDiagnosticLog) {
        window.__addDiagnosticLog('Effect cleanup function called');
      }
    };
  }, []);
  
  // Context Provider component
  const ContextProvider = ({ children }) => {
    const [value, setValue] = useState(contextTest);
    
    return (
      <TestContext.Provider value={{ value, setValue }}>
        {children}
      </TestContext.Provider>
    );
  };
  
  // Context Consumer component
  const ContextConsumer = () => {
    const { value, setValue } = useContext(TestContext);
    
    return (
      <div className="p-2 bg-black/20 rounded">
        <p className="text-sm mb-2">Context value: <span className="text-puzzle-gold">{value}</span></p>
        <button 
          onClick={() => {
            setValue(`Context updated at ${new Date().toLocaleTimeString()}`);
            if (window.__addDiagnosticLog) {
              window.__addDiagnosticLog('Context value updated via consumer');
            }
          }}
          className="text-xs bg-puzzle-burgundy text-white px-2 py-1 rounded"
        >
          Update Context
        </button>
      </div>
    );
  };
  
  return (
    <div className="react-tester bg-black/30 p-4 rounded border border-puzzle-aqua/50 mt-4">
      <h3 className="text-puzzle-aqua text-sm font-bold mb-2">React Feature Tester</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-2 bg-black/20 rounded">
          <p className="mb-2">useState Test: <span className="text-puzzle-gold">{stateTest}</span></p>
          <button 
            onClick={() => {
              setStateTest(`State updated at ${new Date().toLocaleTimeString()}`);
              if (window.__addDiagnosticLog) {
                window.__addDiagnosticLog('State updated via setState');
              }
            }}
            className="bg-puzzle-burgundy text-white px-2 py-1 rounded"
          >
            Update State
          </button>
        </div>
        
        <div className="p-2 bg-black/20 rounded">
          <p className="mb-2">useEffect Test: <span className="text-puzzle-gold">{effectTest}</span></p>
          <p className="text-gray-400 text-xs italic">Effect should run automatically on mount</p>
        </div>
        
        <ContextProvider>
          <ContextConsumer />
        </ContextProvider>
        
        <div className="p-2 bg-black/20 rounded">
          <p className="mb-2">Render Count: <span className="text-puzzle-gold">{renderCount}</span></p>
          <button 
            onClick={() => {
              setRenderCount(0);
              if (window.__addDiagnosticLog) {
                window.__addDiagnosticLog('Render count reset to 0');
              }
            }}
            className="bg-puzzle-burgundy text-white px-2 py-1 rounded"
          >
            Reset Count
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactTester;
