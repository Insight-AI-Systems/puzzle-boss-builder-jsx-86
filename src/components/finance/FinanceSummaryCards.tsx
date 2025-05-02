
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { ArrowDown, ArrowUp } from 'lucide-react';

export function FinanceSummaryCards() {
  const { summary, currentPeriod } = useFinance();
  
  const totalIncome = summary?.total_income ?? 0;
  const totalExpenses = summary?.total_expenses ?? 0;
  const netProfit = summary?.net_profit ?? 0;
  const isProfitable = netProfit >= 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Revenue
          </CardTitle>
          <ArrowUp className={`h-4 w-4 text-emerald-500`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {currentPeriod.label}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Expenses
          </CardTitle>
          <ArrowDown className={`h-4 w-4 text-rose-500`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {currentPeriod.label}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Net Profit
          </CardTitle>
          {isProfitable ? (
            <ArrowUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-rose-500" />
          )}
        </CardHeader>
        <CardContent>
          <div 
            className={`text-2xl font-bold ${
              isProfitable ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            ${netProfit.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {currentPeriod.label}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
