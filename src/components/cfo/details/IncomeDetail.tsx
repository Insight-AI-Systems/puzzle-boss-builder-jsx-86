
import React from 'react';
import { format } from 'date-fns';
import { 
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SiteIncome } from '@/types/financeTypes';
import { DetailDialog } from './DetailDialog';

interface IncomeDetailProps {
  income: SiteIncome;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const IncomeDetail: React.FC<IncomeDetailProps> = ({
  income,
  open,
  onOpenChange
}) => {
  return (
    <DetailDialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Income Details</DialogTitle>
        <DialogDescription>
          {income.source_type} income from {format(new Date(income.date), 'MMMM d, yyyy')}
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="text-lg">${income.amount.toFixed(2)}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">Source Type</dt>
            <dd className="capitalize">{income.source_type}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd>{format(new Date(income.date), 'MMMM d, yyyy')}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
            <dd className="capitalize">{income.method}</dd>
          </div>
          
          {income.user_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">User</dt>
              <dd>{income.profiles?.username || 'Unknown user'}</dd>
            </div>
          )}
          
          {income.category_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd>{income.categories?.name || 'Unknown category'}</dd>
            </div>
          )}
          
          {income.notes && (
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="whitespace-pre-wrap">{income.notes}</dd>
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
