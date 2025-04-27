
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface CommissionTableHeaderProps {
  hasPayments: boolean;
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
}

export const CommissionTableHeader: React.FC<CommissionTableHeaderProps> = ({
  hasPayments,
  selectedCount,
  totalCount,
  onSelectAll
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox
            checked={hasPayments && selectedCount === totalCount}
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
  );
};
