
export interface PaymentMethod {
  id: string;
  user_id: string;
  method_type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'wallet';
  provider: string;
  last_four?: string;
  is_default: boolean;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface GameTransaction {
  id: string;
  user_id: string;
  game_id?: string;
  session_id?: string;
  transaction_type: 'entry_fee' | 'prize_payout' | 'refund' | 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  payment_method_id?: string;
  external_transaction_id?: string;
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GamePrizePool {
  id: string;
  game_id: string;
  game_type: string;
  entry_fee: number;
  total_pool: number;
  entries_count: number;
  max_entries?: number;
  prize_distribution: PrizeDistribution[];
  status: 'active' | 'closed' | 'distributed';
  created_at: string;
  updated_at: string;
}

export interface PrizeDistribution {
  position: number;
  amount: number;
  percentage: number;
}

export interface TransactionReceipt {
  id: string;
  transaction_id: string;
  receipt_number: string;
  user_id: string;
  amount: number;
  currency: string;
  description?: string;
  receipt_data: Record<string, any>;
  created_at: string;
}

export interface FraudDetectionLog {
  id: string;
  user_id: string;
  transaction_id?: string;
  risk_score: number;
  risk_factors: string[];
  action_taken: 'allowed' | 'flagged' | 'blocked' | 'manual_review';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  canPlay: boolean;
  balance: number;
  entryFee: number;
  transactionId?: string;
  error?: string;
  receipt?: TransactionReceipt;
}

export interface RefundRequest {
  transactionId: string;
  reason: string;
  amount?: number;
}
