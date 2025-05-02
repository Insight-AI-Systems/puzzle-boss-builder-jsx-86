
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FinancePeriodSelector } from './FinancePeriodSelector';
import { FinanceSummaryCards } from './FinanceSummaryCards';
import { FinanceOverview } from './FinanceOverview';
import { FinanceIncomes } from './FinanceIncomes';
import { FinanceExpenses } from './FinanceExpenses';
import { FinanceCommissions } from './FinanceCommissions';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import { FinanceLoading } from './states/FinanceLoading';
import { FinanceError } from './states/FinanceError';

export function FinanceDashboard() {
  const { 
    isLoading, 
    error, 
    refreshData, 
    exportData, 
    isExporting 
  } = useFinance();

  const [activeTab, setActiveTab] = React.useState('overview');

  if (isLoading) {
    return <FinanceLoading />;
  }

  if (error) {
    return <FinanceError error={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and analyze your financial data
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <FinancePeriodSelector />
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={refreshData}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>

      <FinanceSummaryCards />

      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="incomes"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Income
              </TabsTrigger>
              <TabsTrigger
                value="expenses"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Expenses
              </TabsTrigger>
              <TabsTrigger
                value="commissions"
                className="rounded-none border-b-2 border-b-transparent px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Commissions
              </TabsTrigger>
            </TabsList>
            <div className="p-4">
              <TabsContent value="overview">
                <FinanceOverview />
              </TabsContent>
              <TabsContent value="incomes">
                <FinanceIncomes />
              </TabsContent>
              <TabsContent value="expenses">
                <FinanceExpenses />
              </TabsContent>
              <TabsContent value="commissions">
                <FinanceCommissions />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
