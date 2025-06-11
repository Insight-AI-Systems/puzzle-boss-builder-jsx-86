
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Filter, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  id: string;
  type: 'entry_fee' | 'prize_payout' | 'membership' | 'refund' | 'deposit';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  description: string;
  created_at: string;
  game_id?: string;
  receipt_url?: string;
}

interface ProfileTransactionHistoryTabProps {
  userId: string;
}

export function ProfileTransactionHistoryTab({ userId }: ProfileTransactionHistoryTabProps) {
  const [filter, setFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('date');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Mock data - in real implementation, this would come from API
  const [transactions] = React.useState<Transaction[]>([
    {
      id: '1',
      type: 'prize_payout',
      amount: 50.00,
      currency: 'USD',
      status: 'completed',
      description: 'Prize winnings from Sunset Paradise puzzle',
      created_at: '2024-01-15T10:30:00Z',
      game_id: 'puzzle-1',
      receipt_url: '/receipts/1'
    },
    {
      id: '2',
      type: 'entry_fee',
      amount: -5.99,
      currency: 'USD',
      status: 'completed',
      description: 'Entry fee for Mountain Vista puzzle',
      created_at: '2024-01-14T14:20:00Z',
      game_id: 'puzzle-2'
    },
    {
      id: '3',
      type: 'membership',
      amount: -29.99,
      currency: 'USD',
      status: 'completed',
      description: 'Monthly membership subscription',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      type: 'deposit',
      amount: 100.00,
      currency: 'USD',
      status: 'completed',
      description: 'Wallet deposit',
      created_at: '2023-12-28T16:45:00Z'
    }
  ]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'prize_payout':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'entry_fee':
      case 'membership':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'deposit':
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case 'refund':
        return <TrendingUp className="h-4 w-4 text-yellow-400" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      failed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-gray-500/20 text-gray-400'
    };

    return (
      <Badge className={variants[status] || variants.completed}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTransactionLabel = (type: string) => {
    const labels: Record<string, string> = {
      prize_payout: 'Prize Payout',
      entry_fee: 'Entry Fee',
      membership: 'Membership',
      refund: 'Refund',
      deposit: 'Deposit'
    };
    return labels[type] || type;
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.type !== filter) return false;
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'amount':
        return Math.abs(b.amount) - Math.abs(a.amount);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const totalSpent = transactions
    .filter(t => t.amount < 0 && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalEarned = transactions
    .filter(t => t.amount > 0 && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExportTransactions = () => {
    console.log('Exporting transactions...');
  };

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-puzzle-black/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-puzzle-white/70 text-sm">Total Spent</p>
                <p className="text-red-400 text-lg font-bold">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-puzzle-black/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-puzzle-white/70 text-sm">Total Earned</p>
                <p className="text-green-400 text-lg font-bold">${totalEarned.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-puzzle-aqua" />
              <div>
                <p className="text-puzzle-white/70 text-sm">Net Balance</p>
                <p className={`text-lg font-bold ${totalEarned - totalSpent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(totalEarned - totalSpent).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-puzzle-aqua" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48 bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-puzzle-black border-puzzle-aqua/30">
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="prize_payout">Prize Payouts</SelectItem>
                <SelectItem value="entry_fee">Entry Fees</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-puzzle-black border-puzzle-aqua/30">
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleExportTransactions}
              variant="outline"
              className="border-puzzle-aqua/30 text-puzzle-aqua hover:bg-puzzle-aqua/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {sortedTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-puzzle-aqua/20 rounded-lg hover:border-puzzle-aqua/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-puzzle-white font-medium">
                        {getTransactionLabel(transaction.type)}
                      </span>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-puzzle-white/70 text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-puzzle-white/50 text-xs">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  {transaction.receipt_url && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-puzzle-aqua hover:text-puzzle-aqua/80 p-0 h-auto"
                    >
                      View Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {sortedTransactions.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-puzzle-white/50 mx-auto mb-4" />
                <p className="text-puzzle-white/70">No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
