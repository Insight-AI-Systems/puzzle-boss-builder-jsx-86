
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFinancials } from '@/hooks/useFinancials';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinancialDashboardHeader } from './FinancialDashboardHeader';
import { FinancialSummaryCards } from './FinancialSummaryCards';
import { Button } from "@/components/ui/button";
import { exportFinancialData } from '@/utils/exportUtils';
import { ErrorDisplay } from '@/components/dashboard/ErrorDisplay';
import { MonthlyFinancialSummary } from '@/types/financeTypes';

export const FinancialDashboard: React.FC = () => {
  console.log('[FINANCE UI] FinancialDashboard component rendering');
  
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [financialData, setFinancialData] = useState<MonthlyFinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { fetchMonthlyFinancialSummary, fetchSiteIncomes, fetchSiteExpenses, fetchCommissionPayments } = useFinancials();
  const { toast } = useToast();

  // Create default summary object to prevent null values
  const createDefaultSummary = useCallback((period: string): MonthlyFinancialSummary => {
    console.log('[FINANCE UI] Creating default summary for period:', period);
    return {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
  }, []);

  const loadFinancialData = useCallback(async () => {
    console.log('[FINANCE UI] loadFinancialData called for month:', selectedMonth);
    setIsLoading(true);
    setLoadError(null);
    
    try {
      console.log('[FINANCE UI] Attempting to fetch financial summary');
      let summary: MonthlyFinancialSummary | null = null;
      
      try {
        console.log('[FINANCE UI] Calling fetchMonthlyFinancialSummary');
        summary = await fetchMonthlyFinancialSummary(selectedMonth);
        console.log('[FINANCE UI] fetchMonthlyFinancialSummary returned:', summary);
      } catch (fetchError) {
        console.error('[FINANCE UI] Error in fetchMonthlyFinancialSummary:', fetchError);
        // Even if the fetch fails, we'll still set default data below
      }
      
      // Always set valid data to prevent rendering issues
      const finalData = summary || createDefaultSummary(selectedMonth);
      console.log('[FINANCE UI] Setting financial data state to:', finalData);
      setFinancialData(finalData);
      
    } catch (err) {
      console.error('[FINANCE UI] Error loading financial data:', err);
      setLoadError(err instanceof Error ? err : new Error('Unknown error occurred'));
      // Set fallback data even on error
      console.log('[FINANCE UI] Setting fallback data after error');
      setFinancialData(createDefaultSummary(selectedMonth));
      
      toast({
        title: "Error loading financial data",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      console.log('[FINANCE UI] Finished loading data, setting isLoading = false');
      setIsLoading(false);
    }
  }, [selectedMonth, fetchMonthlyFinancialSummary, createDefaultSummary, toast]);
  
  useEffect(() => {
    console.log('[FINANCE UI] useEffect - loadFinancialData dependency changed');
    loadFinancialData();
  }, [loadFinancialData]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = event.target.value;
    console.log('[FINANCE UI] Month changed to:', newMonth);
    setSelectedMonth(newMonth);
  };

  const handleExport = async () => {
    try {
      console.log('[FINANCE UI] Export initiated');
      setExportLoading(true);
      toast({
        title: "Export initiated",
        description: "Your financial data is being prepared for export",
      });
      
      // Set date range for the selected month
      const startDate = `${selectedMonth}-01`;
      const lastDay = new Date(parseInt(selectedMonth.slice(0, 4)), parseInt(selectedMonth.slice(5, 7)), 0).getDate();
      const endDate = `${selectedMonth}-${lastDay}`;
      
      try {
        console.log('[FINANCE UI] Fetching export data');
        // Fetch all required data
        const [incomeData, expenseData, commissionData] = await Promise.all([
          fetchSiteIncomes(startDate, endDate),
          fetchSiteExpenses(selectedMonth),
          fetchCommissionPayments()
        ]);
        
        // Filter commission data for the selected month
        const filteredCommissions = commissionData.filter(c => c.period === selectedMonth);
        
        // Export the data
        console.log('[FINANCE UI] Calling exportFinancialData function');
        await exportFinancialData(incomeData, expenseData, filteredCommissions, selectedMonth);
        
        toast({
          title: "Export completed",
          description: `Financial data has been exported successfully`,
        });
      } catch (exportErr) {
        console.error('[FINANCE UI] Error during export:', exportErr);
        toast({
          title: "Export failed",
          description: exportErr instanceof Error ? exportErr.message : "An unknown error occurred during export",
          variant: "destructive",
        });
      }
    } finally {
      console.log('[FINANCE UI] Export completed, resetting export loading state');
      setExportLoading(false);
    }
  };

  const handleRetry = () => {
    console.log('[FINANCE UI] Retry button clicked');
    loadFinancialData();
  };

  console.log('[FINANCE UI] FinancialDashboard render state:', { 
    isLoading, 
    hasError: !!loadError, 
    hasFinancialData: !!financialData,
    selectedMonth
  });

  // Simple placeholder for tab content
  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="grid gap-4 mt-4">
          <div className="p-4 rounded-lg bg-card">
            <h3 className="text-lg font-medium">Financial Overview</h3>
            <p className="text-muted-foreground">Financial summary for {selectedMonth}</p>
          </div>
        </div>
      );
    } else if (activeTab === 'commissions') {
      return (
        <div className="grid gap-4 mt-4">
          <div className="p-4 rounded-lg bg-card">
            <h3 className="text-lg font-medium">Commission Management</h3>
            <p className="text-muted-foreground">Manage category manager commissions</p>
          </div>
        </div>
      );
    } else if (activeTab === 'expenses') {
      return (
        <div className="grid gap-4 mt-4">
          <div className="p-4 rounded-lg bg-card">
            <h3 className="text-lg font-medium">Expense Tracking</h3>
            <p className="text-muted-foreground">Track and manage expenses</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Always render a Card to prevent UI flashing
  return (
    <Card className="w-full">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Dashboard</h2>
          <p className="text-muted-foreground">Manage financial data and reporting</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            className="px-3 py-2 rounded border"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
            <option value="2024-04">April 2024</option>
            <option value="2024-05">May 2024</option>
          </select>
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={exportLoading}
          >
            {exportLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Export
          </Button>
        </div>
      </div>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
              <p className="mt-2 text-sm text-muted-foreground">Loading financial data...</p>
            </div>
          </div>
        ) : (
          <>
            {loadError && (
              <div className="mb-4">
                <ErrorDisplay error={loadError.message} />
                <div className="flex justify-center mt-2">
                  <Button 
                    onClick={handleRetry}
                    variant="outline" 
                    size="sm"
                  >
                    Retry Loading Data
                  </Button>
                </div>
              </div>
            )}
            
            {/* Always render financial data UI with guaranteed valid data */}
            {financialData && (
              <>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
                    <div className="text-2xl font-bold">${financialData.total_income.toFixed(2)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm font-medium text-muted-foreground">Total Expenses</div>
                    <div className="text-2xl font-bold">${financialData.total_expenses.toFixed(2)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm font-medium text-muted-foreground">Net Profit</div>
                    <div className="text-2xl font-bold">${financialData.net_profit.toFixed(2)}</div>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commissions">Commissions</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab}>
                    {renderTabContent()}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
