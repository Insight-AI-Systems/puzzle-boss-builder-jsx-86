
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseType, SiteExpense } from '@/types/financeTypes';
import { useFinancials } from '@/hooks/useFinancials';
import { ExpenseDetail } from './details/ExpenseDetail';
import { ExpenseCharts } from './expenses/ExpenseCharts';
import { ExpenseFilters } from './expenses/ExpenseFilters';
import { ExpenseTable } from './expenses/ExpenseTable';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';

const CostStreams: React.FC<{ selectedMonth: string }> = ({ selectedMonth }) => {
  const [expenses, setExpenses] = useState<SiteExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<SiteExpense[]>([]);
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<ExpenseType | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<SiteExpense | null>(null);
  const { fetchSiteExpenses, isLoading } = useFinancials();
  const { exportDataToCSV } = useFinancialRecords();

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const expensesData = await fetchSiteExpenses(selectedMonth);
        setExpenses(expensesData);
        setFilteredExpenses(expensesData);
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    };
    loadExpenses();
  }, [selectedMonth, fetchSiteExpenses]);

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

  // Prepare chart data
  const expensesByType = Object.entries(
    expenses.reduce((acc, curr) => {
      const type = curr.expense_type;
      acc[type] = (acc[type] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const handleExport = () => {
    exportDataToCSV(filteredExpenses, `expenses-${selectedMonth}`);
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
          {filteredExpenses.length > 0 ? (
            <ExpenseTable 
              expenses={filteredExpenses}
              onSelectExpense={setSelectedExpense}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expenses found for the selected criteria.</p>
            </div>
          )}
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
