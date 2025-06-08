
export class DataError extends Error {
  public readonly code: string;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';
  public readonly recoverable: boolean;
  public readonly userMessage: string;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    recoverable: boolean = true,
    userMessage?: string,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'DataError';
    this.code = code;
    this.severity = severity;
    this.recoverable = recoverable;
    this.userMessage = userMessage || this.getDefaultUserMessage();
    this.metadata = metadata;
  }

  private getDefaultUserMessage(): string {
    switch (this.code) {
      case 'DATA_FETCH_FAILED':
        return 'Unable to load data. Please check your connection and try again.';
      case 'DATA_SAVE_FAILED':
        return 'Unable to save your data. Please try again.';
      case 'DATABASE_CONNECTION_ERROR':
        return 'Connection error. Please check your internet connection.';
      case 'DATA_NOT_FOUND':
        return 'The requested data could not be found.';
      case 'DATA_CORRUPTION':
        return 'Data appears to be corrupted. Please contact support.';
      case 'SYNC_FAILED':
        return 'Unable to sync your data. Working offline until connection is restored.';
      default:
        return 'A data error occurred. Please try again.';
    }
  }
}
