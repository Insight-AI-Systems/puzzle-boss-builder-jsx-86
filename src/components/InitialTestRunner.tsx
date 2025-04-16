
import React, { useEffect } from 'react';
import { runInitialTests } from '@/utils/testRunner';
import { runComponentTestSuite } from '@/utils/testing/testRunner';

const InitialTestRunner: React.FC = () => {
  useEffect(() => {
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
