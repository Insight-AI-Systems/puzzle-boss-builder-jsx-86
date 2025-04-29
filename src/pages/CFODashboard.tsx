
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
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

const CFODashboard = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [timeframe, setTimeframe] = useState<TimeFrame>('monthly');
  const [trends, setTrends] = useState<MonthlyFinancialSummary[]>([]);
  const { fetchMonthlyFinancialSummary, isLoading, error } = useFinancials();

  // Check if user has CFO access
  useEffect(() => {
    const checkAccess = async () => {
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
    };
    
    checkAccess();
  }, [hasRole, navigate, toast]);

  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        console.log('Loading financial data for', selectedMonth);
        const summary = await fetchMonthlyFinancialSummary(selectedMonth);
        if (summary) {
          setTrends([summary]);
        }
      } catch (err) {
        console.error('Error loading financial data:', err);
        toast({
          title: "Failed to load financial data",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive"
        });
      }
    };
    
    loadFinancialData();
  }, [selectedMonth, fetchMonthlyFinancialSummary, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-lg">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-2xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading financial data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['cfo', 'super_admin', 'admin']}>
      <div className="flex min-h-screen w-full">
        <CFOSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route index element={<FinancialOverview trends={trends} timeframe={timeframe} />} />
            <Route path="income" element={<IncomeStreams selectedMonth={selectedMonth} />} />
            <Route path="expenses" element={<CostStreams selectedMonth={selectedMonth} />} />
            <Route path="memberships" element={<MembershipSummary selectedMonth={selectedMonth} />} />
            <Route path="commissions" element={<CommissionsManagement selectedMonth={selectedMonth} />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CFODashboard;
