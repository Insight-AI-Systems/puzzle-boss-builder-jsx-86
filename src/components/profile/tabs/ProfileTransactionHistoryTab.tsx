
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, Download } from 'lucide-react';

interface ProfileTransactionHistoryTabProps {
  userId: string;
}

export const ProfileTransactionHistoryTab: React.FC<ProfileTransactionHistoryTabProps> = ({ userId }) => {
  // Mock transaction data
  const transactions: any[] = [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
              <p className="text-gray-500">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className="font-medium">${transaction.amount}</p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <Download className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
