
import React from 'react';
import { DebugLevel, debugLog } from '@/utils/debug';
import { EventType, MonitoringEvent, MonitoringOptions, SecurityEvent } from '@/types/monitoringTypes';

/**
 * Service for monitoring application events and performance
 */
export class MonitoringService {
  private static instance: MonitoringService | null = null;
  private options: MonitoringOptions = {
    enableConsoleLogging: true,
    enableRemoteLogging: false,
    logLevel: DebugLevel.INFO
  };
  
  private events: MonitoringEvent[] = [];
  
  // Private constructor for singleton
  private constructor() {
    debugLog('MonitoringService', 'Initialized', DebugLevel.INFO);
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }
  
  /**
   * Configure monitoring options
   */
  public configure(options: Partial<MonitoringOptions>): void {
    this.options = {
      ...this.options,
      ...options
    };
    
    debugLog('MonitoringService', 'Configuration updated', DebugLevel.INFO, this.options);
  }
  
  /**
   * Record a monitoring event
   */
  public recordEvent<T>(eventType: EventType, data: T): void {
    const event: MonitoringEvent = {
      timestamp: Date.now(),
      eventType,
      data
    };
    
    this.events.push(event);
    
    if (this.options.enableConsoleLogging) {
      debugLog('MonitoringService', `Event recorded: ${eventType}`, DebugLevel.INFO, data);
    }
    
    if (this.options.enableRemoteLogging) {
      this.sendToRemoteLogging(event);
    }
  }
  
  /**
   * Record a security event
   */
  public recordSecurityEvent(event: SecurityEvent): void {
    this.recordEvent(EventType.SECURITY, event);
  }
  
  /**
   * Get all recorded events
   */
  public getEvents(): MonitoringEvent[] {
    return [...this.events];
  }
  
  /**
   * Clear all recorded events
   */
  public clearEvents(): void {
    this.events = [];
    debugLog('MonitoringService', 'Events cleared', DebugLevel.INFO);
  }
  
  /**
   * Send event to remote logging system
   */
  private sendToRemoteLogging(event: MonitoringEvent): void {
    // Implementation would depend on remote logging service
    debugLog('MonitoringService', 'Remote logging not implemented', DebugLevel.WARN);
  }
  
  /**
   * Creates a higher-order component that wraps the given component with monitoring
   */
  public withMonitoring<P extends object>(
    Component: React.ComponentType<P>,
    componentName: string
  ): React.FC<P> {
    const MonitoredComponent: React.FC<P> = (props) => {
      React.useEffect(() => {
        this.recordEvent(EventType.COMPONENT_MOUNT, {
          component: componentName,
          timestamp: Date.now()
        });
        
        return () => {
          this.recordEvent(EventType.COMPONENT_UNMOUNT, {
            component: componentName,
            timestamp: Date.now()
          });
        };
      }, []);
      
      return <Component {...props} />;
    };
    
    MonitoredComponent.displayName = `Monitored(${componentName})`;
    return MonitoredComponent;
  }
}

export const monitoringService = MonitoringService.getInstance();
