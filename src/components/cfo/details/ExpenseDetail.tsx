
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteExpense } from '@/types/financeTypes';
import { DetailDialog } from './DetailDialog';

interface ExpenseDetailProps {
  expense: SiteExpense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExpenseDetail = ({ expense, open, onOpenChange }: ExpenseDetailProps) => {
  return (
    <DetailDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title={`Expense Record Details - ${format(new Date(expense.date), 'MMM dd, yyyy')}`}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Amount</p>
              <p className="text-2xl font-bold text-red-600">${expense.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Expense Type</p>
              <p className="text-lg capitalize">{expense.expense_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Category</p>
              <p>{expense.categories?.name || 'Uncategorized'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Payee</p>
              <p>{expense.payee || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Transaction Date</p>
              <p>{format(new Date(expense.date), 'MMMM dd, yyyy')}</p>
            </div>
            {expense.notes && (
              <div className="col-span-2">
                <p className="text-sm font-medium">Notes</p>
                <p className="mt-1 text-sm">{expense.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DetailDialog>
  );
};
