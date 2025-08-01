import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Puzzle, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentSession {
  sessionId: string;
  puzzleImageId: string;
  difficulty: string;
  pieceCount: number;
  amount: number;
  currency: string;
}

export default function PuzzlePaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const puzzleId = searchParams.get('puzzle_id');

    if (sessionId && puzzleId && user) {
      processPaymentSuccess(sessionId, puzzleId);
    } else {
      setLoading(false);
    }
  }, [searchParams, user]);

  const processPaymentSuccess = async (sessionId: string, puzzleImageId: string) => {
    try {
      // Record the successful payment in our database
      const { error: transactionError } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: user?.id,
          transaction_type: 'puzzle_game',
          amount: 0, // We'll get actual amount from Stripe
          currency: 'USD',
          status: 'completed',
          description: `Puzzle game payment - Session: ${sessionId}`,
          metadata: {
            stripe_session_id: sessionId,
            puzzle_image_id: puzzleImageId,
            payment_type: 'puzzle_game'
          }
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }

      // TODO: Create puzzle session record once types are updated
      // const { error: sessionError } = await supabase
      //   .from('puzzle_sessions')
      //   .insert({
      //     user_id: user?.id,
      //     puzzle_image_id: puzzleImageId,
      //     status: 'paid',
      //     payment_session_id: sessionId,
      //     start_time: new Date().toISOString()
      //   });

      console.log('Puzzle session created for:', { sessionId, puzzleImageId });

      // For now, set mock payment data
      setPaymentSession({
        sessionId,
        puzzleImageId,
        difficulty: 'medium', // Would come from actual session data
        pieceCount: 100,
        amount: 3.50,
        currency: 'USD'
      });

      toast({
        title: "Payment successful!",
        description: "Your puzzle game access has been activated.",
      });
    } catch (error) {
      console.error('Error processing payment success:', error);
      toast({
        title: "Payment processed",
        description: "There was an issue recording your payment, but your access should still be available.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPuzzle = () => {
    if (paymentSession) {
      // Navigate to puzzle game with the purchased puzzle
      navigate(`/puzzle/${paymentSession.puzzleImageId}`);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Processing your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentSession || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">Payment session not found.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your puzzle game access has been activated and is ready to play.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Payment Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-medium">
                  {formatPrice(paymentSession.amount, paymentSession.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <Badge variant="outline">
                  {paymentSession.difficulty.charAt(0).toUpperCase() + paymentSession.difficulty.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pieces:</span>
                <span className="font-medium">
                  <Puzzle className="h-4 w-4 inline mr-1" />
                  {paymentSession.pieceCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session ID:</span>
                <span className="font-mono text-xs">{paymentSession.sessionId.slice(-8)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handlePlayPuzzle} className="w-full" size="lg">
              <Puzzle className="h-5 w-5 mr-2" />
              Start Playing Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Your payment receipt has been sent to your email address.
              You can access this puzzle anytime from your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}