
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CFOSidebar from '@/components/cfo/CFOSidebar';
import FinancialOverview from '@/components/cfo/FinancialOverview';
import IncomeStreams from '@/components/cfo/IncomeStreams';
import CostStreams from '@/components/cfo/CostStreams';
import MembershipSummary from '@/components/cfo/MembershipSummary';
import CommissionsManagement from '@/components/cfo/CommissionsManagement';
import { useFinancials } from '@/hooks/useFinancials';
import { MonthlyFinancialSummary, TimeFrame } from '@/types/financeTypes';
import { Loader2 } from 'lucide-react';
import { ErrorDisplay } from '@/components/dashboard/ErrorDisplay';

const CFODashboard = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [timeframe, setTimeframe] = useState<TimeFrame>('monthly');
  const [trends, setTrends] = useState<MonthlyFinancialSummary[]>([]);
  const [isAccessChecking, setIsAccessChecking] = useState(true);
  const { fetchMonthlyFinancialSummary, isLoading, error } = useFinancials();

  // Check if user has CFO access
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const hasCfoAccess = await hasRole('cfo');
        const hasAdminAccess = await hasRole('super_admin') || await hasRole('admin');
        
        if (!hasCfoAccess && !hasAdminAccess) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the CFO dashboard",
            variant: "destructive",
          });
          navigate('/unauthorized');
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        toast({
          title: "Authentication Error",
          description: "Unable to verify your access permissions",
          variant: "destructive",
        });
        navigate('/unauthorized');
      } finally {
        setIsAccessChecking(false);
      }
    };
    
    checkAccess();
  }, [hasRole, navigate, toast]);

  // Create a default financial summary
  const createDefaultSummary = useCallback((): MonthlyFinancialSummary => {
    return {
      period: selectedMonth,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
  }, [selectedMonth]);

  const loadFinancialData = useCallback(async () => {
    try {
      console.log('Loading financial data for', selectedMonth);
      const summary = await fetchMonthlyFinancialSummary(selectedMonth);
      
      // Set data with fallback for null
      setTrends(summary ? [summary] : [createDefaultSummary()]);
    } catch (err) {
      console.error('Error loading financial data:', err);
      toast({
        title: "Failed to load financial data",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      // Set default data to prevent showing a loading screen forever
      setTrends([createDefaultSummary()]);
    }
  }, [selectedMonth, fetchMonthlyFinancialSummary, toast, createDefaultSummary]);

  useEffect(() => {
    if (!isAccessChecking) {
      loadFinancialData();
    }
  }, [isAccessChecking, loadFinancialData]);

  const handleRetry = () => {
    loadFinancialData();
  };

  if (isAccessChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['cfo', 'super_admin', 'admin']}>
      <div className="flex min-h-screen w-full">
        <CFOSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-puzzle-aqua" />
                <p className="mt-4 text-lg">Loading financial data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="mb-6">
              <ErrorDisplay error={error.message} />
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry Loading Data
                </button>
              </div>
            </div>
          ) : (
            <Routes>
              <Route index element={<FinancialOverview trends={trends} timeframe={timeframe} />} />
              <Route path="income" element={<IncomeStreams selectedMonth={selectedMonth} />} />
              <Route path="expenses" element={<CostStreams selectedMonth={selectedMonth} />} />
              <Route path="memberships" element={<MembershipSummary selectedMonth={selectedMonth} />} />
              <Route path="commissions" element={<CommissionsManagement selectedMonth={selectedMonth} />} />
            </Routes>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CFODashboard;
