
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import PageLayout from '@/components/layouts/PageLayout';
import CFOSidebar from '@/components/cfo/CFOSidebar';
import FinancialOverview from '@/components/cfo/FinancialOverview';
import IncomeStreams from '@/components/cfo/IncomeStreams';
import CostStreams from '@/components/cfo/CostStreams';
import MembershipSummary from '@/components/cfo/MembershipSummary';
import CommissionsManagement from '@/components/cfo/CommissionsManagement';

const CFODashboard = () => {
  return (
    <ProtectedRoute requiredRoles={['cfo', 'super_admin']}>
      <div className="flex min-h-screen w-full">
        <CFOSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<FinancialOverview />} />
            <Route path="income" element={<IncomeStreams />} />
            <Route path="expenses" element={<CostStreams />} />
            <Route path="memberships" element={<MembershipSummary />} />
            <Route path="commissions" element={<CommissionsManagement />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CFODashboard;
