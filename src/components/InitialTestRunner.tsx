
import * as React from 'react';
import { runInitialTests, runComponentTestSuite } from '@/utils/testing';

const InitialTestRunner: React.FC = () => {
  React.useEffect(() => {
    // Run the existing tests
    runInitialTests();
    
    // Run our new component tests
    if (process.env.NODE_ENV === 'development') {
      console.log('🧪 Running component test suite...');
      runComponentTestSuite();
    }
  }, []);

  return null; // This component doesn't render anything
};

export default InitialTestRunner;
