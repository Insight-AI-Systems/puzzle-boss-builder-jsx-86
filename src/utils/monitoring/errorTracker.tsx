
class ErrorTrackerImpl {
  private errors: Record<string, any[]> = {};
  private errorCount: number = 0;
  private isEnabled: boolean = true;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window !== 'undefined') {
      // Use arrow functions to preserve 'this' context
      window.addEventListener('error', (ev) => this.handleError(ev));
      window.addEventListener('unhandledrejection', (ev) => this.handleUnhandledRejection(ev));
    }
  }

  private handleError(event: ErrorEvent): void {
    if (!this.isEnabled) return;
    
    const error = event.error || new Error(event.message);
    this.trackError(error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    if (!this.isEnabled) return;
    
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    this.trackError(error, { type: 'unhandled_rejection' });
  }

  public trackError(error: Error, metadata: Record<string, any> = {}): void {
    if (!this.isEnabled) return;
    
    const errorName = error.name || 'Error';
    const errorMessage = error.message || 'Unknown error';
    const stack = error.stack || '';
    
    if (!this.errors[errorName]) {
      this.errors[errorName] = [];
    }
    
    this.errors[errorName].push({
      message: errorMessage,
      stack,
      timestamp: Date.now(),
      metadata
    });
    
    this.errorCount++;
    
    // Limit the number of stored errors per type
    if (this.errors[errorName].length > 10) {
      this.errors[errorName] = this.errors[errorName].slice(-10);
    }
    
    console.error(`[ErrorTracker] ${errorName}: ${errorMessage}`, metadata);
  }
  
  public getErrors(): Record<string, any[]> {
    return { ...this.errors };
  }
  
  public getStats(): { count: number; byType: Record<string, number> } {
    const byType: Record<string, number> = {};
    
    for (const [type, errors] of Object.entries(this.errors)) {
      byType[type] = errors.length;
    }
    
    return {
      count: this.errorCount,
      byType
    };
  }
  
  public clearErrors(): void {
    this.errors = {};
    this.errorCount = 0;
  }
  
  public enable(): void {
    this.isEnabled = true;
  }
  
  public disable(): void {
    this.isEnabled = false;
  }
}

// Export a singleton instance
export const errorTracker = new ErrorTrackerImpl();
