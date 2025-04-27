
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useFinancials } from '@/hooks/useFinancials';
import { Loader2, Download } from 'lucide-react';
import { MonthlyFinancialSummary, PaymentStatus } from '@/types/financeTypes';

export const FinancialDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [trendData, setTrendData] = useState<MonthlyFinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchMonthlyFinancialSummary } = useFinancials();

  useEffect(() => {
    const loadFinancialData = async () => {
      setIsLoading(true);
      try {
        const summary = await fetchMonthlyFinancialSummary(selectedMonth);
        if (summary) {
          setTrendData(summary);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFinancialData();
  }, [selectedMonth, fetchMonthlyFinancialSummary]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthStr = format(date, 'yyyy-MM');
    months.push({ value: monthStr, label: format(date, 'MMMM yyyy') });
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Financial Dashboard</CardTitle>
          <CardDescription>Loading financial data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Financial Dashboard</CardTitle>
          <CardDescription>Revenue tracking and financial reports</CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded px-3 py-2 bg-background"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${trendData?.total_income.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {trendData?.total_income && trendData.total_income > 0
                  ? 'For selected period'
                  : 'No revenue data available'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${trendData?.total_expenses.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {trendData?.total_expenses && trendData.total_expenses > 0
                  ? 'For selected period'
                  : 'No expense data available'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${trendData?.net_profit && trendData.net_profit < 0 ? 'text-red-500' : 'text-green-500'}`}>
                ${trendData?.net_profit.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {trendData?.net_profit
                  ? `${trendData.net_profit >= 0 ? 'Profit' : 'Loss'} for period`
                  : 'No profit data available'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
                <CardDescription>Key financial metrics for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {trendData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Commissions Paid</h4>
                        <p className="text-lg">${trendData.commissions_paid.toFixed(2)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Prize Expenses</h4>
                        <p className="text-lg">${trendData.prize_expenses.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        For more detailed financial information, visit the 
                        <Button variant="link" className="h-auto p-0 ml-1" asChild>
                          <a href="/cfo-dashboard">Full CFO Dashboard</a>
                        </Button>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No financial data available for this period.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commission Summary</CardTitle>
                <CardDescription>Current commission status and amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm font-medium">Commissions for {format(new Date(`${selectedMonth}-01`), 'MMMM yyyy')}</p>
                  <p className="text-sm">
                    To view and manage detailed commission information, please visit the 
                    <Button variant="link" className="h-auto p-0 mx-1" asChild>
                      <a href="/cfo-dashboard/commissions">Commission Management</a>
                    </Button>
                    page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expense Summary</CardTitle>
                <CardDescription>Expense breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm font-medium">Expenses for {format(new Date(`${selectedMonth}-01`), 'MMMM yyyy')}</p>
                  <p className="text-sm">
                    For a detailed breakdown of expenses, please visit the 
                    <Button variant="link" className="h-auto p-0 mx-1" asChild>
                      <a href="/cfo-dashboard/expenses">Cost Streams</a>
                    </Button>
                    page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
