
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { CommissionPayment } from '@/types/financeTypes';

interface CommissionTableProps {
  payments: CommissionPayment[];
  selectedPayments: string[];
  onSelectPayment: (paymentId: string) => void;
  onSelectAll: (checked: boolean) => void;
  getStatusColor: (status: string) => string;
}

export const CommissionTable: React.FC<CommissionTableProps> = ({
  payments,
  selectedPayments,
  onSelectPayment,
  onSelectAll,
  getStatusColor,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedPayments.length === payments.length && payments.length > 0}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
          <TableHead>Manager</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Gross Income</TableHead>
          <TableHead>Net Income</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Email Status</TableHead>
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
            <TableCell>{payment.manager_name}</TableCell>
            <TableCell>{payment.category_name}</TableCell>
            <TableCell>{format(new Date(payment.period), 'MMM yyyy')}</TableCell>
            <TableCell>${payment.gross_income.toFixed(2)}</TableCell>
            <TableCell>${payment.net_income.toFixed(2)}</TableCell>
            <TableCell className="font-medium text-purple-600">
              ${payment.commission_amount.toFixed(2)}
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.payment_status)}`}>
                {payment.payment_status}
              </span>
            </TableCell>
            <TableCell>
              {payment.email_status === 'sent' ? (
                <span className="text-green-600 text-sm">
                  Sent {payment.email_sent_at && new Date(payment.email_sent_at).toLocaleDateString()}
                </span>
              ) : payment.email_status === 'error' ? (
                <span className="text-red-600 text-sm" title={payment.email_error || ''}>
                  Failed to send
                </span>
              ) : (
                <span className="text-gray-500 text-sm">Not sent</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
