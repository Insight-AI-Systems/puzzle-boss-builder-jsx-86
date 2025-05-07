
/**
 * Simple logger for edge functions
 */
export class EdgeFunctionLogger {
  private context: string;

  /**
   * Creates a new logger instance with the given context
   * @param context The name or context of the logger
   */
  constructor(context: string) {
    this.context = context;
    console.log(`[${context}] Logger initialized`);
  }

  /**
   * Logs an informational message
   * @param message The message to log
   * @param data Optional data to include in the log
   */
  info(message: string, data?: any): void {
    console.log(`[${this.context}] [info] ${message}`, data ? data : '');
  }

  /**
   * Logs a warning message
   * @param message The message to log
   * @param data Optional data to include in the log
   */
  warn(message: string, data?: any): void {
    console.warn(`[${this.context}] [warn] ${message}`, data ? data : '');
  }

  /**
   * Logs an error message
   * @param message The message to log
   * @param data Optional data to include in the log
   */
  error(message: string, data?: any): void {
    console.error(`[${this.context}] [error] ${message}`, data ? data : '');
  }

  /**
   * Logs a debug message (only in development)
   * @param message The message to log
   * @param data Optional data to include in the log
   */
  debug(message: string, data?: any): void {
    console.debug(`[${this.context}] [debug] ${message}`, data ? data : '');
  }
}
