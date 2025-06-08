
export class ValidationError extends Error {
  public readonly code: string;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';
  public readonly recoverable: boolean;
  public readonly userMessage: string;
  public readonly field?: string;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    field?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low',
    recoverable: boolean = true,
    userMessage?: string,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.field = field;
    this.severity = severity;
    this.recoverable = recoverable;
    this.userMessage = userMessage || this.getDefaultUserMessage();
    this.metadata = metadata;
  }

  private getDefaultUserMessage(): string {
    switch (this.code) {
      case 'REQUIRED_FIELD':
        return `${this.field || 'This field'} is required.`;
      case 'INVALID_EMAIL':
        return 'Please enter a valid email address.';
      case 'INVALID_PASSWORD':
        return 'Password must meet security requirements.';
      case 'INVALID_INPUT':
        return `${this.field || 'Input'} is not valid.`;
      case 'INPUT_TOO_LONG':
        return `${this.field || 'Input'} is too long.`;
      case 'INPUT_TOO_SHORT':
        return `${this.field || 'Input'} is too short.`;
      default:
        return 'Please check your input and try again.';
    }
  }
}
