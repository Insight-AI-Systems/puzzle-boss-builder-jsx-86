
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseType, SiteExpense } from '@/types/financeTypes';
import { useExpenseRecords } from '@/hooks/useExpenseRecords';
import { ExpenseDetail } from './details/ExpenseDetail';
import { ExpenseCharts } from './expenses/ExpenseCharts';
import { ExpenseFilters } from './expenses/ExpenseFilters';
import { ExpenseTable } from './expenses/ExpenseTable';

const CostStreams: React.FC<{ selectedMonth: string }> = ({ selectedMonth }) => {
  const [expenses, setExpenses] = useState<SiteExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<SiteExpense[]>([]);
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<ExpenseType | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<SiteExpense | null>(null);
  const { fetchExpenseRecords, exportToCSV, isLoading } = useExpenseRecords();

  useEffect(() => {
    const loadExpenses = async () => {
      const startDate = `${selectedMonth}-01`;
      const endDate = `${selectedMonth}-31`;
      const expensesData = await fetchExpenseRecords(startDate, endDate);
      setExpenses(expensesData);
      setFilteredExpenses(expensesData);
    };
    loadExpenses();
  }, [selectedMonth, fetchExpenseRecords]);

  useEffect(() => {
    let filtered = expenses;
    
    if (expenseTypeFilter) {
      filtered = filtered.filter(expense => expense.expense_type === expenseTypeFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.payee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, expenseTypeFilter, searchTerm]);

  const expensesByType = Object.entries(
    expenses.reduce((acc, curr) => {
      const type = curr.expense_type;
      acc[type] = (acc[type] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const handleExport = () => {
    exportToCSV(filteredExpenses, `expenses-${selectedMonth}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <Button onClick={handleExport}>Export to CSV</Button>
      </div>

      <ExpenseCharts expensesByType={expensesByType} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Expense Records</CardTitle>
            <ExpenseFilters 
              searchTerm={searchTerm}
              expenseTypeFilter={expenseTypeFilter}
              onSearchChange={setSearchTerm}
              onTypeChange={setExpenseTypeFilter}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ExpenseTable 
            expenses={filteredExpenses}
            onSelectExpense={setSelectedExpense}
          />
        </CardContent>
      </Card>

      {selectedExpense && (
        <ExpenseDetail
          expense={selectedExpense}
          open={!!selectedExpense}
          onOpenChange={(open) => !open && setSelectedExpense(null)}
        />
      )}
    </div>
  );
};

export default CostStreams;
