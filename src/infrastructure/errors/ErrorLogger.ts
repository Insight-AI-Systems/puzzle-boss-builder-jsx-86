
import { GameError } from './GameError';
import { PaymentError } from './PaymentError';
import { DataError } from './DataError';
import { ValidationError } from './ValidationError';

export type CustomError = GameError | PaymentError | DataError | ValidationError;

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  error: CustomError;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  stackTrace?: string;
}

class ErrorLoggerService {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100;

  logError(error: CustomError | Error, context?: {
    userId?: string;
    sessionId?: string;
    url?: string;
  }): void {
    const logEntry: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? this.convertToCustomError(error) : error,
      userId: context?.userId,
      sessionId: context?.sessionId,
      userAgent: navigator.userAgent,
      url: context?.url || window.location.href,
      stackTrace: error.stack
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', logEntry);
    }

    // Store in localStorage for debugging
    try {
      localStorage.setItem('puzzleboss-error-logs', JSON.stringify(this.logs.slice(0, 10)));
    } catch (e) {
      console.warn('Unable to store error logs in localStorage');
    }

    // In production, you would send this to your logging service
    if (process.env.NODE_ENV === 'production' && logEntry.error.severity === 'critical') {
      this.reportCriticalError(logEntry);
    }
  }

  private convertToCustomError(error: Error): CustomError {
    return new DataError(
      error.message,
      'UNKNOWN_ERROR',
      'medium',
      true,
      'An unexpected error occurred. Please try again.'
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async reportCriticalError(logEntry: ErrorLogEntry): Promise<void> {
    // In a real application, this would send the error to your monitoring service
    // For now, we'll just log it
    console.error('CRITICAL ERROR:', logEntry);
  }

  getRecentLogs(count: number = 10): ErrorLogEntry[] {
    return this.logs.slice(0, count);
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('puzzleboss-error-logs');
  }
}

export const errorLogger = new ErrorLoggerService();
