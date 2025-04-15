
import React, { useState, useEffect } from 'react';

const useAppInitialization = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appMessage, setAppMessage] = useState('Initializing application...');
  const [appState, setAppState] = useState('initializing');
  const [initLogs, setInitLogs] = useState([]);
  const [loadingStages, setLoadingStages] = useState([
    { name: 'environment', status: 'pending', error: null },
    { name: 'react', status: 'pending', error: null },
    { name: 'components', status: 'pending', error: null },
    { name: 'services', status: 'pending', error: null }
  ]);

  const logInit = (message, isError = false) => {
    console.log(`[WRAPPER] ${message}`);
    const newLog = { timestamp: new Date().toISOString(), message, isError };
    setInitLogs(prev => [...prev, newLog]);
    return newLog;
  };

  const updateStage = (stageName, status, error = null) => {
    setLoadingStages(prev => 
      prev.map(stage => 
        stage.name === stageName 
          ? { ...stage, status, error } 
          : stage
      )
    );
  };

  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    appMessage,
    setAppMessage,
    appState,
    setAppState,
    initLogs,
    setInitLogs,
    loadingStages,
    setLoadingStages,
    logInit,
    updateStage
  };
};

export default useAppInitialization;
