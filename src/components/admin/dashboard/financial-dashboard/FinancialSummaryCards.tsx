
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MonthlyFinancialSummary } from '@/types/financeTypes';

interface FinancialSummaryCardsProps {
  financialData: MonthlyFinancialSummary | null;
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({ financialData }) => {
  const totalIncome = financialData?.total_income ?? 0;
  const totalExpenses = financialData?.total_expenses ?? 0;
  const netProfit = financialData?.net_profit ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalIncome > 0 ? 'For selected period' : 'No revenue data available'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalExpenses > 0 ? 'For selected period' : 'No expense data available'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netProfit < 0 ? 'text-red-500' : 'text-green-500'}`}>
            ${netProfit.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {netProfit !== 0 ? `${netProfit >= 0 ? 'Profit' : 'Loss'} for period` : 'No profit data available'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
