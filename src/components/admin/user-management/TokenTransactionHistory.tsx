
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";
import { TokenTransaction } from '@/types/userTypes';
import { useTokenManagement } from '@/hooks/useTokenManagement';

interface TokenTransactionHistoryProps {
  userId: string;
}

export function TokenTransactionHistory({ userId }: TokenTransactionHistoryProps) {
  const { useTokenTransactions } = useTokenManagement();
  const { data: transactions = [], isLoading, error } = useTokenTransactions(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading transactions: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Token Transaction History
          <Badge variant="outline">{transactions.length} transactions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No token transactions found for this user.
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {transaction.amount > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      {transaction.transaction_type === 'admin_award' ? 'Admin Award' : 
                       transaction.transaction_type === 'puzzle_play' ? 'Puzzle Play' : 
                       transaction.transaction_type}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground">
                        {transaction.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} tokens
                  </p>
                  {transaction.admin_user_id && (
                    <p className="text-xs text-muted-foreground">
                      By admin
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
