
import React from 'react';
import MinimalApp from '@/MinimalApp';

const StandaloneModeHandler = () => {
  // Handle standalone mode from URL
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('standalone') === 'true';
  
  if (isStandalone) {
    return <MinimalApp isStandalone={true} />;
  }
  
  return null;
};

export default StandaloneModeHandler;
