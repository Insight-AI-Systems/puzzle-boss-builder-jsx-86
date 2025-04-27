
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyFinancialSummary } from '@/types/financeTypes';

interface RevenueChartProps {
  trends: MonthlyFinancialSummary[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ trends }) => {
  const data = trends.map(t => ({
    name: t.period,
    revenue: t.total_income
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  );
};
