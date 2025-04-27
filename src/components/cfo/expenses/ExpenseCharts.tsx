
import React from 'react';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

const EXPENSE_COLORS = {
  prizes: '#D3E4FD',
  commissions: '#7E69AB',
  salaries: '#FEC6A1',
  infrastructure: '#ea384c',
  other: '#ff9966'
};

interface ExpenseChartsProps {
  expensesByType: Array<{ name: string; value: number; }>;
}

export const ExpenseCharts = ({ expensesByType }: ExpenseChartsProps) => {
  return (
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
  );
};
