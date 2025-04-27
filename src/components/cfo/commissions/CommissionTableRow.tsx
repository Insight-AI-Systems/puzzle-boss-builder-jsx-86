
import React from 'react';
import { format } from 'date-fns';
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';

interface CommissionTableRowProps {
  payment: CommissionPayment;
  isSelected: boolean;
  onSelectPayment: (id: string) => void;
  getStatusColor: (status: PaymentStatus) => string;
  onManagerSelect: (payment: CommissionPayment) => void;
}

export const CommissionTableRow: React.FC<CommissionTableRowProps> = ({
  payment,
  isSelected,
  onSelectPayment,
  getStatusColor,
  onManagerSelect
}) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelectPayment(payment.id)}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => onManagerSelect(payment)}
        >
          {payment.manager_name}
        </Button>
      </TableCell>
      <TableCell>{payment.category_name}</TableCell>
      <TableCell>{format(new Date(payment.period), 'MMM yyyy')}</TableCell>
      <TableCell>${payment.commission_amount.toFixed(2)}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(payment.payment_status)}`}>
          {payment.payment_status}
        </span>
      </TableCell>
      <TableCell>
        {payment.payment_date ? format(new Date(payment.payment_date), 'yyyy-MM-dd') : '-'}
      </TableCell>
    </TableRow>
  );
};
