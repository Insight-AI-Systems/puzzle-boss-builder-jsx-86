
import React from 'react';
import { format } from 'date-fns';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SiteExpense } from '@/types/financeTypes';
import { DetailDialog } from './DetailDialog';

interface ExpenseDetailProps {
  expense: SiteExpense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExpenseDetail: React.FC<ExpenseDetailProps> = ({
  expense,
  open,
  onOpenChange
}) => {
  return (
    <DetailDialog open={open} onOpenChange={onOpenChange} title="Expense Details">
      <DialogHeader>
        <DialogDescription>
          {expense.expense_type} expense from {format(new Date(expense.date), 'MMMM d, yyyy')}
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="text-lg">${expense.amount.toFixed(2)}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="capitalize">{expense.expense_type}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd>{format(new Date(expense.date), 'MMMM d, yyyy')}</dd>
          </div>
          
          {expense.payee && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Payee</dt>
              <dd>{expense.payee}</dd>
            </div>
          )}
          
          {expense.category_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd>{expense.categories?.name || 'Unknown category'}</dd>
            </div>
          )}
          
          {expense.notes && (
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="whitespace-pre-wrap">{expense.notes}</dd>
            </div>
          )}
        </dl>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
      </DialogFooter>
    </DetailDialog>
  );
};
