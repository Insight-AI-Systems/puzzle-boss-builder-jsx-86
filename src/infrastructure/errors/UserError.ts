
export class UserError extends Error {
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
    this.name = 'UserError';
    this.code = code;
    this.severity = severity;
    this.recoverable = recoverable;
    this.userMessage = userMessage || this.getDefaultUserMessage();
    this.metadata = metadata;
  }

  private getDefaultUserMessage(): string {
    switch (this.code) {
      case 'USER_NOT_FOUND':
        return 'User not found. Please check your credentials.';
      case 'USER_ALREADY_EXISTS':
        return 'A user with this email already exists.';
      case 'INVALID_CREDENTIALS':
        return 'Invalid email or password.';
      case 'USER_NOT_AUTHENTICATED':
        return 'Please log in to continue.';
      case 'USER_NOT_AUTHORIZED':
        return 'You do not have permission to perform this action.';
      case 'PROFILE_UPDATE_FAILED':
        return 'Unable to update your profile. Please try again.';
      case 'PASSWORD_RESET_FAILED':
        return 'Unable to reset password. Please try again.';
      default:
        return 'A user error occurred. Please try again.';
    }
  }
}
