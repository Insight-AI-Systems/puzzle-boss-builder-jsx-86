
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { CommissionPayment } from '@/types/financeTypes';
import { format } from 'date-fns';

interface CommissionChartsProps {
  payments: CommissionPayment[];
}

export const CommissionCharts: React.FC<CommissionChartsProps> = ({ payments }) => {
  const chartData = payments.map(payment => ({
    name: `${payment.manager_name} - ${format(new Date(payment.period), 'MMM yyyy')}`,
    commission: payment.commission_amount
  }));

  const managerTotals = payments.reduce((acc, payment) => {
    const key = payment.manager_name;
    acc[key] = (acc[key] || 0) + payment.commission_amount;
    return acc;
  }, {} as Record<string, number>);

  const chartConfig = {
    commission: { color: '#8884d8' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Commission Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="commission" fill="#8884d8" name="Commission Amount" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission by Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(managerTotals).map(([name, total]) => ({ name, total }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total Commission" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
