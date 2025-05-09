
import React, { useState, useEffect } from 'react';
import { monitoringService } from '@/utils/monitoring/monitoringService';
import DeveloperTools from './DeveloperTools';
import { useAuth } from '@/contexts/AuthContext';
import { isProtectedAdmin } from '@/constants/securityConfig';

interface MonitoringProviderProps {
  children: React.ReactNode;
  enableDeveloperTools?: boolean;
}

// Create a safe monitoring service access
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
  enableDeveloperTools = true // Changed to true by default to ensure admin tools are available
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, isAdmin } = useAuth();
  const hasAdminAccess = isAdmin || isProtectedAdmin(user?.email);
  
  useEffect(() => {
    // Configure monitoring service
    safeMonitoringService.configure({
      errorTracking: true,
      userActivityTracking: true,
      developerTools: true, // Always enable developer tools
      samplingRate: 1.0 // Always set to 1.0 to ensure all events are tracked
    });
    
    // Start reporting
    safeMonitoringService.startReporting();
    
    // Mark as initialized
    setIsInitialized(true);
    
    // Ensure monitoring is enabled
    safeMonitoringService.setEnabled(true);
    
    // Clean up
    return () => {
      safeMonitoringService.stopReporting();
    };
  }, []);
  
  return (
    <>
      {children}
      {enableDeveloperTools && isInitialized && hasAdminAccess && (
        <DeveloperTools initiallyExpanded={true} />
      )}
    </>
  );
};

export default MonitoringProvider;
