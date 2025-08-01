
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Plus, 
  History, 
  Receipt,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { GameTransaction } from '@/types/payments';

// Helper function to convert database result to GameTransaction
const convertToGameTransaction = (dbTransaction: any): GameTransaction => ({
  id: dbTransaction.id,
  user_id: dbTransaction.user_id,
  game_id: dbTransaction.game_id,
  session_id: dbTransaction.session_id,
  transaction_type: dbTransaction.transaction_type as GameTransaction['transaction_type'],
  amount: dbTransaction.amount,
  currency: dbTransaction.currency,
  status: dbTransaction.status as GameTransaction['status'],
  payment_method_id: dbTransaction.payment_method_id,
  external_transaction_id: dbTransaction.external_transaction_id,
  description: dbTransaction.description,
  metadata: dbTransaction.metadata as Record<string, any>,
  created_at: dbTransaction.created_at,
  updated_at: dbTransaction.updated_at
});

export function WalletManager() {
  const [addAmount, setAddAmount] = useState('');
  const [transactions, setTransactions] = useState<GameTransaction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [wallet, setWallet] = useState({ balance: 0, currency: 'USD' });
  const { user } = useAuth();
  const { processPayment, isProcessing } = usePaymentSystem();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('game_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Convert database results to proper types
      const convertedTransactions = (data || []).map(convertToGameTransaction);
      setTransactions(convertedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) return;

    const success = await processPayment(amount, 'Add funds to wallet');
    if (success) {
      setAddAmount('');
      fetchTransactions();
      // Update wallet balance
      setWallet(prev => ({ ...prev, balance: prev.balance + amount }));
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <Plus className="h-4 w-4 text-green-400" />;
      case 'entry_fee': return <DollarSign className="h-4 w-4 text-red-400" />;
      case 'prize_payout': return <Receipt className="h-4 w-4 text-puzzle-gold" />;
      case 'refund': return <RefreshCw className="h-4 w-4 text-blue-400" />;
      default: return <History className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'refunded': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isProcessing) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-puzzle-aqua border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-puzzle-white">Loading wallet...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-puzzle-aqua mb-2">
              ${wallet.balance.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">{wallet.currency}</div>
          </div>

          {/* Add Funds Section */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount to add"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="bg-gray-800 border-gray-600 text-puzzle-white"
                min="0"
                step="0.01"
              />
              <Button
                onClick={handleAddFunds}
                disabled={!addAmount || parseFloat(addAmount) <= 0}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="flex gap-2">
              {[10, 25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAddAmount(amount.toString())}
                  className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="border-gray-600 text-gray-400"
            >
              {showHistory ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>

        {showHistory && (
          <CardContent>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.transaction_type)}
                      <div>
                        <div className="text-puzzle-white text-sm font-medium capitalize">
                          {transaction.transaction_type.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        transaction.transaction_type === 'entry_fee' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {transaction.transaction_type === 'entry_fee' ? '-' : '+'}
                        ${transaction.amount.toFixed(2)}
                      </div>
                      <Badge 
                        className={`text-xs ${getStatusColor(transaction.status)} text-white`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
