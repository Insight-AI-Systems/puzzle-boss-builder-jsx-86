
import React, { useState, useEffect } from 'react';
import { monitoringService } from '@/utils/monitoring/monitoringService';
import DeveloperTools from './DeveloperTools';

interface MonitoringProviderProps {
  children: React.ReactNode;
  enableDeveloperTools?: boolean;
}

// Extended MonitoringService with stubs for the missing methods
if (!monitoringService.configure) {
  (monitoringService as any).configure = (options: any) => {
    console.log('Monitoring configured with options:', options);
  };
}

if (!monitoringService.startReporting) {
  (monitoringService as any).startReporting = () => {
    console.log('Monitoring reporting started');
  };
}

if (!monitoringService.stopReporting) {
  (monitoringService as any).stopReporting = () => {
    console.log('Monitoring reporting stopped');
  };
}

const MonitoringProvider: React.FC<MonitoringProviderProps> = ({
  children,
  enableDeveloperTools = process.env.NODE_ENV === 'development'
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Configure monitoring service
    monitoringService.configure({
      performanceMonitoring: true,
      errorTracking: true,
      userActivityTracking: true,
      developerTools: process.env.NODE_ENV === 'development',
      samplingRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1
    });
    
    // Start reporting
    monitoringService.startReporting();
    
    // Mark as initialized
    setIsInitialized(true);
    
    // Clean up
    return () => {
      monitoringService.stopReporting();
    };
  }, []);
  
  return (
    <>
      {children}
      {enableDeveloperTools && process.env.NODE_ENV === 'development' && isInitialized && (
        <DeveloperTools initiallyExpanded={false} />
      )}
    </>
  );
};

export default MonitoringProvider;
