
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Wallet, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

interface PaymentMethodSelectorProps {
  entryFee: number;
  credits: number;
  balance: number;
  onPaymentMethodSelect: (method: 'credits' | 'wallet') => void;
  onAddFunds?: () => void;
  selectedMethod?: 'credits' | 'wallet';
}

export function PaymentMethodSelector({
  entryFee,
  credits,
  balance,
  onPaymentMethodSelect,
  onAddFunds,
  selectedMethod
}: PaymentMethodSelectorProps) {
  const canUseCredits = credits >= entryFee;
  const canUseWallet = balance >= entryFee;
  const hasAnyPaymentMethod = canUseCredits || canUseWallet;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-puzzle-white mb-2">
          Choose Payment Method
        </h3>
        <p className="text-gray-400">
          Entry fee: {formatCurrency(entryFee)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Credits Payment Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            canUseCredits 
              ? selectedMethod === 'credits'
                ? 'bg-puzzle-gold/20 border-puzzle-gold ring-2 ring-puzzle-gold/50'
                : 'bg-gray-900 border-gray-700 hover:border-puzzle-gold/50'
              : 'bg-gray-800 border-gray-600 opacity-60'
          }`}
          onClick={() => canUseCredits && onPaymentMethodSelect('credits')}
        >
          <CardHeader className="text-center pb-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CreditCard className={`h-6 w-6 ${canUseCredits ? 'text-puzzle-gold' : 'text-gray-500'}`} />
              <CardTitle className={`text-lg ${canUseCredits ? 'text-puzzle-white' : 'text-gray-500'}`}>
                Free Credits
              </CardTitle>
            </div>
            {canUseCredits && selectedMethod === 'credits' && (
              <CheckCircle className="h-5 w-5 text-puzzle-gold mx-auto" />
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className={`text-2xl font-bold ${canUseCredits ? 'text-puzzle-gold' : 'text-gray-500'}`}>
                {credits}
              </div>
              <div className="text-sm text-gray-400">Available Credits</div>
            </div>
            
            {canUseCredits ? (
              <div className="space-y-2">
                <Badge className="w-full justify-center bg-puzzle-gold/20 text-puzzle-gold border-puzzle-gold/50">
                  Use {entryFee} Credits
                </Badge>
                <div className="text-xs text-gray-400 text-center">
                  Remaining: {credits - entryFee} credits
                </div>
              </div>
            ) : (
              <Alert className="border-gray-600 bg-gray-800/50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-gray-400 text-xs">
                  Need {entryFee - credits} more credits
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Wallet Payment Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            canUseWallet 
              ? selectedMethod === 'wallet'
                ? 'bg-puzzle-aqua/20 border-puzzle-aqua ring-2 ring-puzzle-aqua/50'
                : 'bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50'
              : 'bg-gray-800 border-gray-600 opacity-60'
          }`}
          onClick={() => canUseWallet && onPaymentMethodSelect('wallet')}
        >
          <CardHeader className="text-center pb-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wallet className={`h-6 w-6 ${canUseWallet ? 'text-puzzle-aqua' : 'text-gray-500'}`} />
              <CardTitle className={`text-lg ${canUseWallet ? 'text-puzzle-white' : 'text-gray-500'}`}>
                Wallet Balance
              </CardTitle>
            </div>
            {canUseWallet && selectedMethod === 'wallet' && (
              <CheckCircle className="h-5 w-5 text-puzzle-aqua mx-auto" />
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className={`text-2xl font-bold ${canUseWallet ? 'text-puzzle-aqua' : 'text-gray-500'}`}>
                {formatCurrency(balance)}
              </div>
              <div className="text-sm text-gray-400">Available Balance</div>
            </div>
            
            {canUseWallet ? (
              <div className="space-y-2">
                <Badge className="w-full justify-center bg-puzzle-aqua/20 text-puzzle-aqua border-puzzle-aqua/50">
                  Pay {formatCurrency(entryFee)}
                </Badge>
                <div className="text-xs text-gray-400 text-center">
                  Remaining: {formatCurrency(balance - entryFee)}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Alert className="border-gray-600 bg-gray-800/50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-gray-400 text-xs">
                    Need {formatCurrency(entryFee - balance)} more
                  </AlertDescription>
                </Alert>
                {onAddFunds && (
                  <Button
                    onClick={onAddFunds}
                    size="sm"
                    className="w-full bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Funds
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!hasAnyPaymentMethod && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-400">
            You don't have sufficient credits or wallet balance to play this game.
            {onAddFunds && ' Please add funds to your wallet or earn more credits.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
