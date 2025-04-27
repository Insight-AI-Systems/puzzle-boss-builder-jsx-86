
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { InvoiceEmailDialog } from '../InvoiceEmailDialog';

interface CommissionHeaderProps {
  selectedPayments: string[];
  onGenerateCommissions: () => Promise<void>;
  onExportToCSV: () => void;
  onEmailSuccess: () => void;
  isLoadingCommissions: boolean;
}

export const CommissionHeader: React.FC<CommissionHeaderProps> = ({
  selectedPayments,
  onGenerateCommissions,
  onExportToCSV,
  onEmailSuccess,
  isLoadingCommissions
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold">Commissions Management</h2>
      <div className="flex gap-2">
        <InvoiceEmailDialog 
          selectedPayments={selectedPayments}
          onSuccess={onEmailSuccess}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onExportToCSV}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button 
          onClick={onGenerateCommissions}
          disabled={isLoadingCommissions}
        >
          Generate Commissions
        </Button>
      </div>
    </div>
  );
};
