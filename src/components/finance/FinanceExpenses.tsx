
import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FinanceChart } from './charts/FinanceChart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download } from 'lucide-react';
import { SiteExpense } from '@/types/finance';

export function FinanceExpenses() {
  const { expenses, exportData, currentPeriod } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof SiteExpense>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort expense records
  const filteredExpenses = expenses
    .filter((expense) => {
      if (!searchTerm) return true;
      const searchTermLower = searchTerm.toLowerCase();
      
      return (
        expense.expense_type?.toLowerCase().includes(searchTermLower) ||
        expense.payee?.toLowerCase().includes(searchTermLower) ||
        expense.notes?.toLowerCase().includes(searchTermLower) ||
        (expense.categories?.name || '').toLowerCase().includes(searchTermLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string comparison
      const aString = String(aValue || '');
      const bString = String(bValue || '');

      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });

  // Handle sort
  const handleSort = (field: keyof SiteExpense) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Process expense data for charts
  const expenseByType = expenses.reduce((acc, expense) => {
    const expenseType = expense.expense_type;
    acc[expenseType] = (acc[expenseType] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expenseByType).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Calculate totals
  const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          className="flex items-center gap-2 self-start"
          onClick={exportData}
        >
          <Download className="h-4 w-4" />
          Export Expense Data
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Summary - {currentPeriod.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Number of Transactions</p>
                <p className="text-2xl font-bold">{filteredExpenses.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Average Transaction</p>
                <p className="text-2xl font-bold">
                  ${filteredExpenses.length > 0
                    ? (totalAmount / filteredExpenses.length).toFixed(2)
                    : '0.00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {expenseChartData.length > 0 ? (
              <FinanceChart
                data={expenseChartData}
                type="pie"
                colors={['#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#0ea5e9']}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('date')}
                  >
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('expense_type')}
                  >
                    Type {sortField === 'expense_type' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('amount')}
                  >
                    Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="capitalize">{expense.expense_type}</TableCell>
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>{expense.categories?.name || 'N/A'}</TableCell>
                      <TableCell>{expense.payee || 'N/A'}</TableCell>
                      <TableCell>{expense.notes || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No expense records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
