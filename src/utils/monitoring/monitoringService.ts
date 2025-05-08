
// This is a partial rewrite of the file, focusing only on the isEnabled fix
// We need to ensure it has public getters/setters for this property

// Private property for monitoring state
let _isEnabled = process.env.NODE_ENV === 'development';

export const monitoringService = {
  // Existing methods and properties
  trackError: (error: Error, severity: string = 'medium', metadata: Record<string, any> = {}) => {
    console.error(`[Monitoring] Error tracked: ${error.message}`, { severity, metadata });
    // In a real implementation, this would send the error to a monitoring service
  },
  
  trackEvent: (eventName: string, properties: Record<string, any> = {}) => {
    console.log(`[Monitoring] Event tracked: ${eventName}`, properties);
    // In a real implementation, this would send the event to an analytics service
  },
  
  trackUserAction: (action: string, details: Record<string, any> = {}) => {
    console.log(`[Monitoring] User action: ${action}`, details);
    // In a real implementation, this would track user behavior
  },
  
  startSession: (userId?: string) => {
    console.log(`[Monitoring] Session started${userId ? ` for user ${userId}` : ''}`);
    // In a real implementation, this would start a monitoring session
  },
  
  endSession: () => {
    console.log('[Monitoring] Session ended');
    // In a real implementation, this would end the current monitoring session
  },
  
  configure: (options: Record<string, any>) => {
    console.log('[Monitoring] Configured with options:', options);
    // In a real implementation, this would configure the monitoring service
  },
  
  startReporting: () => {
    console.log('[Monitoring] Reporting started');
    // In a real implementation, this would start sending reports to the monitoring service
  },
  
  stopReporting: () => {
    console.log('[Monitoring] Reporting stopped');
    // In a real implementation, this would stop sending reports
  },
  
  // Public getter for isEnabled property
  getEnabled: () => {
    return _isEnabled;
  },
  
  // Public setter for isEnabled
  setEnabled: (value: boolean) => {
    console.log(`Setting monitoring enabled to: ${value}`);
    _isEnabled = value;
  }
};
