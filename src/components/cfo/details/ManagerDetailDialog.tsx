
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { PaymentStatus, CommissionPayment, SiteIncome, SiteExpense } from '@/types/financeTypes';

interface ManagerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manager: CommissionPayment;
  incomes: SiteIncome[];
  expenses: SiteExpense[];
  statusColors: Record<PaymentStatus, string>;
  onStatusChange: (status: PaymentStatus) => void;
}

export const ManagerDetailDialog: React.FC<ManagerDetailDialogProps> = ({
  open,
  onOpenChange,
  manager,
  incomes,
  expenses,
  statusColors,
  onStatusChange
}) => {
  // Ensure incomes and expenses are arrays even if undefined is passed
  const safeIncomes = incomes || [];
  const safeExpenses = expenses || [];
  
  const totalIncome = safeIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = safeExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manager Details: {manager.manager_name || 'Unknown'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Category</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-xl font-bold">{manager.category_name || 'Unknown'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Commission</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-xl font-bold">${manager.commission_amount.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <Badge className={statusColors[manager.payment_status]}>
                {manager.payment_status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Commission Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Gross Income</TableHead>
                  <TableHead>Net Income</TableHead>
                  <TableHead>Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{manager.period}</TableCell>
                  <TableCell>${manager.gross_income.toFixed(2)}</TableCell>
                  <TableCell>${manager.net_income.toFixed(2)}</TableCell>
                  <TableCell>${manager.commission_amount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Income Sources ({safeIncomes.length})</h3>
            {safeIncomes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeIncomes.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>{format(new Date(income.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{income.source_type}</TableCell>
                      <TableCell>${income.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">${totalIncome.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p>No income records found for this period.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Expenses ({safeExpenses.length})</h3>
            {safeExpenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{expense.expense_type}</TableCell>
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">${totalExpenses.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p>No expense records found for this period.</p>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <h3 className="text-lg font-semibold">Change Status</h3>
            </div>
            <div className="flex gap-2">
              {manager.payment_status !== PaymentStatus.PENDING && (
                <Button 
                  variant="outline" 
                  onClick={() => onStatusChange(PaymentStatus.PENDING)}
                >
                  Set As Pending
                </Button>
              )}
              {manager.payment_status !== PaymentStatus.APPROVED && (
                <Button 
                  variant="outline" 
                  onClick={() => onStatusChange(PaymentStatus.APPROVED)}
                >
                  Approve
                </Button>
              )}
              {manager.payment_status !== PaymentStatus.PAID && (
                <Button 
                  variant="default" 
                  onClick={() => onStatusChange(PaymentStatus.PAID)}
                >
                  Mark As Paid
                </Button>
              )}
              {manager.payment_status !== PaymentStatus.REJECTED && (
                <Button 
                  variant="destructive" 
                  onClick={() => onStatusChange(PaymentStatus.REJECTED)}
                >
                  Reject
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
