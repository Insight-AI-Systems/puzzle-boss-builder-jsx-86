
import React, { useState } from 'react';
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';
import { updateCommissionStatus } from '@/hooks/finance/queries/fetchCommissionData';
import { toast } from '@/hooks/use-toast';
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface CommissionTableRowProps {
  payment: CommissionPayment;
  isSelected: boolean;
  onSelectPayment: (id: string) => void;
  getStatusColor: (status: PaymentStatus) => string;
  onManagerSelect: (payment: CommissionPayment) => void;
}

const CommissionTableRow: React.FC<CommissionTableRowProps> = ({ 
  payment, 
  isSelected, 
  onSelectPayment, 
  getStatusColor,
  onManagerSelect
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: PaymentStatus) => {
    setIsUpdating(true);
    try {
      await updateCommissionStatus(payment.id, newStatus as PaymentStatus);
      toast({
        title: "Status Updated",
        description: `Commission status changed to ${newStatus}`,
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update commission status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TableRow key={payment.id} className="hover:bg-muted/50">
      <TableCell className="w-12">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelectPayment(payment.id)}
        />
      </TableCell>
      <TableCell 
        className="font-medium cursor-pointer"
        onClick={() => onManagerSelect(payment)}
      >
        {payment.manager_name || 'Unknown'}
      </TableCell>
      <TableCell>{payment.category_name || 'Unknown'}</TableCell>
      <TableCell>{payment.period}</TableCell>
      <TableCell>${payment.commission_amount.toFixed(2)}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(payment.payment_status as PaymentStatus)}`}>
          {payment.payment_status}
        </span>
      </TableCell>
      <TableCell>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'Not paid'}</TableCell>
    </TableRow>
  );
};

export default CommissionTableRow;
