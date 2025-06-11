
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
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { useMemberProfile } from '@/hooks/useMemberProfile';
import { CreditBalanceDisplay } from '@/components/games/CreditBalanceDisplay';

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
  const { user } = useClerkAuth();
  const { profile } = useMemberProfile();
  const { processPayment, isProcessing: paymentProcessing } = usePaymentSystem();

  const credits = profile?.credits || 0;
  const balance = 0; // Simplified for now
  const willUseCredits = credits >= entryFee;
  const canAfford = credits >= entryFee || balance >= entryFee;
  const needsTopUp = !canAfford;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const success = await processPayment(entryFee, `Entry fee for ${gameName}`);
      
      if (success) {
        onPaymentSuccess('test-transaction-id');
      } else {
        onPaymentError('Payment verification failed');
      }
    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddFunds = async () => {
    const amount = entryFee * 5;
    await processPayment(amount, 'Add funds to wallet');
  };

  if (paymentProcessing) {
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
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Credit and Balance Display */}
      <CreditBalanceDisplay
        credits={credits}
        balance={balance}
        entryFee={entryFee}
        willUseCredits={willUseCredits}
      />

      <Card className="bg-gray-900 border-gray-700">
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
              {testMode ? 'Free (Test Mode)' : willUseCredits ? `${entryFee} Credits` : `$${entryFee.toFixed(2)}`}
            </div>
            <div className="text-sm text-gray-400">
              {testMode ? 'Free (Test Mode)' : 'Entry Fee'}
            </div>
          </div>

          {/* Insufficient Funds Warning */}
          {needsTopUp && !testMode && (
            <Alert className="border-red-500 bg-red-500/10">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                Insufficient funds. You need {credits < entryFee && balance < entryFee 
                  ? `${entryFee - Math.max(credits, balance)} more ${credits > balance ? 'credits' : 'dollars'}`
                  : 'to add funds'} to play.
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
                ) : willUseCredits ? (
                  `Use ${entryFee} Credits & Start`
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
                  <span>{willUseCredits ? `${entryFee} credits` : `$${entryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Payment Method:</span>
                  <span>{willUseCredits ? 'Free Credits' : 'Wallet'}</span>
                </div>
                <div className="flex justify-between">
                  <span>After Payment:</span>
                  <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                    {willUseCredits 
                      ? `${Math.max(0, credits - entryFee)} credits`
                      : `$${Math.max(0, balance - entryFee).toFixed(2)}`
                    }
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                <span>Secure payment processing</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
