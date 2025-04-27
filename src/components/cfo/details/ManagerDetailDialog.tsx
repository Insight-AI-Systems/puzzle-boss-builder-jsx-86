
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryManager, CommissionPayment, SiteIncome, SiteExpense } from '@/types/financeTypes';

interface ManagerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manager: CategoryManager;
  commissionHistory: CommissionPayment[];
  relatedIncome: SiteIncome[];
  relatedExpenses: SiteExpense[];
}

export const ManagerDetailDialog = ({
  open,
  onOpenChange,
  manager,
  commissionHistory,
  relatedIncome,
  relatedExpenses
}: ManagerDetailDialogProps) => {
  const commissionData = commissionHistory.map(payment => ({
    month: format(new Date(payment.period), 'MMM yyyy'),
    amount: payment.commission_amount
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Manager Details: {manager.username}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-100px)] pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manager Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{manager.category_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commission Rate</p>
                    <p className="font-medium">{manager.commission_percent}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={commissionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#8884d8" name="Commission Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{format(new Date(payment.period), 'MMM yyyy')}</TableCell>
                        <TableCell>${payment.commission_amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{payment.payment_status}</TableCell>
                        <TableCell>
                          {payment.payment_date 
                            ? format(new Date(payment.payment_date), 'yyyy-MM-dd')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Related Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedIncome.map((income) => (
                        <TableRow key={income.id}>
                          <TableCell>{format(new Date(income.date), 'yyyy-MM-dd')}</TableCell>
                          <TableCell>${income.amount.toFixed(2)}</TableCell>
                          <TableCell className="capitalize">{income.source_type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Related Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{format(new Date(expense.date), 'yyyy-MM-dd')}</TableCell>
                          <TableCell>${expense.amount.toFixed(2)}</TableCell>
                          <TableCell className="capitalize">{expense.expense_type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
