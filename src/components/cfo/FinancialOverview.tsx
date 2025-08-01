
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RevenueChart } from './charts/RevenueChart';
import { ExpenseChart } from './charts/ExpenseChart';
import { ExpenseTrendsChart } from './charts/ExpenseTrendsChart';
import { TimeFrame } from '@/types/financeTypes';
import { format } from 'date-fns';
import { BatchExportDialog } from './BatchExportDialog';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Loader2 } from 'lucide-react';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface FinancialOverviewProps {
  timeframe: TimeFrame;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ timeframe }) => {
  const { financialSummary, isLoading, error, refreshData } = useFinancialData();
  const isMounted = useRef(true);
  
  useEffect(() => {
    console.log('[CFO UI] FinancialOverview mounted');
    return () => {
      console.log('[CFO UI] FinancialOverview unmounting');
      isMounted.current = false;
    };
  }, []);
  
  const handleRetry = () => {
    if (isMounted.current) {
      refreshData();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-lg">Loading financial data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mb-6">
        <ErrorDisplay error={error.message} />
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Loading Data
          </Button>
        </div>
      </div>
    );
  }
  
  if (!financialSummary) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">No financial data available.</p>
      </div>
    );
  }
  
  const trends = [financialSummary];
  const totalRevenue = financialSummary.total_income || 0;
  const totalExpenses = financialSummary.total_expenses || 0;
  const netProfit = financialSummary.net_profit || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Key financial metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div>
              <div className="text-sm font-medium">Total Revenue</div>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {timeframe === 'monthly' ? `For ${format(new Date(), 'MMMM')}` : 'YTD'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Total Expenses</div>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {timeframe === 'monthly' ? `For ${format(new Date(), 'MMMM')}` : 'YTD'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Net Profit</div>
              <div className="text-2xl font-bold">${netProfit.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {timeframe === 'monthly' ? `For ${format(new Date(), 'MMMM')}` : 'YTD'}
              </div>
            </div>
          </CardContent>
        </Card>
        <BatchExportDialog />
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="trends">Expense Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Chart</CardTitle>
              <CardDescription>Visual representation of revenue streams</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart trends={trends} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Chart</CardTitle>
              <CardDescription>Distribution of expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart trends={trends} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trends Chart</CardTitle>
              <CardDescription>Trends in expenses over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseTrendsChart trends={trends} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialOverview;
