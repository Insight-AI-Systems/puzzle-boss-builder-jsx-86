
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyFinancialSummary } from '@/types/financeTypes';
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
  Area,
  BarChart,
  Bar
} from 'recharts';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface FinancialOverviewProps {
  trends: MonthlyFinancialSummary[];
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ trends }) => {
  // Format data for charts
  const chartData = trends.map(item => ({
    name: format(parse(item.period, 'yyyy-MM', new Date()), 'MMM yyyy'),
    income: item.total_income,
    expenses: item.total_expenses,
    profit: item.net_profit,
    prizes: item.prize_expenses,
    commissions: item.commissions_paid
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Financial Trends</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison of revenue and costs</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer 
              config={{
                income: { color: "#10b981" },
                expenses: { color: "#ef4444" },
              }}
              className="aspect-[4/3]"
            >
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
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  stroke="var(--color-income)"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  strokeWidth={2}
                  stroke="var(--color-expenses)"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Net Profit Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Net Profit Trend</CardTitle>
            <CardDescription>Monthly profit/loss visualization</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer 
              config={{
                profit: { color: "#10b981" },
              }}
              className="aspect-[4/3]"
            >
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Net Profit"
                  fill="var(--color-profit)"
                  fillOpacity={0.3}
                  stroke="var(--color-profit)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Categories Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Prizes vs Commissions</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer 
              config={{
                prizes: { color: "#f97316" },
                commissions: { color: "#8b5cf6" },
              }}
              className="aspect-[4/3]"
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="prizes" name="Prize Expenses" fill="var(--color-prizes)" />
                <Bar dataKey="commissions" name="Commission Expenses" fill="var(--color-commissions)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Financial KPIs</CardTitle>
            <CardDescription>Key performance indicators over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {trends.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Profit Margin (Latest)</p>
                    <div className="text-2xl font-bold">
                      {((chartData[chartData.length - 1].profit / chartData[chartData.length - 1].income) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Cost Ratio</p>
                    <div className="text-2xl font-bold">
                      {((chartData[chartData.length - 1].expenses / chartData[chartData.length - 1].income) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Revenue Growth</p>
                    <div className="text-2xl font-bold">
                      {chartData.length > 1 ? 
                        ((chartData[chartData.length - 1].income / chartData[chartData.length - 2].income - 1) * 100).toFixed(1) + '%' : 
                        'N/A'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Prize Expense Ratio</p>
                    <div className="text-2xl font-bold">
                      {((chartData[chartData.length - 1].prizes / chartData[chartData.length - 1].expenses) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialOverview;
