
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancials } from '@/hooks/useFinancials';
import { Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinancialDashboardHeader } from './financial-dashboard/FinancialDashboardHeader';
import { FinancialSummaryCards } from './financial-dashboard/FinancialSummaryCards';
import { FinancialTabContent } from './financial-dashboard/FinancialTabContent';
import { Button } from "@/components/ui/button";
import { exportFinancialData } from '@/utils/exportUtils';

export const FinancialDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const { fetchMonthlyFinancialSummary, fetchSiteIncomes, fetchSiteExpenses, fetchCommissionPayments } = useFinancials();
  const { toast } = useToast();

  useEffect(() => {
    const loadFinancialData = async () => {
      setIsLoading(true);
      try {
        console.log('Loading financial summary for', selectedMonth);
        const summary = await fetchMonthlyFinancialSummary(selectedMonth);
        setFinancialData(summary);
      } catch (err) {
        console.error('Error loading financial data:', err);
        toast({
          title: "Error loading financial data",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFinancialData();
  }, [selectedMonth, fetchMonthlyFinancialSummary, toast]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
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
        description: "Financial data has been exported successfully",
      });
    } catch (err) {
      console.error('Error exporting data:', err);
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "An unknown error occurred during export",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center p-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
            <p className="mt-2 text-sm text-muted-foreground">Loading financial data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <FinancialDashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onExport={handleExport}
        isExporting={exportLoading}
      />
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
