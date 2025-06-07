
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Wallet, ArrowRight } from 'lucide-react';

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameName: string;
  entryFee: number;
  paymentMethod: 'credits' | 'wallet';
  currentCredits: number;
  currentBalance: number;
  onConfirm: () => void;
  onChangePaymentMethod: () => void;
  isProcessing?: boolean;
}

export function PaymentConfirmationDialog({
  open,
  onOpenChange,
  gameName,
  entryFee,
  paymentMethod,
  currentCredits,
  currentBalance,
  onConfirm,
  onChangePaymentMethod,
  isProcessing = false
}: PaymentConfirmationDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isCredits = paymentMethod === 'credits';
  const paymentIcon = isCredits ? CreditCard : Wallet;
  const paymentColor = isCredits ? 'text-puzzle-gold' : 'text-puzzle-aqua';
  const paymentBg = isCredits ? 'bg-puzzle-gold/20' : 'bg-puzzle-aqua/20';
  const paymentBorder = isCredits ? 'border-puzzle-gold/50' : 'border-puzzle-aqua/50';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-puzzle-white text-center">
            Confirm Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Game Info */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-puzzle-white mb-1">{gameName}</h3>
                <p className="text-sm text-gray-400">Tournament Entry</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className={`${paymentBg} ${paymentBorder} border`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <paymentIcon.type className={`h-5 w-5 ${paymentColor}`} />
                  <div>
                    <div className={`font-medium ${paymentColor}`}>
                      {isCredits ? 'Free Credits' : 'Wallet Balance'}
                    </div>
                    <div className="text-sm text-gray-400">
                      Payment Method
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onChangePaymentMethod}
                  className="border-gray-600 text-gray-400 hover:bg-gray-800"
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current {isCredits ? 'Credits' : 'Balance'}:</span>
                <span className="text-puzzle-white">
                  {isCredits ? `${currentCredits} credits` : formatCurrency(currentBalance)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entry Fee:</span>
                <span className="text-red-400">
                  -{isCredits ? `${entryFee} credits` : formatCurrency(entryFee)}
                </span>
              </div>
              
              <div className="border-t border-gray-600 pt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">After Payment:</span>
                  <span className={paymentColor}>
                    {isCredits 
                      ? `${currentCredits - entryFee} credits` 
                      : formatCurrency(currentBalance - entryFee)
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="border-gray-600 text-gray-400 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`${isCredits ? 'bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black' : 'bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black'} font-semibold`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Confirm & Play
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
