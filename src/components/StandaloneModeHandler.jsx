
import React from 'react';
import StandaloneApp from '@/StandaloneApp';

const StandaloneModeHandler = () => {
  // Handle standalone mode from URL
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  
  if (isStandalone) {
    return <StandaloneApp />;
  }
  
  return null;
};

export default StandaloneModeHandler;
