
import React, { useState, useEffect } from 'react';
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
    if (!hasRole('cfo') && !hasRole('super_admin') && !hasRole('admin')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the CFO dashboard",
        variant: "destructive",
      });
      navigate('/unauthorized');
    }
  }, [hasRole, navigate, toast]);

  useEffect(() => {
    const loadFinancialData = async () => {
      const summary = await fetchMonthlyFinancialSummary(selectedMonth);
      if (summary) {
        setTrends([summary]);
      }
    };
    loadFinancialData();
  }, [selectedMonth, fetchMonthlyFinancialSummary]);

  return (
    <ProtectedRoute requiredRoles={['cfo', 'super_admin', 'admin']}>
      <div className="flex min-h-screen w-full">
        <CFOSidebar />
        <main className="flex-1 p-6">
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
