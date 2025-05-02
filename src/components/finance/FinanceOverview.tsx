
import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FinanceChart } from './charts/FinanceChart';

export function FinanceOverview() {
  const { summary, incomes, expenses, currentPeriod } = useFinance();

  // Generate metrics for display
  const metrics = [
    {
      label: 'Commission Paid',
      value: summary?.commissions_paid || 0,
      color: 'text-blue-500',
    },
    {
      label: 'Prize Expenses',
      value: summary?.prize_expenses || 0,
      color: 'text-purple-500',
    },
  ];

  // Process income data for charts
  const incomeBySource = incomes.reduce((acc, income) => {
    const sourceType = income.source_type;
    acc[sourceType] = (acc[sourceType] || 0) + income.amount;
    return acc;
  }, {} as Record<string, number>);

  const incomeChartData = Object.entries(incomeBySource).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Process expense data for charts
  const expenseByType = expenses.reduce((acc, expense) => {
    const expenseType = expense.expense_type;
    acc[expenseType] = (acc[expenseType] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expenseByType).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income Breakdown</CardTitle>
            <CardDescription>
              Income by source for {currentPeriod.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {incomeChartData.length > 0 ? (
              <FinanceChart
                data={incomeChartData}
                type="pie"
                colors={['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No income data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>
              Expenses by type for {currentPeriod.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {expenseChartData.length > 0 ? (
              <FinanceChart
                data={expenseChartData}
                type="pie"
                colors={['#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#0ea5e9']}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Metrics</CardTitle>
          <CardDescription>
            Key financial indicators for {currentPeriod.label}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col p-4 border rounded-lg"
              >
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <p className={`text-2xl font-bold ${metric.color}`}>
                  ${metric.value.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
