
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancials } from '@/hooks/useFinancials';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinancialDashboardHeader } from './financial-dashboard/FinancialDashboardHeader';
import { FinancialSummaryCards } from './financial-dashboard/FinancialSummaryCards';
import { FinancialTabContent } from './financial-dashboard/FinancialTabContent';
import { Button } from "@/components/ui/button";
import { exportFinancialData } from '@/utils/exportUtils';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { MonthlyFinancialSummary } from '@/types/financeTypes';

export const FinancialDashboard: React.FC = () => {
  console.log('[FINANCE UI] FinancialDashboard component rendering');
  
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [financialData, setFinancialData] = useState<MonthlyFinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [renderCount, setRenderCount] = useState(0);
  
  const { fetchMonthlyFinancialSummary, fetchSiteIncomes, fetchSiteExpenses, fetchCommissionPayments } = useFinancials();
  const { toast } = useToast();

  // Debugging - log component lifecycle
  useEffect(() => {
    console.log('[FINANCE UI] FinancialDashboard mounted or updated');
    setRenderCount(prev => prev + 1);
    console.log('[FINANCE UI] Render count:', renderCount + 1);
    
    return () => {
      console.log('[FINANCE UI] FinancialDashboard unmounting');
    };
  }, [renderCount]);

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

  // Always render a Card to prevent UI flashing
  return (
    <Card className="w-full">
      <FinancialDashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onExport={handleExport}
        isExporting={exportLoading}
      />
      <CardContent>
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
                <FinancialSummaryCards financialData={financialData} />
                
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commissions">Commissions</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  </TabsList>
                  
                  <FinancialTabContent 
                    financialData={financialData}
                    selectedMonth={selectedMonth}
                  />
                </Tabs>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
