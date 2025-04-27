import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonthlyFinancialSummary, TimeFrame } from '@/types/financeTypes';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { CircleDollarSign } from 'lucide-react';
import { BatchExportDialog } from '@/components/ui/batchExportDialog';

interface FinancialOverviewProps {
  trends: MonthlyFinancialSummary[];
  timeframe?: TimeFrame;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ trends, timeframe = 'monthly' }) => {
  const latestTrend = trends[trends.length - 1];
  
  const chartData = trends.map(item => ({
    name: format(parse(item.period, 'yyyy-MM', new Date()), 'MMM yyyy'),
    income: item.total_income,
    expenses: item.total_expenses,
    profit: item.net_profit
  }));

  const kpis = [
    {
      title: "Gross Income",
      value: latestTrend?.total_income || 0,
      change: "+12.3%",
      icon: CircleDollarSign,
      color: "text-emerald-500"
    },
    {
      title: "Total Expenses",
      value: latestTrend?.total_expenses || 0,
      change: "-2.1%",
      icon: CircleDollarSign,
      color: "text-red-500"
    },
    {
      title: "Net Profit",
      value: latestTrend?.net_profit || 0,
      change: "+15.2%",
      icon: CircleDollarSign,
      color: "text-blue-500"
    },
    {
      title: "Unpaid Commissions",
      value: latestTrend?.commissions_paid || 0,
      change: "Pending",
      icon: CircleDollarSign,
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Financial Overview</h2>
        <div className="flex items-center gap-4">
          <BatchExportDialog />
          <Select defaultValue={timeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${kpi.value.toLocaleString()}</div>
              <p className={`text-xs ${kpi.color}`}>
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer 
              config={{
                income: { color: "#10b981" },
                expenses: { color: "#ef4444" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="var(--color-income)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="var(--color-expenses)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit Trend</CardTitle>
            <CardDescription>Monthly profit analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer 
              config={{
                profit: { color: "#3b82f6" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Net Profit"
                    stroke="var(--color-profit)"
                    fill="var(--color-profit)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialOverview;
