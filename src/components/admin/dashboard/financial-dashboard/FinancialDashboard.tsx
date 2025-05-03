
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancials } from '@/hooks/useFinancials';
import { useToast } from '@/hooks/use-toast';
import { FinancialDashboardHeader } from './FinancialDashboardHeader';
import { FinancialSummaryCards } from './FinancialSummaryCards';
import { MonthlyFinancialSummary } from '@/types/financeTypes';
import { FinanceTabContent } from './FinanceTabContent';
import { XeroTabContent } from './XeroTabContent';
import { WebhookTabContent } from './WebhookTabContent';
import { XeroService } from '@/services/xero';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { DashboardTabs } from './DashboardTabs';
import { useXeroConnection } from './hooks/useXeroConnection';
import { useFinancialDataLoader } from './hooks/useFinancialDataLoader';

export const FinancialDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { toast } = useToast();
  const { isConnecting, handleConnectToXero } = useXeroConnection(toast);
  const { 
    financialData, 
    isLoading, 
    loadError,
    handleRetry,
    fetchSiteIncomes,
    fetchSiteExpenses,
    fetchCommissionPayments
  } = useFinancialDataLoader(selectedMonth);

  // Check for Xero connection success/error from URL parameters only once
  useEffect(() => {
    const url = new URL(window.location.href);
    const xeroConnected = url.searchParams.get('xero_connected');
    const xeroError = url.searchParams.get('xero_error');
    
    if (xeroConnected === 'true') {
      toast({
        title: "Xero Connected",
        description: "Successfully connected to Xero",
        variant: "default",
      });
      
      // Remove the parameter from URL to prevent showing the toast again on refresh
      url.searchParams.delete('xero_connected');
      window.history.replaceState({}, '', url.toString());
    }
    
    if (xeroError) {
      toast({
        title: "Xero Connection Error",
        description: decodeURIComponent(xeroError),
        variant: "destructive",
      });
      
      // Remove the parameter from URL
      url.searchParams.delete('xero_error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [toast]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
  };

  const handleExport = async () => {
    try {
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
        // Fetch all required data
        const [incomeData, expenseData, commissionData] = await Promise.all([
          fetchSiteIncomes(startDate, endDate),
          fetchSiteExpenses(selectedMonth),
          fetchCommissionPayments()
        ]);
        
        // Filter commission data for the selected month
        const filteredCommissions = commissionData.filter(c => c.period === selectedMonth);
        
        // Export the data
        await exportFinancialData(incomeData, expenseData, filteredCommissions, selectedMonth);
        
        toast({
          title: "Export completed",
          description: `Financial data has been exported successfully`,
        });
      } catch (exportErr) {
        console.error('Error during export:', exportErr);
        toast({
          title: "Export failed",
          description: exportErr instanceof Error ? exportErr.message : "An unknown error occurred during export",
          variant: "destructive",
        });
      }
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <FinancialDashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onExport={handleExport}
        isExporting={exportLoading}
        onConnectToXero={handleConnectToXero}
        isConnectingXero={isConnecting}
      />
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {loadError && <ErrorState error={loadError} onRetry={handleRetry} />}
            
            {/* Always render financial data UI with guaranteed valid data */}
            {financialData && (
              <>
                <FinancialSummaryCards financialData={financialData} />
                
                <DashboardTabs 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  selectedMonth={selectedMonth}
                />
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const exportFinancialData = async (incomeData: any[], expenseData: any[], commissionData: any[], month: string) => {
  const { exportFinancialData: exportData } = await import('@/utils/exportUtils');
  return exportData(incomeData, expenseData, commissionData, month);
};
