
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet } from 'lucide-react';

interface CreditBalanceDisplayProps {
  credits: number;
  balance: number;
  entryFee: number;
  willUseCredits: boolean;
  compact?: boolean;
}

export function CreditBalanceDisplay({
  credits,
  balance,
  entryFee,
  willUseCredits,
  compact = false
}: CreditBalanceDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-puzzle-gold" />
          <span className="text-puzzle-white">{credits} credits</span>
          {willUseCredits && entryFee > 0 && (
            <Badge className="bg-puzzle-gold/20 text-puzzle-gold border-puzzle-gold/50 text-xs">
              Will use {entryFee}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-puzzle-aqua" />
          <span className="text-puzzle-white">{formatCurrency(balance)}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Credits */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-puzzle-gold" />
              <span className="text-puzzle-white font-medium">Free Credits</span>
            </div>
            <div className="text-2xl font-bold text-puzzle-gold mb-1">
              {credits}
            </div>
            {willUseCredits && entryFee > 0 && (
              <Badge className="bg-puzzle-gold/20 text-puzzle-gold border-puzzle-gold/50">
                Will use {entryFee} credits
              </Badge>
            )}
          </div>

          {/* Wallet Balance */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-puzzle-aqua" />
              <span className="text-puzzle-white font-medium">Wallet</span>
            </div>
            <div className="text-2xl font-bold text-puzzle-aqua mb-1">
              {formatCurrency(balance)}
            </div>
            {!willUseCredits && entryFee > 0 && balance >= entryFee && (
              <Badge className="bg-puzzle-aqua/20 text-puzzle-aqua border-puzzle-aqua/50">
                Will charge {formatCurrency(entryFee)}
              </Badge>
            )}
          </div>
        </div>

        {/* Payment Method Indicator */}
        {entryFee > 0 && (
          <div className="mt-4 text-center">
            <div className="text-sm text-puzzle-white/70 mb-2">
              Payment method for this game:
            </div>
            {willUseCredits ? (
              <Badge className="bg-puzzle-gold/20 text-puzzle-gold border-puzzle-gold/50">
                <CreditCard className="h-3 w-3 mr-1" />
                {entryFee} Free Credits
              </Badge>
            ) : (
              <Badge className="bg-puzzle-aqua/20 text-puzzle-aqua border-puzzle-aqua/50">
                <Wallet className="h-3 w-3 mr-1" />
                {formatCurrency(entryFee)} from Wallet
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
