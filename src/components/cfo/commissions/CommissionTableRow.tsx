import React, { useState } from 'react';
import { PaymentStatus } from '@/types/financeTypes';
import { updateCommissionStatus } from '@/hooks/finance/queries/fetchCommissionData';
import { toast } from '@/hooks/use-toast';

interface CommissionTableRowProps {
  commission: {
    id: string;
    period: string;
    gross_income: number;
    net_income: number;
    commission_amount: number;
    payment_status: PaymentStatus;
  };
  onStatusChange?: (id: string, status: PaymentStatus) => void;
}

const CommissionTableRow: React.FC<CommissionTableRowProps> = ({ commission, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (newStatus: PaymentStatus) => {
    setIsUpdating(true);
    updateCommissionStatus(commission.id, newStatus)
      .then(() => {
        toast({
          title: "Status Updated",
          description: `Commission status changed to ${newStatus}`,
        });
        if (onStatusChange) onStatusChange(commission.id, newStatus);
      })
      .catch(err => {
        toast({
          title: "Update Failed",
          description: err.message || "Failed to update commission status",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <tr>
      <td>{commission.period}</td>
      <td>${commission.gross_income.toFixed(2)}</td>
      <td>${commission.net_income.toFixed(2)}</td>
      <td>${commission.commission_amount.toFixed(2)}</td>
      <td>
        <select
          value={commission.payment_status}
          onChange={(e) => handleStatusChange(e.target.value as PaymentStatus)}
          disabled={isUpdating}
        >
          <option value={PaymentStatus.PENDING}>Pending</option>
          <option value={PaymentStatus.APPROVED}>Approved</option>
          <option value={PaymentStatus.PAID}>Paid</option>
          <option value={PaymentStatus.REJECTED}>Rejected</option>
        </select>
      </td>
    </tr>
  );
};

export default CommissionTableRow;
