
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Log entry interface
export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp?: string;
  function_name?: string;
}

// Implementation that logs to console and optionally to Supabase
export class EdgeFunctionLogger {
  private functionName: string;
  private supabase: any | null = null;
  private batchLogs: LogEntry[] = [];
  private flushInterval: number | null = null;
  private readonly MAX_BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL_MS = 5000;

  constructor(functionName: string, initSupabase = false) {
    this.functionName = functionName;
    
    // Log initialization
    console.log(`[${functionName}] Logger initialized`);
    
    // Initialize Supabase client for logging if requested
    if (initSupabase) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (supabaseUrl && supabaseServiceRoleKey) {
          this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
          this.startBatchLogging();
        }
      } catch (error) {
        console.error(`[${functionName}] Error initializing Supabase for logging:`, error);
      }
    }
  }

  private startBatchLogging() {
    this.flushInterval = setInterval(() => {
      this.flushLogs();
    }, this.FLUSH_INTERVAL_MS);
  }

  private async flushLogs() {
    if (this.batchLogs.length === 0) return;
    
    if (this.supabase) {
      try {
        const logsToFlush = [...this.batchLogs];
        this.batchLogs = [];
        
        await this.supabase
          .from('function_logs')
          .insert(logsToFlush.map(log => ({
            function_name: this.functionName,
            level: log.level,
            message: log.message,
            context: log.context,
            created_at: log.timestamp
          })));
      } catch (error) {
        console.error(`[${this.functionName}] Error flushing logs to Supabase:`, error);
      }
    }
  }

  public async shutdown() {
    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval);
    }
    await this.flushLogs();
  }

  public log(level: LogLevel, message: string, context?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      level,
      message,
      context,
      timestamp,
      function_name: this.functionName
    };
    
    // Always log to console
    const logFn = this.getConsoleMethod(level);
    logFn(`[${this.functionName}] [${level}] ${message}`, context || '');
    
    // Queue for batch logging to Supabase if configured
    if (this.supabase) {
      this.batchLogs.push(logEntry);
      
      // Flush immediately if batch size reaches threshold
      if (this.batchLogs.length >= this.MAX_BATCH_SIZE) {
        this.flushLogs();
      }
    }
  }
  
  private getConsoleMethod(level: LogLevel): (message: string, ...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARNING:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }
  
  // Convenience methods
  public debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }
  
  public info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }
  
  public warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARNING, message, context);
  }
  
  public error(message: string, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context);
  }
  
  public critical(message: string, context?: Record<string, any>) {
    this.log(LogLevel.CRITICAL, message, context);
  }
}
