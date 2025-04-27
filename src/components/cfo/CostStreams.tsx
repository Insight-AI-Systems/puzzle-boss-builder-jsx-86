import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { useFinancials } from '@/hooks/useFinancials';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { format } from 'date-fns';
import { SiteExpense } from '@/types/financeTypes';

const CostStreams: React.FC<{ selectedMonth: string }> = ({ selectedMonth }) => {
  const { fetchSiteExpenses } = useFinancials();
  const { fetchExpenseRecords, exportDataToCSV } = useFinancialRecords();
  const [expenses, setExpenses] = useState<SiteExpense[]>([]);

  useEffect(() => {
    const loadExpenses = async () => {
      const expensesData = await fetchSiteExpenses(selectedMonth);
      setExpenses(expensesData);
    };
    loadExpenses();
  }, [selectedMonth, fetchSiteExpenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Streams</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Expense Type</TableHead>
              <TableHead>Payee</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{format(new Date(expense.date), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{expense.expense_type}</TableCell>
                <TableCell>{expense.payee}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{expense.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CostStreams;
