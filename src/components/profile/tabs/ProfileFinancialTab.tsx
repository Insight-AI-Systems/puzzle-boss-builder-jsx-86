
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

const ProfileFinancialTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-puzzle-aqua">$0.00</div>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-puzzle-gold">$0.00</div>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">$0.00</div>
            <p className="text-sm text-gray-500">Account Balance</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No transactions</h3>
            <p className="text-gray-500">Your financial activity will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileFinancialTab;
