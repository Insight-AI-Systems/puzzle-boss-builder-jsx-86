
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancials } from '@/hooks/useFinancials';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinancialDashboardHeader } from './financial-dashboard/FinancialDashboardHeader';
import { FinancialSummaryCards } from './financial-dashboard/FinancialSummaryCards';
import { FinancialTabContent } from './financial-dashboard/FinancialTabContent';

export const FinancialDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchMonthlyFinancialSummary } = useFinancials();
  const { toast } = useToast();

  useEffect(() => {
    const loadFinancialData = async () => {
      setIsLoading(true);
      try {
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

  const handleExport = () => {
    console.log('Exporting financial data...');
    toast({
      title: "Export initiated",
      description: "Your financial data is being prepared for export",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
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
