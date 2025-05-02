
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  MonthlyFinancialSummary, 
  SiteIncome, 
  SiteExpense, 
  CommissionPayment,
  FinancialPeriod
} from '@/types/finance';
import { FinanceService } from '@/services/financeService';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface FinanceContextType {
  // Current financial data
  currentPeriod: FinancialPeriod;
  summary: MonthlyFinancialSummary | null;
  incomes: SiteIncome[];
  expenses: SiteExpense[];
  commissions: CommissionPayment[];
  
  // State flags
  isLoading: boolean;
  isExporting: boolean;
  error: Error | null;
  
  // Actions
  setPeriod: (period: FinancialPeriod) => void;
  refreshData: () => Promise<void>;
  exportData: () => Promise<void>;
  generateCommissions: () => Promise<void>;
  updateCommissionStatus: (paymentId: string, status: string) => Promise<void>;
  
  // Available options
  availablePeriods: FinancialPeriod[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  // Get current date in YYYY-MM format
  const currentMonthYear = format(new Date(), 'yyyy-MM');
  const availablePeriods = FinanceService.getAvailablePeriods();
  
  // State management
  const [currentPeriod, setCurrentPeriod] = useState<FinancialPeriod>(availablePeriods[0]);
  const [summary, setSummary] = useState<MonthlyFinancialSummary | null>(null);
  const [incomes, setIncomes] = useState<SiteIncome[]>([]);
  const [expenses, setExpenses] = useState<SiteExpense[]>([]);
  const [commissions, setCommissions] = useState<CommissionPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { toast } = useToast();
  
  // Load financial data
  const loadFinancialData = useCallback(async () => {
    if (!currentPeriod) return;
    
    setIsLoading(true);
    setError(null);
    
    const monthStr = format(new Date(currentPeriod.startDate), 'yyyy-MM');
    
    try {
      // Load data in parallel
      const [summaryData, incomesData, expensesData, commissionsData] = await Promise.all([
        FinanceService.getFinancialSummary(monthStr),
        FinanceService.getIncomes(currentPeriod.startDate, currentPeriod.endDate),
        FinanceService.getExpenses(monthStr),
        FinanceService.getCommissionPayments(monthStr)
      ]);
      
      // Update state
      setSummary(summaryData);
      setIncomes(incomesData);
      setExpenses(expensesData);
      setCommissions(commissionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error loading financial data:', err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Error loading financial data",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPeriod, toast]);
  
  // Load data when period changes
  React.useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);
  
  // Set current period
  const setPeriod = useCallback((period: FinancialPeriod) => {
    setCurrentPeriod(period);
  }, []);
  
  // Refresh financial data
  const refreshData = useCallback(async () => {
    await loadFinancialData();
    
    toast({
      title: "Data refreshed",
      description: "Financial data has been updated",
    });
  }, [loadFinancialData, toast]);
  
  // Export financial data
  const exportData = useCallback(async () => {
    if (!currentPeriod) return;
    
    setIsExporting(true);
    
    try {
      // Export each data type
      const monthStr = format(new Date(currentPeriod.startDate), 'yyyy-MM');
      
      toast({
        title: "Exporting data",
        description: "Your financial data is being prepared for export",
      });
      
      // Export summary
      if (summary) {
        FinanceService.exportToCSV([summary], `financial-summary-${monthStr}`);
      }
      
      // Export incomes
      if (incomes.length > 0) {
        FinanceService.exportToCSV(incomes, `incomes-${monthStr}`);
      }
      
      // Export expenses
      if (expenses.length > 0) {
        FinanceService.exportToCSV(expenses, `expenses-${monthStr}`);
      }
      
      // Export commissions
      if (commissions.length > 0) {
        FinanceService.exportToCSV(commissions, `commissions-${monthStr}`);
      }
      
      toast({
        title: "Export complete",
        description: "Your financial data has been exported",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error exporting financial data:', err);
      
      toast({
        title: "Error exporting data",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [currentPeriod, summary, incomes, expenses, commissions, toast]);
  
  // Generate commissions
  const generateCommissions = useCallback(async () => {
    if (!currentPeriod) return;
    
    setIsLoading(true);
    
    try {
      const monthStr = format(new Date(currentPeriod.startDate), 'yyyy-MM');
      await FinanceService.generateCommissions(monthStr);
      
      toast({
        title: "Commissions generated",
        description: "Commission calculations have been updated",
      });
      
      // Reload commissions
      const updatedCommissions = await FinanceService.getCommissionPayments(monthStr);
      setCommissions(updatedCommissions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error generating commissions:', err);
      
      toast({
        title: "Error generating commissions",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPeriod, toast]);
  
  // Update commission status
  const updateCommissionStatus = useCallback(async (paymentId: string, status: string) => {
    setIsLoading(true);
    
    try {
      await FinanceService.updateCommissionStatus(paymentId, status);
      
      toast({
        title: "Status updated",
        description: `Commission payment status updated to ${status}`,
      });
      
      // Update commissions in state
      if (currentPeriod) {
        const monthStr = format(new Date(currentPeriod.startDate), 'yyyy-MM');
        const updatedCommissions = await FinanceService.getCommissionPayments(monthStr);
        setCommissions(updatedCommissions);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error updating commission status:', err);
      
      toast({
        title: "Error updating status",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPeriod, toast]);
  
  return (
    <FinanceContext.Provider
      value={{
        currentPeriod,
        summary,
        incomes,
        expenses,
        commissions,
        isLoading,
        isExporting,
        error,
        setPeriod,
        refreshData,
        exportData,
        generateCommissions,
        updateCommissionStatus,
        availablePeriods
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  
  return context;
}
