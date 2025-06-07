
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MemberDetailedProfile } from '@/types/memberTypes';
import { UserWallet } from '@/hooks/useMemberProfile';
import { UseMutationResult } from '@tanstack/react-query';
import { CreditBalanceCard } from '../CreditBalanceCard';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { DollarSign, CreditCard, TrendingUp, Calendar, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileFinancialTabProps {
  profile: MemberDetailedProfile & { wallet?: UserWallet };
  awardCredits?: UseMutationResult<boolean, Error, { targetUserId: string; credits: number; adminNote?: string }, unknown>;
  isAdmin: boolean;
}

export function ProfileFinancialTab({ profile, awardCredits, isAdmin }: ProfileFinancialTabProps) {
  const { transactions, totalCount, isLoading } = useFinancialTransactions(profile.id, { limit: 10, offset: 0 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'credit_award':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'puzzle':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'membership':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'prize':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Controls - Credits */}
      {isAdmin && awardCredits && (
        <CreditBalanceCard 
          profile={profile} 
          awardCredits={awardCredits}
        />
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Balance */}
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-puzzle-aqua" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-puzzle-aqua">
                {formatCurrency(profile.wallet?.balance || 0)}
              </p>
              <p className="text-xs text-puzzle-white/60">Available funds</p>
            </div>
          </CardContent>
        </Card>

        {/* Free Credits */}
        <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-puzzle-gold" />
              Free Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-puzzle-gold">
                {profile.credits || 0}
              </p>
              <p className="text-xs text-puzzle-white/60">Game credits</p>
            </div>
          </CardContent>
        </Card>

        {/* Lifetime Value */}
        <Card className="bg-puzzle-black/50 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-puzzle-white flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Lifetime Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(profile.financial_summary?.lifetime_value || 0)}
              </p>
              <p className="text-xs text-puzzle-white/60">Total spent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      {profile.financial_summary && (
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-puzzle-aqua" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-puzzle-white/60 text-sm">Total Spent</p>
                <p className="text-puzzle-white font-bold">
                  {formatCurrency(profile.financial_summary.total_spend)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-puzzle-white/60 text-sm">Membership Revenue</p>
                <p className="text-puzzle-white font-bold">
                  {formatCurrency(profile.financial_summary.membership_revenue)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-puzzle-white/60 text-sm">Puzzle Revenue</p>
                <p className="text-puzzle-white font-bold">
                  {formatCurrency(profile.financial_summary.puzzle_revenue)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-puzzle-white/60 text-sm">Total Prizes</p>
                <p className="text-puzzle-white font-bold text-puzzle-gold">
                  {formatCurrency(profile.financial_summary.total_prizes)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-puzzle-aqua" />
            Recent Transactions
            <Badge variant="outline" className="ml-auto border-puzzle-aqua/50 text-puzzle-aqua">
              {totalCount} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-puzzle-white/60">Loading transactions...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-puzzle-white/60">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 bg-puzzle-black/30 rounded-lg border border-puzzle-aqua/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge className={getTransactionTypeColor(transaction.transaction_type)}>
                        {transaction.transaction_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-puzzle-white font-medium">
                        {transaction.description || 'Transaction'}
                      </span>
                    </div>
                    <p className="text-puzzle-white/60 text-sm mt-1">
                      {formatDistanceToNow(new Date(transaction.transaction_date), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.currency === 'CREDITS' 
                        ? `${transaction.amount} credits`
                        : formatCurrency(transaction.amount)
                      }
                    </p>
                    <Badge variant="outline" className={
                      transaction.status === 'completed' 
                        ? 'border-green-500/50 text-green-400'
                        : transaction.status === 'pending'
                        ? 'border-yellow-500/50 text-yellow-400'
                        : 'border-red-500/50 text-red-400'
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium">Financial Information</p>
              <p className="text-yellow-300/80 text-sm mt-1">
                Financial records are maintained for accounting and tax purposes. 
                {!isAdmin && " Only administrators can modify credit balances and transaction records."}
                Contact support if you believe there are any discrepancies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
