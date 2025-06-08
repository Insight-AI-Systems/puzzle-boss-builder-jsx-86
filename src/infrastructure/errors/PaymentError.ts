
export class PaymentError extends Error {
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
    this.name = 'PaymentError';
    this.code = code;
    this.severity = severity;
    this.recoverable = recoverable;
    this.userMessage = userMessage || this.getDefaultUserMessage();
    this.metadata = metadata;
  }

  private getDefaultUserMessage(): string {
    switch (this.code) {
      case 'INSUFFICIENT_FUNDS':
        return 'Insufficient funds. Please add credits to your account or use a different payment method.';
      case 'PAYMENT_FAILED':
        return 'Payment failed. Please check your payment details and try again.';
      case 'PAYMENT_DECLINED':
        return 'Payment was declined. Please try a different payment method.';
      case 'PAYMENT_TIMEOUT':
        return 'Payment timed out. Please try again.';
      case 'INVALID_PAYMENT_METHOD':
        return 'Invalid payment method. Please select a valid payment option.';
      case 'CREDITS_UPDATE_FAILED':
        return 'Unable to update your credit balance. Please contact support if this persists.';
      default:
        return 'A payment error occurred. Please try again or contact support.';
    }
  }
}
