
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';

interface CommissionTableProps {
  payments: CommissionPayment[];
  selectedPayments: string[];
  onSelectPayment: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  getStatusColor: (status: PaymentStatus) => string;
  onManagerSelect: (payment: CommissionPayment) => void;
}

export const CommissionTable: React.FC<CommissionTableProps> = ({
  payments,
  selectedPayments,
  onSelectPayment,
  onSelectAll,
  getStatusColor,
  onManagerSelect
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={payments.length > 0 && selectedPayments.length === payments.length}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
          <TableHead>Manager</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              <Checkbox
                checked={selectedPayments.includes(payment.id)}
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
        ))}
      </TableBody>
    </Table>
  );
};
