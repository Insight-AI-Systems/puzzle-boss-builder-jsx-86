
import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download } from 'lucide-react';
import { SiteIncome } from '@/types/finance';

export function FinanceIncomes() {
  const { incomes, exportData, currentPeriod } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof SiteIncome>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort income records
  const filteredIncomes = incomes
    .filter((income) => {
      if (!searchTerm) return true;
      const searchTermLower = searchTerm.toLowerCase();
      
      return (
        income.source_type?.toLowerCase().includes(searchTermLower) ||
        income.method?.toLowerCase().includes(searchTermLower) ||
        income.notes?.toLowerCase().includes(searchTermLower) ||
        (income.categories?.name || '').toLowerCase().includes(searchTermLower) ||
        (income.profiles?.username || '').toLowerCase().includes(searchTermLower)
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
  const handleSort = (field: keyof SiteIncome) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate totals
  const totalAmount = filteredIncomes.reduce((acc, income) => acc + income.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Input
          placeholder="Search incomes..."
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
          Export Income Data
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Income Summary - {currentPeriod.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Number of Transactions</p>
              <p className="text-2xl font-bold">{filteredIncomes.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Average Transaction</p>
              <p className="text-2xl font-bold">
                ${filteredIncomes.length > 0
                  ? (totalAmount / filteredIncomes.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
                    onClick={() => handleSort('source_type')}
                  >
                    Source {sortField === 'source_type' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('amount')}
                  >
                    Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncomes.length > 0 ? (
                  filteredIncomes.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>
                        {new Date(income.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="capitalize">{income.source_type}</TableCell>
                      <TableCell>${income.amount.toFixed(2)}</TableCell>
                      <TableCell>{income.categories?.name || 'N/A'}</TableCell>
                      <TableCell>{income.profiles?.username || 'N/A'}</TableCell>
                      <TableCell>{income.method}</TableCell>
                      <TableCell>{income.notes || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No income records found
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
