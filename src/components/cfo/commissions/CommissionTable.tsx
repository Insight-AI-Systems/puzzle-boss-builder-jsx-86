
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';
import { CommissionTableHeader } from './CommissionTableHeader';
import CommissionTableRow from './CommissionTableRow';

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
      <CommissionTableHeader
        hasPayments={payments.length > 0}
        selectedCount={selectedPayments.length}
        totalCount={payments.length}
        onSelectAll={onSelectAll}
      />
      <TableBody>
        {payments.map((payment) => (
          <CommissionTableRow
            key={payment.id}
            payment={payment}
            isSelected={selectedPayments.includes(payment.id)}
            onSelectPayment={onSelectPayment}
            getStatusColor={getStatusColor}
            onManagerSelect={onManagerSelect}
          />
        ))}
      </TableBody>
    </Table>
  );
};
