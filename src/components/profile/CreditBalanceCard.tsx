
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Plus, Crown } from 'lucide-react';

export interface UserWallet {
  id: string;
  balance: number;
  currency: string;
}

const CreditBalanceCard: React.FC = () => {
  // Mock data for now
  const wallet: UserWallet = {
    id: '1',
    balance: 0,
    currency: 'CREDITS'
  };

  const isAdmin = false; // Mock admin status

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          Credit Balance
          {isAdmin && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {wallet.balance}
          </div>
          <p className="text-sm text-muted-foreground">Available Credits</p>
        </div>

        <div className="space-y-2">
          <Button className="w-full" variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Credits
          </Button>
          
          {isAdmin && (
            <Badge variant="secondary" className="w-full justify-center">
              Admin - Unlimited Access
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Credits are used to play premium puzzles and access exclusive content.
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditBalanceCard;
