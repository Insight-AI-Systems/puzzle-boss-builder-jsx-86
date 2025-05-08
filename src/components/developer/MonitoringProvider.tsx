
import React, { useState, useEffect } from 'react';
import { monitoringService } from '@/utils/monitoring/monitoringService';
import DeveloperTools from './DeveloperTools';

interface MonitoringProviderProps {
  children: React.ReactNode;
  enableDeveloperTools?: boolean;
}

// Create a safe monitoringService interface
const safeMonitoringService = {
  ...monitoringService,
  
  configure: (options: any) => {
    if (monitoringService.configure) {
      monitoringService.configure(options);
    } else {
      console.log('Monitoring configured with options:', options);
    }
  },
  
  startReporting: () => {
    if (monitoringService.startReporting) {
      monitoringService.startReporting();
    } else {
      console.log('Monitoring reporting started');
    }
  },
  
  stopReporting: () => {
    if (monitoringService.stopReporting) {
      monitoringService.stopReporting();
    } else {
      console.log('Monitoring reporting stopped');
    }
  },
  
  // Safely access enabled state using the public getter/setter
  getEnabled: () => {
    return monitoringService.getEnabled ? monitoringService.getEnabled() : (process.env.NODE_ENV === 'development');
  },
  
  setEnabled: (value: boolean) => {
    if (monitoringService.setEnabled) {
      monitoringService.setEnabled(value);
    } else {
      console.log(`Setting monitoring enabled to: ${value}`);
    }
  }
};

const MonitoringProvider: React.FC<MonitoringProviderProps> = ({
  children,
  enableDeveloperTools = process.env.NODE_ENV === 'development'
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Configure monitoring service
    safeMonitoringService.configure({
      errorTracking: true,
      userActivityTracking: true,
      developerTools: process.env.NODE_ENV === 'development',
      samplingRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1
    });
    
    // Start reporting
    safeMonitoringService.startReporting();
    
    // Mark as initialized
    setIsInitialized(true);
    
    // Clean up
    return () => {
      safeMonitoringService.stopReporting();
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
