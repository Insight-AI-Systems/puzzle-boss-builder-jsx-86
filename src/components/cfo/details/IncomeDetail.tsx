
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteIncome } from '@/types/financeTypes';
import { DetailDialog } from './DetailDialog';

interface IncomeDetailProps {
  income: SiteIncome;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const IncomeDetail = ({ income, open, onOpenChange }: IncomeDetailProps) => {
  return (
    <DetailDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title={`Income Record Details - ${format(new Date(income.date), 'MMM dd, yyyy')}`}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Amount</p>
              <p className="text-2xl font-bold text-green-600">${income.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Source Type</p>
              <p className="text-lg capitalize">{income.source_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Category</p>
              <p>{income.categories?.name || 'Uncategorized'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Payment Method</p>
              <p className="capitalize">{income.method}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">User</p>
              <p>{income.profiles?.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Transaction Date</p>
              <p>{format(new Date(income.date), 'MMMM dd, yyyy')}</p>
            </div>
            {income.notes && (
              <div className="col-span-2">
                <p className="text-sm font-medium">Notes</p>
                <p className="mt-1 text-sm">{income.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DetailDialog>
  );
};
