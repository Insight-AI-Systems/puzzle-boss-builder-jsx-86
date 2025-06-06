
import * as React from 'react';
import { runInitialTests, runComponentTestSuite } from '@/utils/testing';

const InitialTestRunner: React.FC = () => {
  React.useEffect(() => {
    // Run the unified initial tests
    runInitialTests();
    
    // Run component tests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🧪 Running component test suite...');
      runComponentTestSuite();
    }
  }, []);

  return null; // This component doesn't render anything
};

export default InitialTestRunner;
