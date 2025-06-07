
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Wallet, 
  Lock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentGateProps {
  gameId: string;
  gameName: string;
  entryFee: number;
  testMode?: boolean;
  onPaymentSuccess: (transactionId?: string) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentGate({
  gameId,
  gameName,
  entryFee,
  testMode = false,
  onPaymentSuccess,
  onPaymentError
}: PaymentGateProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  const { 
    loading, 
    wallet, 
    fetchWallet, 
    verifyGameEntry, 
    addFunds 
  } = usePaymentSystem();

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user, fetchWallet]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const result = await verifyGameEntry(gameId, entryFee, testMode);
      
      if (result.success && result.canPlay) {
        onPaymentSuccess(result.transactionId);
      } else {
        onPaymentError(result.error || 'Payment verification failed');
      }
    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddFunds = async () => {
    const amount = entryFee * 5; // Add 5x entry fee for testing
    await addFunds(amount);
  };

  const canAfford = wallet ? wallet.balance >= entryFee : false;
  const needsTopUp = wallet && wallet.balance < entryFee;

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-puzzle-aqua border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-puzzle-white">Loading payment information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-puzzle-white flex items-center justify-center gap-2">
          <Lock className="h-5 w-5" />
          Payment Required
        </CardTitle>
        <p className="text-puzzle-aqua text-sm">{gameName}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {testMode && (
          <Alert className="border-puzzle-gold bg-puzzle-gold/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-puzzle-gold">
              Test Mode Active - Payment verification bypassed
            </AlertDescription>
          </Alert>
        )}

        {/* Entry Fee Display */}
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-puzzle-aqua">
            ${testMode ? '0.00' : entryFee.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">
            {testMode ? 'Free (Test Mode)' : 'Entry Fee'}
          </div>
        </div>

        {/* Wallet Balance */}
        {wallet && !testMode && (
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-puzzle-aqua" />
              <span className="text-puzzle-white text-sm">Wallet Balance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                ${wallet.balance.toFixed(2)}
              </span>
              {canAfford ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        )}

        {/* Insufficient Funds Warning */}
        {needsTopUp && !testMode && (
          <Alert className="border-red-500 bg-red-500/10">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              Insufficient funds. You need ${(entryFee - wallet.balance).toFixed(2)} more to play.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {testMode || canAfford ? (
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-medium"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-puzzle-black border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : testMode ? (
                'Start Game (Test Mode)'
              ) : (
                `Pay $${entryFee.toFixed(2)} & Start`
              )}
            </Button>
          ) : (
            <Button
              onClick={handleAddFunds}
              className="w-full bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black font-medium"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Add Funds (Test)
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full border-gray-600 text-gray-400 hover:bg-gray-800"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>

        {/* Payment Details */}
        {showDetails && (
          <div className="space-y-3 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-300">
              <div className="flex justify-between mb-2">
                <span>Game:</span>
                <span className="text-puzzle-aqua">{gameName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Entry Fee:</span>
                <span>${entryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Currency:</span>
                <span>USD</span>
              </div>
              {wallet && (
                <div className="flex justify-between">
                  <span>Balance After:</span>
                  <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                    ${testMode ? wallet.balance.toFixed(2) : Math.max(0, wallet.balance - entryFee).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Secure payment processing</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
