import { debugLog, DebugLevel } from '@/utils/debug';
import { supabase } from '@/integrations/supabase/client';

// Define error priorities
export enum ErrorPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Define event types
export enum MonitoringEventType {
  ERROR = 'error',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  USER_ACTION = 'user_action'
}

interface MonitoringEvent {
  type: MonitoringEventType;
  timestamp: number; // Unix timestamp
  data: Record<string, any>;
  userId?: string;
}

/**
 * Monitoring Service
 * Central service for tracking errors, performance, and user activity
 */
class MonitoringService {
  private static instance: MonitoringService;
  private events: MonitoringEvent[] = [];
  private maxQueueSize = 50;
  private flushInterval: NodeJS.Timeout | null = null;
  private flushIntervalMs = 30000; // 30 seconds
  
  private constructor() {
    // Start flush interval
    this.startFlushInterval();
    
    // Add window unload event to flush remaining events
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush(true);
      });
    }
  }
  
  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }
  
  /**
   * Track an error with priority level
   */
  public trackError(error: Error, priority: ErrorPriority | string = ErrorPriority.MEDIUM, metadata: Record<string, any> = {}): void {
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        priority,
        ...metadata
      };
      
      debugLog('MonitoringService', `Tracking error: ${error.message}`, DebugLevel.ERROR);
      
      this.addEvent({
        type: MonitoringEventType.ERROR,
        timestamp: Date.now(),
        data: errorData,
        userId: this.getCurrentUserId()
      });
      
      // If critical, flush immediately
      if (priority === ErrorPriority.CRITICAL) {
        this.flush(true);
      }
    } catch (err) {
      console.error('Error in trackError:', err);
    }
  }
  
  /**
   * Track performance metric
   */
  public trackPerformance(metricName: string, durationMs: number, metadata: Record<string, any> = {}): void {
    try {
      this.addEvent({
        type: MonitoringEventType.PERFORMANCE,
        timestamp: Date.now(),
        data: {
          metricName,
          durationMs,
          ...metadata
        },
        userId: this.getCurrentUserId()
      });
    } catch (err) {
      console.error('Error in trackPerformance:', err);
    }
  }
  
  /**
   * Track security event
   */
  public trackSecurityEvent(eventName: string, metadata: Record<string, any> = {}): void {
    try {
      this.addEvent({
        type: MonitoringEventType.SECURITY,
        timestamp: Date.now(),
        data: {
          eventName,
          ...metadata
        },
        userId: this.getCurrentUserId()
      });
      
      // Security events flush immediately
      this.flush(true);
    } catch (err) {
      console.error('Error in trackSecurityEvent:', err);
    }
  }
  
  /**
   * Track user action
   */
  public trackUserAction(action: string, metadata: Record<string, any> = {}): void {
    try {
      this.addEvent({
        type: MonitoringEventType.USER_ACTION,
        timestamp: Date.now(),
        data: {
          action,
          ...metadata
        },
        userId: this.getCurrentUserId()
      });
    } catch (err) {
      console.error('Error in trackUserAction:', err);
    }
  }
  
  /**
   * Add event to queue
   */
  private addEvent(event: MonitoringEvent): void {
    this.events.push(event);
    
    // If queue is full, flush
    if (this.events.length >= this.maxQueueSize) {
      this.flush();
    }
  }
  
  /**
   * Start flush interval
   */
  private startFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.flushIntervalMs);
  }
  
  /**
   * Flush events to server
   */
  private flush(immediate: boolean = false): void {
    if (this.events.length === 0) return;
    
    const eventsToSend = [...this.events];
    this.events = [];
    
    // Send events to server
    this.sendEvents(eventsToSend, immediate);
  }
  
  /**
   * Send events to server
   */
  private async sendEvents(events: MonitoringEvent[], immediate: boolean = false): Promise<void> {
    try {
      if (immediate) {
        // Use fetch with keepalive for critical events on page unload
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify({ events })], { type: 'application/json' });
          navigator.sendBeacon('/api/monitoring/events', blob);
          return;
        }
      }
      
      // Normal case - use Supabase function
      await supabase.functions.invoke('track-monitoring-events', {
        body: { events }
      });
    } catch (err) {
      console.error('Error sending monitoring events:', err);
    }
  }
  
  /**
   * Get current user ID
   */
  private getCurrentUserId(): string | undefined {
    try {
      // This is a placeholder - should be implemented to get actual user ID
      return 'anonymous';
    } catch {
      return undefined;
    }
  }
}

export const monitoringService = MonitoringService.getInstance();
