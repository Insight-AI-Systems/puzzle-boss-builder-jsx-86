
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyFinancialSummary } from '@/types/financeTypes';

interface ExpenseTrendsChartProps {
  trends: MonthlyFinancialSummary[];
}

export const ExpenseTrendsChart: React.FC<ExpenseTrendsChartProps> = ({ trends }) => {
  const data = trends.map(t => ({
    name: t.period,
    expenses: t.total_expenses,
    income: t.total_income,
    profit: t.net_profit
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="expenses" stroke="#ff7300" />
        <Line type="monotone" dataKey="income" stroke="#387908" />
        <Line type="monotone" dataKey="profit" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};
