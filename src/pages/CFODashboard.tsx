
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CFOSidebar from '@/components/cfo/CFOSidebar';
import FinancialOverview from '@/components/cfo/FinancialOverview';
import IncomeStreams from '@/components/cfo/IncomeStreams';
import CostStreams from '@/components/cfo/CostStreams';
import MembershipSummary from '@/components/cfo/MembershipSummary';
import CommissionsManagement from '@/components/cfo/CommissionsManagement';
import { useFinancials } from '@/hooks/useFinancials';
import { MonthlyFinancialSummary, TimeFrame } from '@/types/financeTypes';

const CFODashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [timeframe, setTimeframe] = useState<TimeFrame>('monthly');
  const [trends, setTrends] = useState<MonthlyFinancialSummary[]>([]);
  const { fetchMonthlyFinancialSummary, isLoading, error } = useFinancials();

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
    <ProtectedRoute requiredRoles={['cfo', 'super_admin']}>
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
