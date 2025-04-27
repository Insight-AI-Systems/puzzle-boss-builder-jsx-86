
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { SiteExpense } from '@/types/financeTypes';

interface ExpenseTableProps {
  expenses: SiteExpense[];
  onSelectExpense: (expense: SiteExpense) => void;
}

export const ExpenseTable = ({ expenses, onSelectExpense }: ExpenseTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payee</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow 
            key={expense.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSelectExpense(expense)}
          >
            <TableCell>{format(new Date(expense.date), 'yyyy-MM-dd')}</TableCell>
            <TableCell>{expense.expense_type}</TableCell>
            <TableCell>${expense.amount.toFixed(2)}</TableCell>
            <TableCell>{expense.payee}</TableCell>
            <TableCell>{expense.categories?.name}</TableCell>
            <TableCell>{expense.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
