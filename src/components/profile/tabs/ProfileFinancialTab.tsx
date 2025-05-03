
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { MemberFinancialSummary, FinancialTransaction } from '@/types/memberTypes';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Loader2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface ProfileFinancialTabProps {
  userId: string;
  financialSummary?: MemberFinancialSummary;
}

export function ProfileFinancialTab({ userId, financialSummary }: ProfileFinancialTabProps) {
  const [page, setPage] = useState(0);
  const pageSize = 5;
  
  const { 
    transactions, 
    totalCount, 
    isLoading, 
    error 
  } = useFinancialTransactions(userId, { limit: pageSize, offset: page * pageSize });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'membership': return 'bg-blue-500';
      case 'puzzle': return 'bg-purple-500';
      case 'prize': return 'bg-green-500';
      case 'refund': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleNextPage = () => {
    if ((page + 1) * pageSize < totalCount) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // Mock function for downloading financial history
  const handleDownloadHistory = () => {
    console.log('Download financial history');
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-puzzle-black/70 border-puzzle-aqua/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-puzzle-white">Financial Summary</CardTitle>
            <CardDescription className="text-puzzle-white/70">
              Your financial activity overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-puzzle-white/70">Total Spend</span>
                <span className="text-puzzle-white font-medium">
                  {financialSummary ? formatCurrency(financialSummary.total_spend) : '$0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-puzzle-white/70">Prize Winnings</span>
                <span className="text-puzzle-white font-medium">
                  {financialSummary ? formatCurrency(financialSummary.total_prizes) : '$0.00'}
                </span>
              </div>
              <Separator className="my-2 bg-puzzle-aqua/20" />
              <div className="flex justify-between">
                <span className="text-puzzle-white/70">Membership Payments</span>
                <span className="text-puzzle-white font-medium">
                  {financialSummary ? formatCurrency(financialSummary.membership_revenue) : '$0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-puzzle-white/70">Puzzle Payments</span>
                <span className="text-puzzle-white font-medium">
                  {financialSummary ? formatCurrency(financialSummary.puzzle_revenue) : '$0.00'}
                </span>
              </div>
              <Separator className="my-2 bg-puzzle-aqua/20" />
              <div className="flex justify-between">
                <span className="text-puzzle-white/70">Lifetime Value</span>
                <span className="text-puzzle-white font-medium">
                  {financialSummary ? formatCurrency(financialSummary.lifetime_value) : '$0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-puzzle-black/70 border-puzzle-aqua/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-puzzle-white">Payment Information</CardTitle>
            <CardDescription className="text-puzzle-white/70">
              Your payment details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-puzzle-white/70">Last Payment Date</span>
                <span className="text-puzzle-white font-medium">
                  {financialSummary?.last_payment_date 
                    ? format(new Date(financialSummary.last_payment_date), 'MMMM dd, yyyy')
                    : 'No payments yet'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-puzzle-white/70">Membership Status</span>
                <span className="text-puzzle-white font-medium capitalize">
                  {financialSummary?.membership_status || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-puzzle-white/70">Xero Contact</span>
                <span className="text-puzzle-white font-medium">
                  {financialSummary?.xero_contact_id ? 'Linked' : 'Not Linked'}
                </span>
              </div>
              <Separator className="my-2 bg-puzzle-aqua/20" />
              <Button 
                variant="outline" 
                className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
                onClick={handleDownloadHistory}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Financial History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-puzzle-black/70 border-puzzle-aqua/20">
        <CardHeader>
          <CardTitle className="text-puzzle-white">Transaction History</CardTitle>
          <CardDescription className="text-puzzle-white/70">
            Your recent financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error loading transactions
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-puzzle-white/70">
              No transactions found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-puzzle-white">Date</TableHead>
                    <TableHead className="text-puzzle-white">Type</TableHead>
                    <TableHead className="text-puzzle-white">Description</TableHead>
                    <TableHead className="text-puzzle-white text-right">Amount</TableHead>
                    <TableHead className="text-puzzle-white text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction: FinancialTransaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-puzzle-white/80">
                        {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTransactionTypeColor(transaction.transaction_type)} text-white`}>
                          {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-puzzle-white/80">
                        {transaction.description || `${transaction.transaction_type} transaction`}
                      </TableCell>
                      <TableCell className="text-right text-puzzle-white/80">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-puzzle-white/70">
                  Showing {Math.min(page * pageSize + 1, totalCount)} to {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} transactions
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={page === 0}
                    className="border-puzzle-aqua/30 text-puzzle-aqua disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={(page + 1) * pageSize >= totalCount}
                    className="border-puzzle-aqua/30 text-puzzle-aqua disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
