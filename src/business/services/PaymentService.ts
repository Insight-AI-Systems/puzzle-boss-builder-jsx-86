
// Payment-specific types
export interface PaymentRequest {
  gameId: string;
  entryFee: number;
  userId: string;
  testMode?: boolean;
  useCredits?: boolean;
}

export interface PuzzlePaymentRequest {
  puzzleImageId: string;
  difficulty: string;
  pieceCount: number;
  userId: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  balance: number;
  credits: number;
  error?: string;
  requiresPayment: boolean;
  willUseCredits: boolean;
}

export interface PaymentStatus {
  verified: boolean;
  credits: number;
  balance: number;
  hasAccess: boolean;
  requiresPayment: boolean;
  willUseCredits: boolean;
  transactionId?: string;
}

export interface RefundRequest {
  transactionId: string;
  reason: string;
  amount?: number;
}

export interface PaymentError extends Error {
  code: 'INSUFFICIENT_FUNDS' | 'PAYMENT_FAILED' | 'INVALID_REQUEST' | 'SYSTEM_ERROR';
  details?: any;
}

// Centralized payment service
export class PaymentService {
  private paymentSystem: any;
  private profile: any;
  private wallet: any;
  private supabaseClient: any;

  constructor(dependencies: {
    paymentSystem: any;
    profile: any;
    wallet: any;
    supabaseClient?: any;
  }) {
    this.paymentSystem = dependencies.paymentSystem;
    this.profile = dependencies.profile;
    this.wallet = dependencies.wallet;
    this.supabaseClient = dependencies.supabaseClient;
  }

  async verifyPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Free games don't require payment
      if (!request.entryFee || request.entryFee <= 0) {
        return {
          success: true,
          balance: this.wallet?.balance || 0,
          credits: this.profile?.credits || 0,
          requiresPayment: false,
          willUseCredits: false
        };
      }

      const credits = this.profile?.credits || 0;
      const balance = this.wallet?.balance || 0;

      // Check if we can use credits first
      if (credits >= request.entryFee) {
        const result = await this.paymentSystem.verifyGameEntry(
          request.gameId, 
          request.entryFee, 
          request.testMode || false, 
          true // use credits
        );
        
        return {
          success: result.success,
          transactionId: result.transactionId,
          balance,
          credits: result.success ? credits - request.entryFee : credits,
          error: result.error,
          requiresPayment: true,
          willUseCredits: true
        };
      } else {
        // Use wallet balance
        const result = await this.paymentSystem.verifyGameEntry(
          request.gameId, 
          request.entryFee, 
          request.testMode || false, 
          false // use wallet
        );
        
        return {
          success: result.success,
          transactionId: result.transactionId,
          balance: result.balance || balance,
          credits,
          error: result.error,
          requiresPayment: true,
          willUseCredits: false
        };
      }
    } catch (error) {
      return this.handlePaymentError(error as Error);
    }
  }

  async processEntry(request: PaymentRequest): Promise<PaymentResult> {
    return await this.verifyPayment(request);
  }

  async refundEntry(refundRequest: RefundRequest): Promise<boolean> {
    try {
      // Implementation would depend on payment system capabilities
      console.log('Refund requested:', refundRequest);
      // This would call the actual refund API
      return true;
    } catch (error) {
      console.error('Refund failed:', error);
      return false;
    }
  }

  validateBalance(entryFee: number): PaymentStatus {
    const credits = this.profile?.credits || 0;
    const balance = this.wallet?.balance || 0;
    const willUseCredits = credits >= entryFee;
    const hasAccess = credits >= entryFee || balance >= entryFee;
    const requiresPayment = entryFee > 0;

    return {
      verified: !requiresPayment || hasAccess,
      credits,
      balance,
      hasAccess,
      requiresPayment,
      willUseCredits
    };
  }

  private handlePaymentError(error: Error): PaymentResult {
    const paymentError: PaymentError = error as PaymentError;
    
    let errorCode: PaymentError['code'] = 'SYSTEM_ERROR';
    if (error.message.includes('Insufficient')) {
      errorCode = 'INSUFFICIENT_FUNDS';
    } else if (error.message.includes('Payment')) {
      errorCode = 'PAYMENT_FAILED';
    }

    return {
      success: false,
      balance: this.wallet?.balance || 0,
      credits: this.profile?.credits || 0,
      error: error.message,
      requiresPayment: true,
      willUseCredits: false
    };
  }

  getCurrentBalance(): number {
    return this.wallet?.balance || 0;
  }

  getCurrentCredits(): number {
    return this.profile?.credits || 0;
  }

  async processPuzzlePayment(request: PuzzlePaymentRequest): Promise<{ success: boolean; sessionUrl?: string; error?: string }> {
    try {
      console.log('Processing puzzle payment:', request);
      
      if (!this.supabaseClient) {
        throw new Error('Supabase client not configured for puzzle payments');
      }
      
      // Create Stripe checkout session for puzzle game
      const { data, error } = await this.supabaseClient.functions.invoke('create-puzzle-payment', {
        body: {
          puzzleImageId: request.puzzleImageId,
          difficulty: request.difficulty,
          pieceCount: request.pieceCount
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment session');
      }

      return {
        success: true,
        sessionUrl: data.url
      };
    } catch (error) {
      console.error('Puzzle payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }
}
