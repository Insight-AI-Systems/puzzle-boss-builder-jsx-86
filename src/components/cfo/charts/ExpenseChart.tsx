
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MonthlyFinancialSummary } from '@/types/financeTypes';

interface ExpenseChartProps {
  trends: MonthlyFinancialSummary[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ trends }) => {
  const data = trends.map(t => [
    { name: 'Commissions', value: t.commissions_paid },
    { name: 'Prize Expenses', value: t.prize_expenses },
    { name: 'Other Expenses', value: t.total_expenses - t.commissions_paid - t.prize_expenses }
  ]).flat();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
