
import React, { useEffect } from 'react';
import { runInitialTests } from '@/utils/testRunner';

const InitialTestRunner: React.FC = () => {
  useEffect(() => {
    runInitialTests();
  }, []);

  return null; // This component doesn't render anything
};

export default InitialTestRunner;
