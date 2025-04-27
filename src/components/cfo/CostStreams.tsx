
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenseRecords } from '@/hooks/useExpenseRecords';
import { format } from 'date-fns';
import { SiteExpense, ExpenseType } from '@/types/financeTypes';
import { 
  BarChart,
  Bar,
  PieChart, 
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const EXPENSE_COLORS = {
  prizes: '#D3E4FD',
  commissions: '#7E69AB',
  salaries: '#FEC6A1',
  infrastructure: '#ea384c',
  other: '#ff9966'
};

const CostStreams: React.FC<{ selectedMonth: string }> = ({ selectedMonth }) => {
  const [expenses, setExpenses] = useState<SiteExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<SiteExpense[]>([]);
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<ExpenseType | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchExpenseRecords, exportToCSV, isLoading, error } = useExpenseRecords();

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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Expenses</h2>
        <Button onClick={handleExport}>Export to CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Type</CardTitle>
            <CardDescription>Monthly distribution of expenses</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expensesByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {expensesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[entry.name as keyof typeof EXPENSE_COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prizes and Commissions</CardTitle>
            <CardDescription>Distribution of prize expenses and commissions</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByType.filter(expense => 
                    expense.name === 'prizes' || expense.name === 'commissions'
                  )}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {expensesByType
                    .filter(expense => expense.name === 'prizes' || expense.name === 'commissions')
                    .map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={EXPENSE_COLORS[entry.name as 'prizes' | 'commissions']}
                      />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Expense Records</CardTitle>
            <div className="flex gap-4">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select 
                value={expenseTypeFilter} 
                onValueChange={(value) => setExpenseTypeFilter(value as ExpenseType)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="prizes">Prizes</SelectItem>
                  <SelectItem value="salaries">Salaries</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="commissions">Commissions</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CostStreams;
